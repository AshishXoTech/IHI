/**
 * Centralized auth configuration.
 * Fails fast at import time if a required secret is missing in production.
 */

const isProd = process.env.NODE_ENV === "production";

function required(name: string, value: string | undefined): string {
  if (!value || value.length < 16) {
    if (isProd) {
      throw new Error(
        `[auth/config] Missing or too-short env var: ${name}. ` +
          `Generate with \`openssl rand -base64 48\`.`
      );
    }
    // Dev fallback so localhost doesn't crash before .env is filled.
    return "dev-insecure-secret-do-not-use-in-production-000000000";
  }
  return value;
}

export const AUTH = {
  JWT_SECRET: required("JWT_SECRET", process.env.JWT_SECRET),
  MAGIC_LINK_SECRET: required(
    "MAGIC_LINK_SECRET",
    process.env.MAGIC_LINK_SECRET
  ),
  COOKIE_NAME: process.env.AUTH_COOKIE_NAME || "ihi_session",
  SESSION_TTL_SECONDS: Number(process.env.SESSION_TTL_SECONDS || 60 * 60 * 12),
  JUDGE_SESSION_TTL_SECONDS: Number(
    process.env.JUDGE_SESSION_TTL_SECONDS || 60 * 60 * 12
  ),
  MAGIC_LINK_TTL_SECONDS: Number(
    process.env.MAGIC_LINK_TTL_SECONDS || 60 * 15
  ),

  ISSUER: "ihi.auth",
  AUDIENCE: "ihi.app",

  APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  EMAIL_FROM: process.env.EMAIL_FROM || "IHI <onboarding@resend.dev>",
  RESEND_API_KEY: process.env.RESEND_API_KEY || "",
} as const;

export const IS_PROD = isProd;