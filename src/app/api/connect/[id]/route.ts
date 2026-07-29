import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Protected by middleware — used by the admin dashboard to moderate posts.
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const post = await prisma.connectPost.update({
    where: { id: params.id },
    data: { approved: !!body.approved },
  });
  return NextResponse.json(post);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.connectPost.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
