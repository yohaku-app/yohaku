import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const address = String(formData.get("address") || "");
    const material = String(formData.get("material") || "");
    const spec = String(formData.get("spec") || "");
    const quantity = String(formData.get("quantity") || "");
    const deadline = String(formData.get("deadline") || "");
    const photo = formData.get("photo") as File | null;
    let uploadedPhotoId = "";

    if (photo && photo.size > 0) {
      const createUploadRes = await fetch("https://api.notion.com/v1/file_uploads", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
          "Content-Type": "application/json",
          "Notion-Version": "2026-03-11",
        },
        body: JSON.stringify({
          mode: "single_part",
          filename: photo.name,
          content_type: photo.type,
        }),
      });

      const createUploadData = await createUploadRes.json();

      const uploadForm = new FormData();
      uploadForm.append("file", photo);

      const sendUploadRes = await fetch(
        `https://api.notion.com/v1/file_uploads/${createUploadData.id}/send`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
            "Notion-Version": "2026-03-11",
          },
          body: uploadForm,
        }
      );

      const sendUploadData = await sendUploadRes.json();
      uploadedPhotoId = sendUploadData.id;
    }

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
          ...(uploadedPhotoId
            ? {
              "写真(任意)": {
                files: [
                  {
                    name: photo?.name || "stock-photo",
                    type: "file_upload",
                    file_upload: {
                      id: uploadedPhotoId,
                    },
                  },
                ],
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
      {
        success: false,
        message: "エラー",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}