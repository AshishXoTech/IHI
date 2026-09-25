"use client";

import { useState, useMemo, FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { RoleTabs, type LoginRole } from "./RoleTabs";
import { getCleanAuthErrorMessage } from "@/lib/auth/errors";
import { getPostLoginRedirectUrl } from "@/lib/auth/roles";
import { setAuthSession } from "@/lib/auth";

interface LoginFormProps {
  /** Optional default event for judge magic link (from ?eventId=) */
  defaultEventId?: string;
}

export function LoginForm({ defaultEventId = "" }: LoginFormProps) {
  const router = useRouter();
  const search = useSearchParams();

  const initialRole = (search.get("role") as LoginRole) || "participant";
  const urlError = search.get("error");

  const [role, setRole] = useState<LoginRole>(
    ["participant", "organizer", "judge"].includes(initialRole)
      ? initialRole
      : "participant"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [eventId, setEventId] = useState(defaultEventId || search.get("eventId") || "");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(mapUrlError(urlError));
  const [judgeSuccess, setJudgeSuccess] = useState<string | null>(null);
  const [devMagicUrl, setDevMagicUrl] = useState<string | null>(null);

  const isJudge = role === "judge";

  const subtitle = useMemo(() => {
    if (isJudge) return "Enter your invited email. We’ll send a one-time access link.";
    if (role === "organizer") return "Run events, rubrics, and publish gates.";
    return "Join teams, submit projects, and track results.";
  }, [role, isJudge]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setJudgeSuccess(null);
    setDevMagicUrl(null);
    setLoading(true);

    try {
      if (isJudge) {
        if (!email.trim()) throw new Error("Please enter your email.");
        if (!eventId.trim()) throw new Error("Event ID is required for judge access.");

        const res = await fetch("/api/auth/magic/request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), eventId: eventId.trim() }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not send magic link.");

        setJudgeSuccess(
          data.message ||
            "If you are registered as a judge, a magic link has been sent."
        );
        if (data.devMagicUrl) setDevMagicUrl(data.devMagicUrl);
        return;
      }

      // Participant / Organizer password login
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          email: email.trim(),
          password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid email or password.");

      setAuthSession(
        {
          name: data.user?.name || email.trim().split("@")[0],
          email: data.user?.email || email.trim(),
          eventName: data.user?.eventName || "Stanford TreeHacks 2025",
          role: data.user?.role || role,
        },
        data.token
      );

      const next = search.get("next");
      const dest =
        next && next.startsWith("/")
          ? next
          : await getPostLoginRedirectUrl(data.user?.role || role);

      router.replace(dest);
      router.refresh();
    } catch (err) {
      setError(getCleanAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-black md:text-4xl">
          Welcome back
        </h1>
        <p className="mt-2 font-body text-base text-gray-500">{subtitle}</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <RoleTabs
          value={role}
          onChange={(r) => {
            setRole(r);
            setError(null);
            setJudgeSuccess(null);
            setDevMagicUrl(null);
          }}
        />

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block font-body text-sm font-medium text-black"
          >
            Email address
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
              <MailIcon />
            </span>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              className="h-12 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 font-body text-sm text-black outline-none transition-shadow placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-gold/40"
            />
          </div>
        </div>

        {/* Judge: eventId · Others: password */}
        {isJudge ? (
          <div>
            <label
              htmlFor="eventId"
              className="mb-1.5 block font-body text-sm font-medium text-black"
            >
              Event ID
            </label>
            <input
              id="eventId"
              name="eventId"
              type="text"
              required
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              placeholder="e.g. evt_treehacks_2025"
              className="h-12 w-full rounded-lg border border-gray-200 bg-white px-3 font-mono text-sm text-black outline-none transition-shadow placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-gold/40"
            />
            <p className="mt-1.5 font-body text-xs text-gray-400">
              Provided in your organizer invitation email.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label
                htmlFor="password"
                className="font-body text-sm font-medium text-black"
              >
                Password
              </label>
              <Link
                href="/login?forgot=1"
                className="font-body text-xs font-medium text-gray-500 transition-colors hover:text-black"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                <LockIcon />
              </span>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-12 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-12 font-body text-sm text-black outline-none transition-shadow placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-gold/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-2 flex items-center rounded-md px-2 text-xs font-semibold text-gray-500 hover:text-black"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        )}

        {/* Errors / success */}
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-black/10 bg-gray-50 px-3 py-2 font-body text-sm text-black"
          >
            {error}
          </div>
        )}
        {judgeSuccess && (
          <div
            role="status"
            className="rounded-lg border border-gold/30 bg-gold/10 px-3 py-2 font-body text-sm text-black"
          >
            {judgeSuccess}
            {devMagicUrl && (
              <p className="mt-2 break-all font-mono text-xs text-gray-600">
                Dev link:{" "}
                <a href={devMagicUrl} className="underline hover:text-black">
                  {devMagicUrl}
                </a>
              </p>
            )}
          </div>
        )}

        {/* Submit — gold fill, black label */}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gold px-6 font-body text-sm font-bold uppercase tracking-wider text-black transition-all duration-200 hover:-translate-y-px hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 motion-reduce:transform-none"
        >
          {loading ? (
            <span className="font-medium normal-case tracking-normal">
              {isJudge ? "Sending link…" : "Signing in…"}
            </span>
          ) : isJudge ? (
            <>
              Email magic link
              <ArrowIcon />
            </>
          ) : (
            <>
              Sign in
              <ArrowIcon />
            </>
          )}
        </button>
      </form>

      {/* Signup only for non-judges */}
      {!isJudge && (
        <p className="mt-8 text-center font-body text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href={`/signup?role=${role}`}
            className="font-semibold text-black underline-offset-4 hover:underline"
          >
            Create one now
          </Link>
        </p>
      )}

      {isJudge && (
        <p className="mt-8 text-center font-body text-xs leading-relaxed text-gray-400">
          Judges cannot self-register. Your organizer must invite this email
          for a specific event.
        </p>
      )}
    </div>
  );
}

function mapUrlError(code: string | null): string | null {
  if (!code) return null;
  const map: Record<string, string> = {
    SESSION_MISSING: "Please sign in to continue.",
    SESSION_EXPIRED: "Your session expired. Sign in again.",
    FORBIDDEN: "You don’t have access to that area.",
    MAGIC_LINK_INVALID: "That magic link is invalid.",
    MAGIC_LINK_EXPIRED: "That magic link has expired. Request a new one.",
  };
  return map[code] || "Something went wrong. Please try again.";
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2.5 4.5L8 9l5.5-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5 7V5.5a3 3 0 016 0V7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}