import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const places = await prisma.shopPlace.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: { images: { orderBy: { order: "asc" } } },
  });
  return NextResponse.json(places);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, category, address, city, itemsAvailable, priceRange, openingHours, description, order, images } = body;

  if (!name || !address || !description) {
    return NextResponse.json({ error: "name, address and description are required" }, { status: 400 });
  }

  const place = await prisma.shopPlace.create({
    data: {
      name, category: category || "other", address,
      city: city || "Addis Ababa",
      itemsAvailable: itemsAvailable || [],
      priceRange: priceRange || "$$",
      openingHours: openingHours || null,
      description,
      order: Number(order) || 0,
      images: images?.length
        ? { create: images.map((img: any, i: number) => ({ url: img.url, alt: img.alt || "", order: i })) }
        : undefined,
    },
    include: { images: true },
  });
  return NextResponse.json(place, { status: 201 });
}
