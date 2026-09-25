"use client";

import React, { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, ShieldAlert, Cpu, Lock, UserPlus } from "lucide-react";
import Link from "next/link";

type Role = "participant" | "organizer" | "judge";

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");

  const [role, setRole] = useState<Role>("judge");
  const [email, setEmail] = useState("ashish863863@gmail.com");
  const [eventId, setEventId] = useState("ashish01234");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (role === "judge") {
      // Hits route handler which sets valid JWT claims cookie and redirects to /judge/queue
      window.location.href = `/api/auth/judge-direct?email=${encodeURIComponent(
        email
      )}&eventId=${encodeURIComponent(eventId)}`;
    } else {
      setTimeout(() => {
        setIsLoading(false);
        if (role === "organizer") {
          router.push(`/events/${eventId || "ashish01234"}/dashboard`);
        } else {
          router.push("/hackathons");
        }
      }, 600);
    }
  };

  return (
    <div className="w-full max-w-lg relative z-10">
      {/* Session Expired / Error Banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-red-50 border-2 border-red-600 p-4 flex items-start gap-3"
          style={{ boxShadow: "4px 4px 0px 0px #DC2626" }}
        >
          <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-[10px] font-bold font-mono uppercase tracking-widest text-red-600 mb-1">
              AUTHENTICATION ERROR
            </h3>
            <p className="text-xs font-bold text-red-900 font-mono">
              {error === "SESSION_EXPIRED"
                ? "Your session has expired or is invalid. Please authenticate again."
                : error === "SESSION_MISSING"
                ? "You must be signed in to access that resource."
                : error === "FORBIDDEN"
                ? "Access denied for this user role."
                : error}
            </p>
          </div>
        </motion.div>
      )}

      {/* Main Login Card */}
      <div
        className="bg-[var(--organizer-surface)] border-2 border-[var(--organizer-ink-primary)] p-8 sm:p-10"
        style={{ boxShadow: "8px 8px 0px 0px var(--organizer-ink-primary)" }}
      >
        <div className="mb-8">
          <h1 className="text-4xl font-black font-display tracking-tighter uppercase mb-2">
            SYSTEM <span className="text-[var(--organizer-gold-deep)]">ACCESS.</span>
          </h1>
          <p className="text-xs font-mono text-[var(--organizer-ink-muted)] uppercase tracking-wide">
            Select your role clearance and authenticate to proceed.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex border-2 border-[var(--organizer-ink-primary)] mb-8 bg-[var(--organizer-bg)] p-1 gap-1">
          {(["participant", "organizer", "judge"] as Role[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-2 text-[10px] font-bold font-mono uppercase tracking-widest transition-colors ${
                role === r
                  ? "bg-[var(--organizer-gold)] text-[var(--organizer-ink-primary)] border-2 border-[var(--organizer-ink-primary)]"
                  : "text-[var(--organizer-ink-muted)] hover:text-[var(--organizer-ink-primary)] border-2 border-transparent"
              }`}
              style={{
                boxShadow: role === r ? "2px 2px 0px 0px var(--organizer-ink-primary)" : "none",
              }}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)] mb-2 block">
              IDENTITY (EMAIL)
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--organizer-bg)] border-2 border-[var(--organizer-ink-primary)] p-3 pl-10 font-mono text-xs font-bold text-[var(--organizer-ink-primary)] placeholder:text-[var(--organizer-ink-muted)] focus:outline-none focus:ring-0 transition-shadow focus-within:shadow-[4px_4px_0px_0px_var(--organizer-gold)]"
                placeholder="user@ihi.io"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--organizer-ink-muted)]" />
            </div>
          </div>

          {role === "judge" ? (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
              <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)] mb-2 block">
                EVENT ID (NODE)
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                  className="w-full bg-[var(--organizer-bg)] border-2 border-[var(--organizer-ink-primary)] p-3 pl-10 font-mono text-xs font-bold text-[var(--organizer-ink-primary)] placeholder:text-[var(--organizer-ink-muted)] focus:outline-none focus:ring-0 transition-shadow focus-within:shadow-[4px_4px_0px_0px_var(--organizer-gold)]"
                  placeholder="ashish01234"
                />
                <Cpu className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--organizer-ink-muted)]" />
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
              <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)] mb-2 block">
                PASSWORD PASSKEY
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[var(--organizer-bg)] border-2 border-[var(--organizer-ink-primary)] p-3 pl-10 font-mono text-xs font-bold text-[var(--organizer-ink-primary)] placeholder:text-[var(--organizer-ink-muted)] focus:outline-none focus:ring-0 transition-shadow focus-within:shadow-[4px_4px_0px_0px_var(--organizer-gold)]"
                  placeholder="••••••••••••"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--organizer-ink-muted)]" />
              </div>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[var(--organizer-ink-primary)] text-[var(--organizer-surface)] font-bold uppercase tracking-widest text-xs p-4 border-2 border-[var(--organizer-ink-primary)] hover:bg-[var(--organizer-gold)] hover:text-[var(--organizer-ink-primary)] transition-all disabled:opacity-50 flex items-center justify-center gap-2 font-mono"
            style={{ boxShadow: "4px 4px 0px 0px var(--organizer-gold)" }}
          >
            {isLoading
              ? "AUTHENTICATING..."
              : role === "judge"
              ? "ENTER JUDGE PORTAL →"
              : `SIGN IN AS ${role.toUpperCase()} →`}
          </button>
        </form>

        {/* Create Account Link for Participant and Organizer */}
        {role !== "judge" && (
          <div className="mt-8 pt-6 border-t-2 border-[var(--organizer-border-light)] text-center">
            <p className="text-xs font-mono font-bold uppercase tracking-wide text-[var(--organizer-ink-muted)] mb-3">
              Don't have an account yet?
            </p>
            <Link
              href={`/signup?role=${role}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--organizer-gold-light)] border-2 border-[var(--organizer-ink-primary)] font-mono text-xs font-bold uppercase tracking-widest text-[var(--organizer-ink-primary)] hover:bg-[var(--organizer-gold)] transition-colors"
              style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
            >
              <UserPlus className="w-3.5 h-3.5" />
              CREATE NEW {role.toUpperCase()} ACCOUNT
            </Link>
          </div>
        )}
      </div>

      {/* Network Latency Stats */}
      <div className="mt-8 flex justify-between items-center px-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)]">
            Network Stable
          </span>
        </div>
        <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)]">
          14ms Latency
        </span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[var(--organizer-bg)] relative overflow-hidden flex items-center justify-center p-4">
      {/* Blueprint Graph Paper Background */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-80"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--organizer-border) 1px, transparent 1px),
            linear-gradient(to bottom, var(--organizer-border) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage: "linear-gradient(to bottom, black 40%, transparent 95%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 95%)",
        }}
      />

      {/* Floating Shapes */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-[15%] w-24 h-24 bg-[var(--organizer-gold)] border-2 border-[var(--organizer-ink-primary)] z-0 hidden lg:block"
        style={{ boxShadow: "6px 6px 0px 0px var(--organizer-ink-primary)" }}
      />
      <motion.div
        animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-32 left-[15%] w-32 h-32 rounded-full bg-[var(--organizer-surface)] border-2 border-[var(--organizer-ink-primary)] z-0 hidden lg:flex items-center justify-center"
        style={{ boxShadow: "6px 6px 0px 0px var(--organizer-ink-primary)" }}
      >
        <div className="w-16 h-16 rounded-full bg-[var(--organizer-gold-deep)]" />
      </motion.div>

      <Suspense fallback={<div className="font-mono text-sm uppercase">Loading Subsystems...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}