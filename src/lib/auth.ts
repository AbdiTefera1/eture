import { cookies } from "next/headers";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const COOKIE_NAME = "selam_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set in the environment.");
  return secret;
}

// Signed session token: base64(email:expiry):hmac
function signToken(email: string, expiry: number) {
  const payload = `${email}:${expiry}`;
  const hmac = crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
  return Buffer.from(`${payload}:${hmac}`).toString("base64url");
}

function verifyToken(token: string): { email: string } | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const [email, expiryStr, hmac] = decoded.split(":");
    const expiry = Number(expiryStr);
    const expected = crypto.createHmac("sha256", getSecret()).update(`${email}:${expiry}`).digest("hex");
    if (expected !== hmac) return null;
    if (Date.now() > expiry) return null;
    return { email };
  } catch {
    return null;
  }
}

export async function login(email: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return false;
  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) return false;

  const expiry = Date.now() + SESSION_TTL_MS;
  const token = signToken(email, expiry);
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiry),
  });
  return true;
}

export function logout() {
  cookies().delete(COOKIE_NAME);
}

export function getSession(): { email: string } | null {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function requireSession(): { email: string } {
  const session = getSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
