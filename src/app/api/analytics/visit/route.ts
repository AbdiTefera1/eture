import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { page, referrer } = body;

    if (!page || typeof page !== "string") {
      return NextResponse.json({ error: "Missing page" }, { status: 400 });
    }

    // Skip bot-like requests and admin pages
    const ua = req.headers.get("user-agent") || "";
    const isBot = /bot|crawler|spider|prerender|headless/i.test(ua);
    if (isBot || page.startsWith("/admin")) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    await prisma.pageVisit.create({
      data: {
        page,
        referrer: referrer || null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Analytics error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
