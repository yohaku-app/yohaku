import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { address, material, spec, quantity, deadline } = await req.json();

    const response = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        parent: {
          database_id: process.env.STOCK_DATABASE_ID,
        },
        properties: {
          "材料名": {
            title: [
              {
                text: {
                  content: material,
                },
              },
            ],
          },
          "規格": {
            rich_text: [
              {
                text: {
                  content: spec,
                },
              },
            ],
          },
          "個数": {
            number: Number(quantity),
          },
          "住所": {
            rich_text: [
              {
                text: {
                  content: address,
                },
              },
            ],
          },
          "登録日": {
            date: {
              start: new Date().toISOString(),
            },
          },
          ...(deadline
            ? {
                "引取期限": {
                  date: {
                    start: deadline,
                  },
                },
              }
            : {}),
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Notion error:", errorText);
      return NextResponse.json(
        { success: false, message: "Notion登録失敗", error: errorText },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "登録成功" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "エラー" },
      { status: 500 }
    );
  }
}