/**
 * Typed auth errors. All API routes throw these; route handlers turn them into JSON.
 */

export type AuthErrorCode =
  | "INVALID_CREDENTIALS"
  | "INVALID_EMAIL"
  | "INVALID_ROLE"
  | "ACCOUNT_EXISTS"
  | "ACCOUNT_NOT_FOUND"
  | "JUDGE_NOT_INVITED"
  | "MAGIC_LINK_INVALID"
  | "MAGIC_LINK_EXPIRED"
  | "SESSION_EXPIRED"
  | "SESSION_MISSING"
  | "FORBIDDEN"
  | "RATE_LIMITED"
  | "SERVER_ERROR";

export class AuthError extends Error {
  code: AuthErrorCode;
  status: number;

  constructor(code: AuthErrorCode, message?: string, status = 400) {
    super(message || code);
    this.code = code;
    this.status = status;
    this.name = "AuthError";
  }
}

export const authErr = {
  invalidCreds: () =>
    new AuthError("INVALID_CREDENTIALS", "Invalid email or password.", 401),
  invalidEmail: () =>
    new AuthError("INVALID_EMAIL", "Please provide a valid email.", 400),
  invalidRole: () => new AuthError("INVALID_ROLE", "Unknown role.", 400),
  accountExists: () =>
    new AuthError("ACCOUNT_EXISTS", "An account with that email already exists.", 409),
  accountNotFound: () =>
    new AuthError("ACCOUNT_NOT_FOUND", "No account found for that email.", 404),
  judgeNotInvited: () =>
    new AuthError(
      "JUDGE_NOT_INVITED",
      "This email has not been invited as a judge for this event.",
      403
    ),
  magicInvalid: () =>
    new AuthError("MAGIC_LINK_INVALID", "This link is invalid.", 400),
  magicExpired: () =>
    new AuthError("MAGIC_LINK_EXPIRED", "This link has expired.", 400),
  sessionExpired: () =>
    new AuthError("SESSION_EXPIRED", "Your session has expired.", 401),
  sessionMissing: () =>
    new AuthError("SESSION_MISSING", "Not signed in.", 401),
  forbidden: () =>
    new AuthError("FORBIDDEN", "You do not have access to this resource.", 403),
  rateLimited: () =>
    new AuthError("RATE_LIMITED", "Too many attempts. Try again shortly.", 429),
  server: (msg = "Server error.") => new AuthError("SERVER_ERROR", msg, 500),
};

/**
 * Returns a human-friendly error string for UI components and notifications.
 */
export function getCleanAuthErrorMessage(error: unknown): string {
  if (error instanceof AuthError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "An unexpected authentication error occurred. Please try again.";
}