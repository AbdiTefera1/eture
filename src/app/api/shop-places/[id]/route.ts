import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const place = await prisma.shopPlace.findUnique({
    where: { id: params.id },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!place) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(place);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { name, category, address, city, itemsAvailable, priceRange, openingHours, description, order, published, images } = body;

  const place = await prisma.$transaction(async (tx) => {
    if (images) {
      await tx.shopImage.deleteMany({ where: { shopPlaceId: params.id } });
    }
    return tx.shopPlace.update({
      where: { id: params.id },
      data: {
        name, category, address, city,
        itemsAvailable: itemsAvailable || [],
        priceRange, openingHours: openingHours || null,
        description, order: Number(order) || 0, published,
        images: images?.length
          ? { create: images.map((img: any, i: number) => ({ url: img.url, alt: img.alt || "", order: i })) }
          : undefined,
      },
      include: { images: true },
    });
  });
  return NextResponse.json(place);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.shopPlace.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
