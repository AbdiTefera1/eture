import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const destination = await prisma.destination.findUnique({
    where: { id: params.id },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!destination) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(destination);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { name, tag, region, summary, description, highlights, bestTimeToVisit, duration, difficulty, activityTags, avgTempC, latitude, longitude, icon, colorway, order, published, images } = body;

  const destination = await prisma.$transaction(async (tx) => {
    if (images) {
      await tx.destinationImage.deleteMany({ where: { destinationId: params.id } });
    }
    return tx.destination.update({
      where: { id: params.id },
      data: {
        name, tag, region, summary, description,
        highlights: highlights || [],
        bestTimeToVisit: bestTimeToVisit || null,
        duration: duration || null,
        difficulty: difficulty || null,
        activityTags: activityTags || [],
        avgTempC: avgTempC === "" || avgTempC === undefined || avgTempC === null ? null : Number(avgTempC),
        latitude: latitude === "" || latitude === undefined || latitude === null ? null : Number(latitude),
        longitude: longitude === "" || longitude === undefined || longitude === null ? null : Number(longitude),
        icon, colorway,
        order: Number(order) || 0,
        published,
        images: images?.length
          ? { create: images.map((img: any, i: number) => ({ url: img.url, alt: img.alt || "", order: i })) }
          : undefined,
      },
      include: { images: true },
    });
  });
  return NextResponse.json(destination);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.destination.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
