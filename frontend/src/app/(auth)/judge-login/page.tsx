"use client";

import React, { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Mail, ShieldCheck, AlertTriangle } from "lucide-react";
import Link from "next/link";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const floatVariants: Variants = {
  animate: {
    y: [0, -15, 0],
    rotate: [0, 5, -5, 0],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
  },
};

export default function JudgeLoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/auth/magic/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--organizer-bg)] text-[var(--organizer-ink-primary)] selection:bg-[var(--organizer-gold)] selection:text-white flex items-center justify-center p-4">
      {/* Blueprint Graph-Paper Background */}
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
        variants={floatVariants}
        animate="animate"
        className="pointer-events-none absolute top-24 left-24 z-0 hidden lg:block h-16 w-16 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)]"
        style={{ boxShadow: "6px 6px 0px 0px var(--organizer-ink-primary)" }}
      />

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold-light)] px-3 py-1 text-[10px] font-bold font-mono uppercase tracking-widest mb-4">
              SECURE ACCESS
            </span>
            <h1 className="text-4xl sm:text-5xl font-black font-display tracking-tighter uppercase">
              JUDGE <span className="text-[var(--organizer-gold-deep)]">PORTAL.</span>
            </h1>
            <p className="mt-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--organizer-ink-muted)]">
              No password required. We'll send a secure magic link to your email.
            </p>
          </div>

          {/* Login Card */}
          <motion.div
            variants={cardVariants}
            className="border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] p-8"
            style={{ boxShadow: "6px 6px 0px 0px var(--organizer-gold)" }}
          >
            {status === "success" ? (
              <div className="text-center space-y-4 py-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[var(--organizer-ink-primary)] bg-emerald-100">
                  <ShieldCheck className="h-8 w-8 text-emerald-700" />
                </div>
                <h3 className="text-lg font-black font-display uppercase tracking-tight">
                  Check your inbox
                </h3>
                <p className="text-xs font-mono text-[var(--organizer-ink-secondary)]">
                  We sent a secure magic link to <strong className="text-[var(--organizer-ink-primary)]">{email}</strong>. Click the link to enter the judging queue automatically.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-4 text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)] hover:text-[var(--organizer-ink-primary)] transition-colors"
                >
                  Use a different email
                </button>
              </div>
            ) : (
              <form onSubmit={handleMagicLink} className="space-y-6">
                {status === "error" && (
                  <div className="border-2 border-[var(--organizer-ink-primary)] bg-red-50 p-3 flex items-center gap-3">
                    <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-900">
                      Failed to send link. Please try again.
                    </span>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)] mb-2">
                    Judge Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--organizer-ink-muted)]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="judge@university.edu"
                      className="w-full border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-bg)] py-3 pl-10 pr-3 text-xs font-mono font-bold uppercase placeholder:text-[var(--organizer-ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--organizer-gold)]"
                      style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full inline-flex items-center justify-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)] px-5 py-3 text-xs font-bold font-mono uppercase tracking-wider transition-transform hover:-translate-x-1 hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0"
                  style={{ boxShadow: "4px 4px 0px 0px var(--organizer-ink-primary)" }}
                >
                  {status === "loading" ? "Sending..." : "Send Access Link"} <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </motion.div>

          <div className="text-center mt-6">
            <Link
              href="/"
              className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)] hover:text-[var(--organizer-gold-deep)] transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}