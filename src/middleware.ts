import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "admin_session";
const SECRET = process.env.ADMIN_SECRET ?? "dev-secret-change-in-production";

async function verifyToken(token: string): Promise<boolean> {
  try {
    const [payload, sig] = token.split(".");
    if (!payload || !sig) return false;
    const { exp } = JSON.parse(atob(payload));
    if (exp < Date.now()) return false;
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const sigBytes = Uint8Array.from(atob(sig), (c) => c.charCodeAt(0));
    return await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      new TextEncoder().encode(payload)
    );
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const valid = token ? await verifyToken(token) : false;

    if (!valid) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
