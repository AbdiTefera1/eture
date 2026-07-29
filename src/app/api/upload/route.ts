import { NextRequest, NextResponse } from "next/server";
import { saveUploadedFile, UploadError } from "@/lib/storage";

// Protected by middleware (admin session required) — see middleware.ts.
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    const result = await saveUploadedFile(file);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    if (err instanceof UploadError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
