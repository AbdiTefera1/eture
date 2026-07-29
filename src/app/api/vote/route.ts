import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_TYPES = ["destination", "hotel", "shop", "gallery"];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, id } = body;

    if (!type || !id || !VALID_TYPES.includes(type)) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    let result;

    switch (type) {
      case "destination":
        result = await prisma.destination.update({
          where: { id },
          data: { upvotes: { increment: 1 } },
        });
        break;
      case "hotel":
        result = await prisma.hotel.update({
          where: { id },
          data: { upvotes: { increment: 1 } },
        });
        break;
      case "shop":
        result = await prisma.shopPlace.update({
          where: { id },
          data: { upvotes: { increment: 1 } },
        });
        break;
      case "gallery":
        result = await prisma.galleryImage.update({
          where: { id },
          data: { upvotes: { increment: 1 } },
        });
        break;
      default:
        return NextResponse.json({ error: "Unknown type" }, { status: 400 });
    }

    return NextResponse.json({ success: true, upvotes: result.upvotes }, { status: 200 });
  } catch (error) {
    console.error("Failed to process upvote:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
