import { SignJWT, jwtVerify } from "jose";
import { AUTH } from "./config";
import { authErr } from "./errors";

/**
 * Magic-link tokens are SEPARATE from session JWTs:
 * - signed with MAGIC_LINK_SECRET (rotate independently)
 * - very short TTL (15 min default)
 * - single purpose: prove control of `email` for `eventId` as a judge
 */

export interface MagicClaims {
  email: string;
  eventId: string;
  purpose: "judge-magic";
}

const encoder = new TextEncoder();
const key = () => encoder.encode(AUTH.MAGIC_LINK_SECRET);

export async function signMagicToken(claims: MagicClaims): Promise<string> {
  return await new SignJWT({ ...claims })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setIssuer(AUTH.ISSUER)
    .setAudience("ihi.magic")
    .setExpirationTime(`${AUTH.MAGIC_LINK_TTL_SECONDS}s`)
    .sign(key());
}

export async function verifyMagicToken(token: string): Promise<MagicClaims> {
  try {
    const { payload } = await jwtVerify(token, key(), {
      issuer: AUTH.ISSUER,
      audience: "ihi.magic",
    });
    if (payload.purpose !== "judge-magic") throw authErr.magicInvalid();
    return {
      email: String(payload.email),
      eventId: String(payload.eventId),
      purpose: "judge-magic",
    };
  } catch (e) {
    if ((e as { code?: string })?.code === "ERR_JWT_EXPIRED") {
      throw authErr.magicExpired();
    }
    throw authErr.magicInvalid();
  }
}

/** Compose the URL the judge clicks in email. */
export function buildMagicUrl(token: string): string {
  const base = AUTH.APP_URL.replace(/\/$/, "");
  return `${base}/api/auth/magic/verify?token=${encodeURIComponent(token)}`;
}