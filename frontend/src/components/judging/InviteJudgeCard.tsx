"use client";

import { useState, FormEvent } from "react";
import { getCleanAuthErrorMessage } from "@/lib/auth/errors";

interface InviteJudgeCardProps {
  eventId: string;
  eventName: string;
}

export function InviteJudgeCard({ eventId, eventName }: InviteJudgeCardProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [devUrl, setDevUrl] = useState<string | null>(null);

  async function handleInvite(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setDevUrl(null);

    try {
      if (!email.trim()) throw new Error("Email address is required.");

      const res = await fetch("/api/judging/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), eventId, eventName }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to invite judge.");

      setSuccess(`Invitation sent to ${email}`);
      if (data.devMagicUrl) setDevUrl(data.devMagicUrl);
      setEmail(""); // Reset form on success

    } catch (err) {
      setError(getCleanAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-700 bg-gray-900 shadow-sm">
      <div className="border-b border-gray-800 p-5">
        <h3 className="font-display text-lg font-bold text-white">
          Invite a Judge
        </h3>
        <p className="mt-1 font-body text-sm text-gray-400">
          Send a secure, single-use magic link. Judges do not require passwords.
        </p>
      </div>

      <div className="p-5">
        <form onSubmit={handleInvite} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="judge-email" className="mb-1.5 block font-body text-xs font-semibold uppercase tracking-wider text-gray-400">
              Judge Email Address
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-500">
                <MailIcon />
              </span>
              <input
                id="judge-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="judge@university.edu"
                className="h-10 w-full rounded-md border border-gray-700 bg-black pl-10 pr-3 font-body text-sm text-white outline-none transition-shadow placeholder:text-gray-600 focus:border-gray-500 focus:ring-2 focus:ring-gold/40"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-gold px-6 font-body text-sm font-bold uppercase tracking-wider text-black transition-all duration-200 hover:-translate-y-px hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {loading ? "Sending..." : "Send Invite"}
            {!loading && <SendIcon />}
          </button>
        </form>

        {/* Status Messages */}
        {error && (
          <div className="mt-4 rounded-md border border-red-900/30 bg-red-900/10 px-4 py-3 font-body text-sm text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 rounded-md border border-gold/30 bg-gold/10 px-4 py-3 font-body text-sm text-gold-light">
            <div className="flex items-center gap-2 font-semibold">
              <CheckIcon />
              {success}
            </div>
            {devUrl && (
              <p className="mt-2 break-all font-mono text-xs text-gray-400">
                <span className="text-gray-500">Dev Magic Link:</span>{" "}
                <a href={devUrl} className="underline hover:text-white" target="_blank" rel="noreferrer">
                  {devUrl}
                </a>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Inline SVG Icons (strictly presentation)
function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2.5 4.5L8 9l5.5-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M14 3L2 8l4 1.5M14 3L9.5 14 6 9.5M14 3L6 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}