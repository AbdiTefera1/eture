import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const hotel = await prisma.hotel.findUnique({
    where: { id: params.id },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!hotel) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(hotel);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { name, city, country, address, latitude, longitude, distanceFromAirportKm, tier, pricePerNight, currency, mealPlan, extraFoodInfo, amenities, rating, website, note, order, published, images } = body;

  const hotel = await prisma.$transaction(async (tx) => {
    if (images) {
      await tx.hotelImage.deleteMany({ where: { hotelId: params.id } });
    }
    return tx.hotel.update({
      where: { id: params.id },
      data: {
        name, city, country, address,
        latitude: latitude === "" || latitude === undefined || latitude === null ? null : Number(latitude),
        longitude: longitude === "" || longitude === undefined || longitude === null ? null : Number(longitude),
        distanceFromAirportKm: distanceFromAirportKm === "" || distanceFromAirportKm === undefined || distanceFromAirportKm === null ? null : Number(distanceFromAirportKm),
        tier,
        pricePerNight: Number(pricePerNight),
        currency, mealPlan,
        extraFoodInfo: extraFoodInfo || null,
        amenities: amenities || [],
        rating: Number(rating) || 0,
        website: website || null,
        note, order: Number(order) || 0,
        published,
        images: images?.length
          ? { create: images.map((img: any, i: number) => ({ url: img.url, alt: img.alt || "", order: i })) }
          : undefined,
      },
      include: { images: true },
    });
  });
  return NextResponse.json(hotel);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.hotel.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
