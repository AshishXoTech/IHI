import { readSessionCookie } from "./cookies";
import { verifySession, type SessionClaims } from "./jwt";
import { authErr } from "./errors";
import type { Role } from "./roles";

/**
 * Server helper — read + verify current session.
 * Returns null if no cookie; treats expired/tampered as anonymous.
 */
export async function getSession(): Promise<SessionClaims | null> {
  const token = await readSessionCookie();
  if (!token) return null;
  try {
    return await verifySession(token);
  } catch {
    return null;
  }
}

/** Require a session or throw. */
export async function requireSession(): Promise<SessionClaims> {
  const s = await getSession();
  if (!s) throw authErr.sessionMissing();
  return s;
}

/** Require a specific role (or one of several). */
export async function requireRole(...allowed: Role[]): Promise<SessionClaims> {
  const s = await requireSession();
  if (!allowed.includes(s.role)) throw authErr.forbidden();
  return s;
}

/** Require judge session scoped to the given eventId. */
export async function requireJudgeForEvent(eventId: string): Promise<SessionClaims> {
  const s = await requireRole("judge");
  if (s.eventId !== eventId) throw authErr.forbidden();
  return s;
}