import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  // Guard: only allow authenticated admins
  const session = cookies().get("admin_session");
  if (!session?.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const last7 = new Date(today);
  last7.setDate(today.getDate() - 6);
  const last30 = new Date(today);
  last30.setDate(today.getDate() - 29);

  const [totalVisits, todayVisits, last7Visits, last30Visits, topPages] = await Promise.all([
    prisma.pageVisit.count(),
    prisma.pageVisit.count({ where: { date: { gte: today } } }),
    prisma.pageVisit.count({ where: { date: { gte: last7 } } }),
    prisma.pageVisit.count({ where: { date: { gte: last30 } } }),
    prisma.pageVisit.groupBy({
      by: ["page"],
      _count: { page: true },
      orderBy: { _count: { page: "desc" } },
      take: 5,
    }),
  ]);

  // Daily breakdown for last 7 days
  const dailyRaw = await prisma.pageVisit.findMany({
    where: { date: { gte: last7 } },
    select: { date: true },
  });
  const dailyMap: Record<string, number> = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date(last7);
    d.setDate(last7.getDate() + i);
    dailyMap[d.toISOString().slice(0, 10)] = 0;
  }
  for (const v of dailyRaw) {
    const key = v.date.toISOString().slice(0, 10);
    if (key in dailyMap) dailyMap[key]++;
  }

  return NextResponse.json({
    totalVisits,
    todayVisits,
    last7Visits,
    last30Visits,
    topPages: topPages.map((p) => ({ page: p.page, count: p._count.page })),
    daily: Object.entries(dailyMap).map(([date, count]) => ({ date, count })),
  });
}
