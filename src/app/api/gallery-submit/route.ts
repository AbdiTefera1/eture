import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { saveUploadedFile, UploadError } from "@/lib/storage";
import { GALLERY_CATEGORIES } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const name = formData.get("name") as string;
    const caption = formData.get("caption") as string;
    const category = formData.get("category") as string;

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No photo provided" }, { status: 400 });
    }
    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: "Location name is required" }, { status: 400 });
    }
    
    // Ensure category is valid
    const finalCategory = GALLERY_CATEGORIES.includes(category) ? category : GALLERY_CATEGORIES[0];

    // Upload the file
    const uploadResult = await saveUploadedFile(file);

    // Save to database, default to unpublished
    const image = await prisma.galleryImage.create({
      data: {
        name: name.trim(),
        caption: caption?.trim() || "",
        imageUrl: uploadResult.url,
        category: finalCategory,
        tall: false,
        order: 0,
        published: false,
      },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (err) {
    if (err instanceof UploadError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("Gallery submit error:", err);
    return NextResponse.json({ error: "Failed to submit photo" }, { status: 500 });
  }
}
