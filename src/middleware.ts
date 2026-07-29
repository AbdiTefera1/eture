import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "selam_admin_session";
const LOCALES = ["en", "am", "fr", "zh", "ar"];
const DEFAULT_LOCALE = "en";

async function generateHmac(payload: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyToken(token: string, secret: string): Promise<boolean> {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const [email, expiryStr, hmac] = decoded.split(":");
    const expiry = Number(expiryStr);
    const expected = await generateHmac(`${email}:${expiry}`, secret);
    if (expected !== hmac) return false;
    if (Date.now() > expiry) return false;
    return true;
  } catch {
    return false;
  }
}

function detectLocale(req: NextRequest): string {
  const acceptLanguage = req.headers.get("accept-language") || "";
  const preferred = acceptLanguage.split(",")[0]?.split("-")[0]?.toLowerCase();
  return LOCALES.includes(preferred || "") ? preferred! : DEFAULT_LOCALE;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // --- 1. Admin auth (unchanged behaviour from v1) ---
  if (pathname === "/admin/login" || pathname === "/api/auth/login") {
    return NextResponse.next();
  }
  if (pathname.startsWith("/admin") || (pathname.startsWith("/api/") && req.method !== "GET")) {
    if ((pathname === "/api/connect" || pathname === "/api/gallery-submit") && req.method === "POST") {
      return NextResponse.next();
    }
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const secret = process.env.SESSION_SECRET || "";
    const valid = token && secret && await verifyToken(token, secret);
    if (!valid) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  }

  // --- 2. Locale routing for public pages ---
  if (pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next();
  }
  const firstSegment = pathname.split("/")[1];
  if (!LOCALES.includes(firstSegment)) {
    const locale = req.cookies.get("selam_locale")?.value || detectLocale(req);
    const url = new URL(`/${locale}${pathname === "/" ? "" : pathname}`, req.url);
    const res = NextResponse.redirect(url);
    res.cookies.set("selam_locale", locale, { maxAge: 60 * 60 * 24 * 365, path: "/" });
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|uploads).*)"],
};
