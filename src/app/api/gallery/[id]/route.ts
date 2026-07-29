import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const image = await prisma.galleryImage.findUnique({ where: { id: params.id } });
  if (!image) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(image);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { name, caption, imageUrl, category, tall, order, published } = body;
  const image = await prisma.galleryImage.update({
    where: { id: params.id },
    data: { name, caption, imageUrl, category, tall: !!tall, order: Number(order) || 0, published },
  });
  return NextResponse.json(image);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.galleryImage.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
