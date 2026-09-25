import { cookies } from "next/headers";
import { AUTH, IS_PROD } from "./config";

interface SetCookieOpts {
  ttlSeconds?: number;
}

/** Server action / route handler: set the session cookie. */
export async function setSessionCookie(token: string, opts: SetCookieOpts = {}) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: AUTH.COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "lax",
    path: "/",
    maxAge: opts.ttlSeconds ?? AUTH.SESSION_TTL_SECONDS,
  });
}

/** Server: read the raw JWT string (or undefined). */
export async function readSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH.COOKIE_NAME)?.value;
}

/** Server: clear on logout. */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: AUTH.COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}