import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const images = await prisma.galleryImage.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(images);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, caption, imageUrl, category, tall, order } = body;
  if (!name || !imageUrl) {
    return NextResponse.json({ error: "name and imageUrl are required" }, { status: 400 });
  }
  const image = await prisma.galleryImage.create({
    data: { name, caption: caption || "", imageUrl, category: category || "general", tall: !!tall, order: Number(order) || 0 },
  });
  return NextResponse.json(image, { status: 201 });
}
