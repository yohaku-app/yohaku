import OpenAI from "openai";
import { Client as NotionClient } from "@notionhq/client";

export const runtime = "nodejs";

const notion = new NotionClient({
  auth: process.env.NOTION_API_KEY,
});

const S_MAX = 20;

// 後藤の条件（仮の計算用）
const ANNUAL_YEN = 5_000_000;
const HOURS_PER_YEAR = 2000;
const OVERTIME_MAX = 3;

function readRichText(prop: any): string {
  if (!prop) return "";

  if (prop.type === "title") {
    return prop.title?.map((x: any) => x.plain_text).join("") ?? "";
  }

  if (prop.type === "rich_text") {
    return prop.rich_text?.map((x: any) => x.plain_text).join("") ?? "";
  }

  if (prop.type === "select") {
    return prop.select?.name ?? "";
  }

  if (prop.type === "multi_select") {
    return prop.multi_select?.map((x: any) => x.name).join(", ") ?? "";
  }

  if (prop.type === "number") {
    return String(prop.number ?? "");
  }

  if (prop.type === "url") {
    return prop.url ?? "";
  }

  return "";
}

function pageToKnowledge(page: any): string {
  const p = page.properties ?? {};

  const title =
    readRichText(p["名前"]) ||
    readRichText(p["Name"]) ||
    readRichText(p["タイトル"]) ||
    "名称不明";

  const process = readRichText(p["工程"]) || readRichText(p["作業分類"]);
  const hazard = readRichText(p["災害分類"]) || readRichText(p["分類"]);
  const tags = readRichText(p["タグ"]) || readRichText(p["keywords"]);
  const text = readRichText(p["テキスト"]) || readRichText(p["内容"]);
  const yohaku = readRichText(p["YOHAKU"]) || readRichText(p["yohaku_output"]);

  return [
    `タイトル: ${title}`,
    process ? `工程: ${process}` : "",
    hazard ? `分類: ${hazard}` : "",
    tags ? `タグ: ${tags}` : "",
    text ? `内容: ${text}` : "",
    yohaku ? `YOHAKU出力: ${yohaku}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function extractJson(text: string) {
  const cleaned = text
    .replace(/^```json/i, "")
    .replace(/^```/, "")
    .replace(/```$/, "")
    .trim();

  return JSON.parse(cleaned);
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const notionDbId = process.env.NOTION_DATABASE_ID;

    if (!apiKey) {
      throw new Error("OPENAI_API_KEY が読み込めていません");
    }

    if (!notionDbId) {
      throw new Error("NOTION_DATABASE_ID が読み込めていません");
    }

    const client = new OpenAI({ apiKey });

    const body = await req.json();
    const inputText = String(body.inputText ?? "").trim();
    const imageDataUrl =
      typeof body.imageDataUrl === "string" && body.imageDataUrl.length > 0
        ? body.imageDataUrl
        : null;

    if (!inputText) {
      throw new Error("inputText が空です");
    }

    const db: any = await notion.databases.retrieve({
      database_id: notionDbId,
    });

    const dataSourceId = db.data_sources?.[0]?.id;

    if (!dataSourceId) {
      throw new Error("data_source_id が見つかりません");
    }

    const notionRes: any = await notion.dataSources.query({
      data_source_id: dataSourceId,
    });

    const knowledgeList = notionRes.results
      .map(pageToKnowledge)
      .filter(Boolean);

    const knowledgeText = knowledgeList.join("\n\n---\n\n");

    const basePrompt = `
あなたは施工管理の段取り・災害防止アシスタント「YOHAKU」です。
以下の「段取りOSデータ」を優先して参照し、今回の現場状況から
先に押さえること、緊急化しそうなこと上位3件をだしてください。

重要ルール：
- 一般論だけで終わらせない
- 段取りOSデータに近い事例があれば優先
- 文章は短く具体的に
- ベテランでも見落とすポイントを優先
- 「知っていれば防げるミス」を優先する
- 「起きる可能性がある」と気づかせることを重視する
- 段取り漏れによる“後戻り”や“手戻り”を防ぐ視点で出す
- 配列は3〜5個程度
- 冗長な説明は禁止
- 想定損失・余分労働・緊急化確率は現実的に
- 写真がある場合だけ photo_warnings を出す
- 写真がない場合は photo_warnings を [] にする
- JSONのみ返す
- 「今すぐ」ではなく「このあと詰まりやすいもの」を優先する

【段取りOSデータ】
${knowledgeText}

【今回の入力】
${inputText}

必ずJSON形式で返してください。
missing_arrangements と likely_issues は文字列配列ではなく、オブジェクト配列で返してください。
missing_arrangements の各要素は
title（何をするか）
deadline（いつまで）
reason（なぜ必要か）
を含めてください。
likely_issues の各要素は
rank（順位）
title（何が起きるか）
loss（想定損失）
overtime（余分労働）
risk（緊急化レベル）
を含めてください。

返すJSON:
{
  "risk_score_0_to_20": number,

  "missing_arrangements": [
    {
      "title": "何をするか",
      "deadline": "いつまで",
      "reason": "なぜ必要か"
    }
  ],

  "likely_issues": [
    {
      "rank": 1,
      "title": "何が起きるか",
      "loss": "想定損失",
      "overtime": "余分労働",
      "risk": "高・中・低"
    }
  ],

  "decide_today": ["..."],
  "next_missing": ["..."],
  "photo_warnings": ["..."]
}
`;

    const inputContent: any[] = [
      {
        type: "input_text",
        text: basePrompt,
      },
    ];

    if (imageDataUrl) {
      inputContent.push({
        type: "input_image",
        image_url: imageDataUrl,
      });
    }

    const resp = await client.responses.create({
      model: "gpt-5",
      reasoning: { effort: "low" },
      input: [
        {
          role: "user",
          content: inputContent,
        },
      ],
    });

    const text = (resp.output_text ?? "").trim();
    const judged = extractJson(text);

    const score = Number(judged.risk_score_0_to_20);
    const clamped = Math.max(0, Math.min(score, S_MAX));
    const probability = (clamped * 100) / S_MAX;

    const overtimeExpected = (probability * OVERTIME_MAX) / 100;
    const hourly = ANNUAL_YEN / HOURS_PER_YEAR;
    const lossExpected = hourly * overtimeExpected;

    return Response.json({
      emergency_probability_percent: probability.toFixed(1),
      overtime_hours_expected: overtimeExpected.toFixed(2),
      loss_yen_expected: Math.round(lossExpected),
      missing_arrangements: judged.missing_arrangements ?? [],
      likely_issues: judged.likely_issues ?? [],
      decide_today: judged.decide_today ?? [],
      next_missing: judged.next_missing ?? [],
      photo_warnings: judged.photo_warnings ?? [],
    });
  } catch (e: any) {
    return Response.json(
      { error: e.message ?? "unknown error" },
      { status: 500 }
    );
  }
}