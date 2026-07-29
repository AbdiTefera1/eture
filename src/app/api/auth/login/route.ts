import { NextRequest, NextResponse } from "next/server";
import { login } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }
  try {
    const success = await login(email, password);
    if (!success) {
      return NextResponse.json({ error: "Invalid email or password. If you haven't run the seed script yet, run: npx prisma db seed" }, { status: 401 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Login error:", err);
    const message = err instanceof Error ? err.message : "Login failed";
    return NextResponse.json({ error: `Server misconfiguration: ${message}` }, { status: 500 });
  }
}
