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

【ルール】
- 事実ベースで書く
- 1行で簡潔に
- 曖昧な表現は禁止
- 各項目は混ぜない
- 名前は短く具体的にする

【出力形式】
必ずJSONのみで返してください

{
  "name": "失敗名",
  "happened": "起きたこと",
  "missed": "未確認だったこと",
  "timing": "本来いつ決めるべきだったか",
  "next": "次からの判断",
  "text": "全体をまとめた文章"
}
`;

        const res = await client.responses.create({
            model: "gpt-4.1-mini",
            input: prompt,
        });

        const text = res.output_text;

        // 👇追加①（AIの中身確認）
        console.log("AI raw:", text);

        const cleaned = text.replace(/```json|```/g, "").trim();

        // 👇追加②（安全にする）
        let aiResult;

        try {
            aiResult = JSON.parse(cleaned);
        } catch (e) {
            console.error("JSON parse error:", cleaned);
            throw new Error("AIの返却がJSONじゃない");
        }

        await notion.pages.create({
            parent: {
                database_id: process.env.NOTION_DATABASE_ID!,
            },
            properties: {
                名前: {
                    title: [
                        {
                            text: {
                                content: aiResult.name || "無題",
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
                                content: aiResult.happened || body.happened || "",
                            },
                        },
                    ],
                },

                未確認だったこと: {
                    rich_text: [
                        {
                            text: {
                                content: aiResult.missed || body.missed || "",
                            },
                        },
                    ],
                },

                本来いつ決めるべきだったか: {
                    rich_text: [
                        {
                            text: {
                                content: aiResult.timing || body.timing || "",
                            },
                        },
                    ],
                },

                次からの判断: {
                    rich_text: [
                        {
                            text: {
                                content: aiResult.next || body.next || "",
                            },
                        },
                    ],
                },

                テキスト: {
                    rich_text: [
                        {
                            text: {
                                content: aiResult.text || "",
                            },
                        },
                    ],
                },

                
            }
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