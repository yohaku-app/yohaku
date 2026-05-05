import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
        .from("images")
        .upload(fileName, file);

    if (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }

    const { data: publicUrl } = supabase.storage
        .from("images")
        .getPublicUrl(fileName);

    return Response.json({ url: publicUrl.publicUrl });
}