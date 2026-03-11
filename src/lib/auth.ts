export const SESSION_COOKIE = "admin_session";
const SECRET = process.env.ADMIN_SECRET ?? "dev-secret-change-in-production";

async function getKey(usage: KeyUsage[]): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    usage
  );
}

export async function createSessionToken(): Promise<string> {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = btoa(JSON.stringify({ role: "admin", exp }));
  const key = await getKey(["sign"]);
  const sigBuf = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  const sig = btoa(String.fromCharCode(...new Uint8Array(sigBuf)));
  return `${payload}.${sig}`;
}

export async function verifySessionToken(
  token: string | undefined
): Promise<boolean> {
  if (!token) return false;
  try {
    const [payload, sig] = token.split(".");
    if (!payload || !sig) return false;
    const { exp } = JSON.parse(atob(payload));
    if (exp < Date.now()) return false;
    const key = await getKey(["verify"]);
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
