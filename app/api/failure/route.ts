import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const notion = new Client({
    auth: process.env.NOTION_API_KEY,
});

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const prompt = `
以下の施工失敗を、Notionに保存しやすい形に整理してください。

【入力】
工程: ${body.process}
起きたこと: ${body.happened}
未確認: ${body.missed}
本来のタイミング: ${body.timing}
次の判断: ${body.next}

【出力形式】
必ずJSONだけで返してください。
説明文、前置き、補足は一切不要です。
次の形式に厳密に従ってください。

{
  "title": "失敗の短いタイトル",
  "category": "失敗カテゴリ",
  "phase": "工程フェイズ",
  "summary": "Notionに貼れる要約"
}
`;

        const res = await client.responses.create({
            model: "gpt-4.1-mini",
            input: prompt,
        });

        const text = res.output_text;
        const cleaned = text.replace(/```json|```/g, "").trim();
        const aiResult = JSON.parse(cleaned);

        await notion.pages.create({
            parent: {
                database_id: process.env.NOTION_DATABASE_ID!,
            },
            properties: {
                名前: {
                    title: [
                        {
                            text: {
                                content: aiResult.title || "無題",
                            },
                        },
                    ],
                },
                工程: {
                    rich_text: [
                        {
                            text: {
                                content: body.process || "",
                            },
                        },
                    ],
                },
                起きたこと: {
                    rich_text: [
                        {
                            text: {
                                content: body.happened || "",
                            },
                        },
                    ],
                },
                未確認だったこと: {
                    rich_text: [
                        {
                            text: {
                                content: body.missed || "",
                            },
                        },
                    ],
                },
                本来いつ決めるべきだったか: {
                    rich_text: [
                        {
                            text: {
                                content: body.timing || "",
                            },
                        },
                    ],
                },
                次からの判断: {
                    rich_text: [
                        {
                            text: {
                                content: body.next || "",
                            },
                        },
                    ],
                },
                AIタイトル: {
                    rich_text: [
                        {
                            text: {
                                content: aiResult.title || "",
                            },
                        },
                    ],
                },
                AIカテゴリ: {
                    rich_text: [
                        {
                            text: {
                                content: aiResult.category || "",
                            },
                        },
                    ],
                },
                AIフェーズ: {
                    rich_text: [
                        {
                            text: {
                                content: aiResult.phase || "",
                            },
                        },
                    ],
                },
                AI要約: {
                    rich_text: [
                        {
                            text: {
                                content: aiResult.summary || "",
                            },
                        },
                    ],
                },
            },
        });

        return NextResponse.json({
            text: cleaned,
            success: true,
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message ?? "failure api error" },
            { status: 500 }
        );
    }
}