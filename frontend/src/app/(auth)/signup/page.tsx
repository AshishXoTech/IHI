"use client";

import React, { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  Building2,
  Users,
} from "lucide-react";
import Link from "next/link";

type Role = "participant" | "organizer";

function SignupForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialRole =
    searchParams.get("role") === "organizer" ? "organizer" : "participant";

  const [role, setRole] = useState<Role>(initialRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!name.trim() || !email.trim() || password.length < 8) {
      setStatus({
        type: "error",
        text: "Full name, email, and password (min 8 characters) are required.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Signup failed");
      }

      setStatus({
        type: "success",
        text: `Account created. Redirecting to ${role} workspace…`,
      });

      setTimeout(() => {
        window.location.href = data.redirectUrl || "/login";
      }, 700);
    } catch (err: any) {
      setIsLoading(false);
      setStatus({
        type: "error",
        text: err?.message || "Could not create account. Try again.",
      });
    }
  };

  return (
    <div className="w-full max-w-lg relative z-10">
      {status && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 border-2 p-4 flex items-start gap-3 ${
            status.type === "error"
              ? "bg-red-50 border-red-600 text-red-900"
              : "bg-emerald-50 border-emerald-600 text-emerald-900"
          }`}
          style={{
            boxShadow:
              status.type === "error"
                ? "4px 4px 0px 0px #DC2626"
                : "4px 4px 0px 0px #059669",
          }}
        >
          {status.type === "error" ? (
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          )}
          <p className="text-xs font-mono font-bold uppercase tracking-wide">
            {status.text}
          </p>
        </motion.div>
      )}

      <div
        className="bg-[var(--organizer-surface)] border-2 border-[var(--organizer-ink-primary)] p-8 sm:p-10"
        style={{ boxShadow: "8px 8px 0px 0px var(--organizer-ink-primary)" }}
      >
        <div className="mb-8">
          <div
            className="inline-block mb-3 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold-light)] px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest"
            style={{ boxShadow: "2px 2px 0px 0px var(--organizer-ink-primary)" }}
          >
            ONBOARDING · RBAC
          </div>
          <h1 className="text-4xl font-black font-display tracking-tighter uppercase mb-2">
            CREATE <span className="text-[var(--organizer-gold-deep)]">ACCOUNT.</span>
          </h1>
          <p className="text-xs font-mono uppercase tracking-wide text-[var(--organizer-ink-muted)]">
            Join as a builder or run events as an organizer.
          </p>
        </div>

        {/* Role Tabs */}
        <div className="flex border-2 border-[var(--organizer-ink-primary)] mb-8 bg-[var(--organizer-bg)] p-1 gap-1">
          {(
            [
              { id: "participant" as Role, label: "Participant", icon: Users },
              { id: "organizer" as Role, label: "Organizer", icon: Building2 },
            ] as const
          ).map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRole(r.id)}
              className={`flex-1 py-2.5 text-[10px] font-bold font-mono uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${
                role === r.id
                  ? "bg-[var(--organizer-gold)] text-[var(--organizer-ink-primary)] border-2 border-[var(--organizer-ink-primary)]"
                  : "text-[var(--organizer-ink-muted)] hover:text-[var(--organizer-ink-primary)] border-2 border-transparent"
              }`}
              style={{
                boxShadow:
                  role === r.id
                    ? "2px 2px 0px 0px var(--organizer-ink-primary)"
                    : "none",
              }}
            >
              <r.icon className="w-3.5 h-3.5" />
              {r.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)] mb-2 block">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[var(--organizer-bg)] border-2 border-[var(--organizer-ink-primary)] p-3 pl-10 font-mono text-xs font-bold text-[var(--organizer-ink-primary)] placeholder:text-[var(--organizer-ink-muted)] focus:outline-none focus:shadow-[4px_4px_0px_0px_var(--organizer-gold)]"
                placeholder="Alex Chen"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--organizer-ink-muted)]" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)] mb-2 block">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--organizer-bg)] border-2 border-[var(--organizer-ink-primary)] p-3 pl-10 font-mono text-xs font-bold text-[var(--organizer-ink-primary)] placeholder:text-[var(--organizer-ink-muted)] focus:outline-none focus:shadow-[4px_4px_0px_0px_var(--organizer-gold)]"
                placeholder="you@university.edu"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--organizer-ink-muted)]" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)] mb-2 block">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--organizer-bg)] border-2 border-[var(--organizer-ink-primary)] p-3 pl-10 pr-16 font-mono text-xs font-bold text-[var(--organizer-ink-primary)] placeholder:text-[var(--organizer-ink-muted)] focus:outline-none focus:shadow-[4px_4px_0px_0px_var(--organizer-gold)]"
                placeholder="At least 8 characters"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--organizer-ink-muted)]" />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold uppercase text-[var(--organizer-ink-muted)] hover:text-[var(--organizer-ink-primary)]"
              >
                {showPassword ? (
                  <span className="flex items-center gap-1">
                    <EyeOff className="w-3.5 h-3.5" /> Hide
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> Show
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Role capability note */}
          <div className="border-2 border-[var(--organizer-border)] bg-[var(--organizer-bg)] p-3 text-[10px] font-mono uppercase tracking-wide text-[var(--organizer-ink-muted)]">
            {role === "organizer" ? (
              <span>
                <strong className="text-[var(--organizer-ink-primary)]">Organizer RBAC:</strong>{" "}
                create events, manage rubrics, invite judges, publish results.
              </span>
            ) : (
              <span>
                <strong className="text-[var(--organizer-ink-primary)]">Participant RBAC:</strong>{" "}
                join hackathons, form teams, submit projects, view scores.
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[var(--organizer-gold)] text-[var(--organizer-ink-primary)] font-mono text-xs font-black uppercase tracking-widest p-4 border-2 border-[var(--organizer-ink-primary)] hover:bg-[var(--organizer-gold-deep)] hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ boxShadow: "4px 4px 0px 0px var(--organizer-ink-primary)" }}
          >
            {isLoading ? "CREATING ACCOUNT…" : "CREATE ACCOUNT"}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t-2 border-[var(--organizer-border-light)] text-center">
          <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--organizer-ink-muted)] mb-2">
            Already have an account?
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-4 py-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-[var(--organizer-gold-light)] transition-colors"
            style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
          >
            Sign in →
          </Link>
        </div>
      </div>

      {/* Side stats strip */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div
          className="border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] p-3"
          style={{ boxShadow: "3px 3px 0px 0px var(--organizer-gold)" }}
        >
          <div className="text-2xl font-black font-display">100k+</div>
          <div className="text-[9px] font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)]">
            Developers
          </div>
        </div>
        <div
          className="border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] p-3"
          style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
        >
          <div className="text-2xl font-black font-display">500+</div>
          <div className="text-[9px] font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)]">
            Annual Events
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[var(--organizer-bg)] relative overflow-hidden flex items-center justify-center p-4">
      {/* Blueprint grid */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-80"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--organizer-border) 1px, transparent 1px),
            linear-gradient(to bottom, var(--organizer-border) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage: "linear-gradient(to bottom, black 40%, transparent 95%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 40%, transparent 95%)",
        }}
      />

      {/* Floating shapes */}
      <motion.div
        animate={{ y: [0, -18, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-16 right-[12%] w-20 h-20 bg-[var(--organizer-gold)] border-2 border-[var(--organizer-ink-primary)] z-0 hidden lg:block"
        style={{ boxShadow: "6px 6px 0px 0px var(--organizer-ink-primary)" }}
      />
      <motion.div
        animate={{ y: [0, 22, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        className="absolute bottom-28 left-[12%] w-28 h-28 rounded-full bg-[var(--organizer-surface)] border-2 border-[var(--organizer-ink-primary)] z-0 hidden lg:flex items-center justify-center"
        style={{ boxShadow: "6px 6px 0px 0px var(--organizer-ink-primary)" }}
      >
        <div className="w-12 h-12 rounded-full bg-[var(--organizer-gold-deep)]" />
      </motion.div>

      <Suspense
        fallback={
          <div className="font-mono text-xs uppercase tracking-widest">
            Loading onboarding…
          </div>
        }
      >
        <SignupForm />
      </Suspense>
    </div>
  );
}