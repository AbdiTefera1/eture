import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function slugify(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function GET() {
  const destinations = await prisma.destination.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: { images: { orderBy: { order: "asc" } } },
  });
  return NextResponse.json(destinations);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, tag, region, summary, description, highlights, bestTimeToVisit, duration, difficulty, activityTags, avgTempC, latitude, longitude, icon, colorway, order, images } = body;

  if (!name || !description) {
    return NextResponse.json({ error: "name and description are required" }, { status: 400 });
  }

  let slug = slugify(name);
  const existing = await prisma.destination.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  const destination = await prisma.destination.create({
    data: {
      name, slug,
      tag: tag || "", region: region || "",
      summary: summary || "", description,
      highlights: highlights || [],
      bestTimeToVisit: bestTimeToVisit || null,
      duration: duration || null,
      difficulty: difficulty || null,
      activityTags: activityTags || [],
      avgTempC: avgTempC === "" || avgTempC === undefined || avgTempC === null ? null : Number(avgTempC),
      latitude: latitude === "" || latitude === undefined || latitude === null ? null : Number(latitude),
      longitude: longitude === "" || longitude === undefined || longitude === null ? null : Number(longitude),
      icon: icon || "compass",
      colorway: colorway || "art-1",
      order: Number(order) || 0,
      images: images?.length
        ? { create: images.map((img: any, i: number) => ({ url: img.url, alt: img.alt || "", order: i })) }
        : undefined,
    },
    include: { images: true },
  });
  return NextResponse.json(destination, { status: 201 });
}
