import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const posts = await prisma.connectPost.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(posts);
}

// Public: anyone visiting the site can post here (see middleware.ts).
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, role, city, message, contact } = body;

  if (!name || !city || !message || !["guide", "traveler"].includes(role)) {
    return NextResponse.json({ error: "name, role, city and message are required" }, { status: 400 });
  }
  if (name.length > 60 || city.length > 60 || message.length > 400) {
    return NextResponse.json({ error: "One of the fields is too long" }, { status: 400 });
  }

  const post = await prisma.connectPost.create({
    data: { name, role, city, message, contact: contact || null },
  });
  return NextResponse.json(post, { status: 201 });
}
