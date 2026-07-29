import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const hotels = await prisma.hotel.findMany({
    where: { published: true },
    orderBy: [{ city: "asc" }, { order: "asc" }],
    include: { images: { orderBy: { order: "asc" } } },
  });
  return NextResponse.json(hotels);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, city, country, address, latitude, longitude, distanceFromAirportKm, tier, pricePerNight, currency, mealPlan, extraFoodInfo, amenities, rating, website, note, order, images } = body;

  if (!name || !city || !address || !tier || pricePerNight === undefined) {
    return NextResponse.json({ error: "name, city, address, tier and pricePerNight are required" }, { status: 400 });
  }

  const hotel = await prisma.hotel.create({
    data: {
      name, city, address,
      country: country || "Ethiopia",
      latitude: latitude === "" || latitude === undefined || latitude === null ? null : Number(latitude),
      longitude: longitude === "" || longitude === undefined || longitude === null ? null : Number(longitude),
      distanceFromAirportKm: distanceFromAirportKm === "" || distanceFromAirportKm === undefined || distanceFromAirportKm === null ? null : Number(distanceFromAirportKm),
      tier,
      pricePerNight: Number(pricePerNight),
      currency: currency || "USD",
      mealPlan: mealPlan || "room_only",
      extraFoodInfo: extraFoodInfo || null,
      amenities: amenities || [],
      rating: Number(rating) || 0,
      website: website || null,
      note: note || "",
      order: Number(order) || 0,
      images: images?.length
        ? { create: images.map((img: any, i: number) => ({ url: img.url, alt: img.alt || "", order: i })) }
        : undefined,
    },
    include: { images: true },
  });
  return NextResponse.json(hotel, { status: 201 });
}
