import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * Edge-safe middleware.
 * Uses jose only (no Node crypto, no bcrypt, no cookies() from next/headers).
 * Mirrors AUTH constants inline so this file has zero server-only imports.
 */

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "ihi_session";
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "dev-insecure-secret-do-not-use-in-production-000000000";
const ISSUER = "ihi.auth";
const AUDIENCE = "ihi.app";

type Role = "participant" | "organizer" | "judge";

interface EdgeClaims {
  sub: string;
  email: string;
  role: Role;
  eventId?: string;
  name?: string;
}

const PUBLIC_PREFIXES = [
  "/",
  "/login",
  "/signup",
  "/judge-login",
  "/api/auth",
  "/auth/callback",
  "/_next",
  "/favicon",
  "/brand",
];

/** Exact public paths (home is exact, not a prefix of everything) */
const PUBLIC_EXACT = new Set(["/"]);

function isPublic(pathname: string): boolean {
  if (PUBLIC_EXACT.has(pathname)) return true;
  // Static / next internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/brand") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return true;
  }
  // Auth surfaces
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/judge-login") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/auth/callback")
  ) {
    return true;
  }
  // Public event detail and registration pages
  if (
    /^\/events\/[^/]+$/.test(pathname) ||
    /^\/events\/[^/]+\/register$/.test(pathname)
  ) {
    return true;
  }
  // Marketing landing anchors are still "/"
  return false;
}

function isOrganizerRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/dashboard") ||
    pathname.includes("/dashboard") ||
    pathname.startsWith("/events/") && pathname.includes("/judging") ||
    pathname.startsWith("/events/") && pathname.includes("/registrations") ||
    pathname.startsWith("/events/") && pathname.includes("/teams") ||
    pathname.startsWith("/events/") && pathname.includes("/submissions") ||
    pathname.startsWith("/events/") && pathname.includes("/results") ||
    pathname.startsWith("/events/") && pathname.includes("/audit-log")
  );
}

function isParticipantRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/team") ||
    pathname.startsWith("/submit") ||
    pathname.startsWith("/results") ||
    // participant group under (participant)
    pathname.startsWith("/participant")
  );
}

function isJudgeRoute(pathname: string): boolean {
  return pathname.startsWith("/judge");
}

async function readClaims(req: NextRequest): Promise<EdgeClaims | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const key = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, key, {
      issuer: ISSUER,
      audience: AUDIENCE,
    });

    const role = payload.role as Role;
    if (!role || !["participant", "organizer", "judge"].includes(role)) {
      return null;
    }

    return {
      sub: String(payload.sub ?? ""),
      email: String(payload.email ?? ""),
      role,
      eventId: payload.eventId ? String(payload.eventId) : undefined,
      name: payload.name ? String(payload.name) : undefined,
    };
  } catch {
    return null; // expired / tampered → treat as logged out
  }
}

function loginRedirect(req: NextRequest, reason?: string) {
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = reason ? `?error=${encodeURIComponent(reason)}` : "";
  // Preserve where they were going (except for judge magic flows)
  const next = req.nextUrl.pathname + req.nextUrl.search;
  if (next && next !== "/" && !next.startsWith("/login")) {
    url.searchParams.set("next", next);
  }
  return NextResponse.redirect(url);
}

function forbiddenRedirect(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = "?error=FORBIDDEN";
  return NextResponse.redirect(url);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Public paths — never block
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // 2. Read session from httpOnly cookie (edge-safe)
  const claims = await readClaims(req);

  // 3. Protected routes require a session
  if (!claims) {
    return loginRedirect(req, "SESSION_MISSING");
  }

  // 4. Role gates
  if (isJudgeRoute(pathname)) {
    if (claims.role !== "judge") {
      return forbiddenRedirect(req);
    }
    // Judge JWT must be event-scoped
    if (!claims.eventId) {
      return loginRedirect(req, "SESSION_EXPIRED");
    }
    return NextResponse.next();
  }

  if (isOrganizerRoute(pathname)) {
    if (claims.role !== "organizer") {
      return forbiddenRedirect(req);
    }
    return NextResponse.next();
  }

  if (isParticipantRoute(pathname)) {
    if (claims.role !== "participant" && claims.role !== "organizer") {
      return forbiddenRedirect(req);
    }
    return NextResponse.next();
  }

  // 5. Any other authenticated route — allow if session valid
  return NextResponse.next();
}

/**
 * Matcher: run middleware on app routes, skip static assets aggressively.
 * Adjust if you add more public marketing pages.
 */
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static, _next/image
     * - favicon, brand assets, common static extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|brand/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};