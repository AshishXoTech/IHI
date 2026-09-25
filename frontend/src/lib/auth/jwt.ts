import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { AUTH } from "./config";
import type { Role } from "./roles";
import { authErr } from "./errors";

export interface SessionClaims extends JWTPayload {
  sub: string;
  email: string;
  role: Role;
  eventId?: string;
  name?: string;
}

export type CreateSessionInput = {
  sub: string;
  email: string;
  role: Role;
  eventId?: string;
  name?: string;
};

const encoder = new TextEncoder();

function jwtKey() {
  return encoder.encode(AUTH.JWT_SECRET);
}

export async function signSession(
  claims: CreateSessionInput,
  ttlSeconds?: number
): Promise<string> {
  if (claims.role === "judge" && !claims.eventId) {
    throw authErr.server("Judge sessions require eventId.");
  }

  const ttl =
    ttlSeconds ??
    (claims.role === "judge"
      ? AUTH.JUDGE_SESSION_TTL_SECONDS
      : AUTH.SESSION_TTL_SECONDS);

  const payload: Record<string, unknown> = {
    email: claims.email,
    role: claims.role,
  };

  if (claims.eventId) payload.eventId = claims.eventId;
  if (claims.name) payload.name = claims.name;

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setIssuer(AUTH.ISSUER)
    .setAudience(AUTH.AUDIENCE)
    .setExpirationTime(`${ttl}s`)
    .setSubject(claims.sub) // Guaranteed string from CreateSessionInput
    .sign(jwtKey());
}

export async function verifySession(token: string): Promise<SessionClaims> {
  try {
    const { payload } = await jwtVerify(token, jwtKey(), {
      issuer: AUTH.ISSUER,
      audience: AUTH.AUDIENCE,
    });

    return {
      sub: String(payload.sub ?? ""),
      email: String(payload.email ?? ""),
      role: payload.role as Role,
      eventId: payload.eventId ? String(payload.eventId) : undefined,
      name: payload.name ? String(payload.name) : undefined,
    };
  } catch {
    throw authErr.sessionExpired();
  }
}