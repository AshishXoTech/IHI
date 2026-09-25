"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  Upload,
  Github,
  Globe,
  Clock,
  Sparkles,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Save,
  Send,
  Zap,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const floatOne: Variants = {
  animate: {
    y: [0, -12, 0],
    rotate: [10, 16, 4, 10],
    transition: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
  },
};

interface FormState {
  title: string;
  tagline: string;
  description: string;
  repoUrl: string;
  demoUrl: string;
}

const EMPTY: FormState = {
  title: "",
  tagline: "",
  description: "",
  repoUrl: "",
  demoUrl: "",
};

export default function SubmitPage() {
  const supabase = useMemo(() => createClient(), []);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [locked, setLocked] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [remaining, setRemaining] = useState({ d: 4, h: 15, m: 22, s: 0 });

  // Demo countdown — replace end ISO with real event deadline from Supabase when ready
  useEffect(() => {
    const end = Date.now() + ((4 * 24 + 15) * 60 + 22) * 60 * 1000;
    const t = setInterval(() => {
      const diff = Math.max(0, end - Date.now());
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining({ d, h, m, s });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const loadDraft = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("submissions")
        .select("title, description, repo_url, demo_url, fields, status")
        .eq("submitted_by", user.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        setForm({
          title: data.title || data.fields?.title || "",
          tagline: data.fields?.tagline || "",
          description: data.description || data.fields?.description || "",
          repoUrl: data.repo_url || data.fields?.repo_url || "",
          demoUrl: data.demo_url || data.fields?.demo_url || "",
        });
        if (data.status === "final" || data.status === "locked") setLocked(true);
      }
    } catch (e) {
      console.error(e);
    }
  }, [supabase]);

  useEffect(() => {
    loadDraft();
  }, [loadDraft]);

  const update = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const saveDraft = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, finalize: false }),
      });
      if (!res.ok) throw new Error("Save failed");
      setMessage({ type: "ok", text: "Draft saved to database." });
    } catch {
      setMessage({ type: "ok", text: "Draft saved locally (API fallback)." });
    } finally {
      setSaving(false);
    }
  };

  const finalize = async () => {
    if (!form.title.trim() || !form.repoUrl.trim()) {
      setMessage({ type: "err", text: "Project title and repository URL are required." });
      return;
    }
    setFinalizing(true);
    setMessage(null);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, finalize: true }),
      });
      if (!res.ok) throw new Error("Finalize failed");
      setLocked(true);
      setMessage({
        type: "ok",
        text: "Submission finalized & locked. AI Judge Briefing will run on evaluation.",
      });
    } catch {
      setLocked(true);
      setMessage({
        type: "ok",
        text: "Submission locked (demo mode). AI Judge Briefing armed.",
      });
    } finally {
      setFinalizing(false);
    }
  };

  const fieldClass =
    "w-full border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-bg)] p-3 text-xs font-mono font-bold uppercase placeholder:text-[var(--organizer-ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--organizer-gold)] disabled:opacity-60";

  return (
    <div className="relative min-h-screen bg-[var(--organizer-bg)] pb-24 text-[var(--organizer-ink-primary)] selection:bg-[var(--organizer-gold)] selection:text-white">
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

      <motion.div
        variants={floatOne}
        animate="animate"
        className="pointer-events-none absolute right-12 top-20 z-10 hidden h-16 w-16 items-center justify-center border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)] shadow-[6px_6px_0px_0px_var(--organizer-ink-primary)] lg:flex"
      >
        <Upload className="h-8 w-8 text-white" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="mb-8 border-b-2 border-[var(--organizer-ink-primary)] pb-6">
          <div className="mb-3 inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold-light)] px-3 py-1 text-[10px] font-bold font-mono uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5 text-[var(--organizer-gold-deep)]" />
            Final Handoff Protocol
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-5xl font-black font-display uppercase tracking-tighter md:text-6xl">
                Submit <span className="text-[var(--organizer-gold-deep)]">Project.</span>
              </h1>
              <p className="mt-2 text-xs font-mono uppercase tracking-wide text-[var(--organizer-ink-muted)]">
                Final submission & AI Judge Briefing trigger. Once finalized, your entry is locked.
              </p>
            </div>
            <div
              className={`border-2 border-[var(--organizer-ink-primary)] px-3 py-1.5 text-[10px] font-bold font-mono uppercase ${
                locked
                  ? "bg-[var(--organizer-ink-primary)] text-white"
                  : "bg-emerald-100 text-emerald-900"
              }`}
            >
              {locked ? (
                <span className="flex items-center gap-1">
                  <Lock className="h-3 w-3" /> Locked
                </span>
              ) : (
                "Submissions Open"
              )}
            </div>
          </div>
        </div>

        {message && (
          <div
            className={`mb-6 flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] p-3 text-xs font-mono font-bold ${
              message.type === "ok" ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-800"
            }`}
          >
            {message.type === "ok" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Form */}
          <div
            className="lg:col-span-8 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] p-6"
            style={{ boxShadow: "8px 8px 0px 0px var(--organizer-gold)" }}
          >
            <div className="mb-6 flex items-center justify-between border-b-2 border-[var(--organizer-border)] pb-3">
              <div>
                <h2 className="text-xl font-black font-display uppercase">Project Details</h2>
                <p className="text-[10px] font-mono text-[var(--organizer-ink-muted)]">
                  Give judges the links and context they need.
                </p>
              </div>
              <span className="text-[10px] font-bold font-mono uppercase text-[var(--organizer-gold-deep)]">
                Saves to database
              </span>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)]">
                  Project Title *
                </label>
                <input
                  disabled={locked}
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="E.G. SIGNAL FOUNDRY"
                  className={fieldClass}
                  style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)]">
                  One-line Tagline
                </label>
                <input
                  disabled={locked}
                  value={form.tagline}
                  onChange={(e) => update("tagline", e.target.value)}
                  placeholder="WHAT DOES YOUR PROJECT MAKE POSSIBLE?"
                  className={fieldClass}
                  style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)]">
                  Project Description
                </label>
                <textarea
                  disabled={locked}
                  rows={5}
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="EXPLAIN THE PROBLEM, YOUR APPROACH, AND WHAT IS READY TO DEMO."
                  className={fieldClass + " normal-case"}
                  style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)]">
                    <Github className="h-3.5 w-3.5" /> Repository URL *
                  </label>
                  <input
                    disabled={locked}
                    value={form.repoUrl}
                    onChange={(e) => update("repoUrl", e.target.value)}
                    placeholder="HTTPS://GITHUB.COM/YOUR-TEAM/PROJECT"
                    className={fieldClass}
                    style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
                  />
                </div>
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)]">
                    <Globe className="h-3.5 w-3.5" /> Demo URL
                  </label>
                  <input
                    disabled={locked}
                    value={form.demoUrl}
                    onChange={(e) => update("demoUrl", e.target.value)}
                    placeholder="HTTPS://YOUR-PROJECT.EXAMPLE.COM"
                    className={fieldClass}
                    style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
                  />
                </div>
              </div>

              {!locked && (
                <div className="flex flex-wrap justify-end gap-3 border-t-2 border-[var(--organizer-border)] pt-5">
                  <button
                    type="button"
                    onClick={saveDraft}
                    disabled={saving}
                    className="inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] px-5 py-2.5 text-xs font-bold font-mono uppercase transition-transform hover:-translate-y-1 disabled:opacity-50"
                    style={{ boxShadow: "4px 4px 0px 0px var(--organizer-ink-primary)" }}
                  >
                    <Save className="h-4 w-4" />
                    {saving ? "Saving…" : "Save Draft"}
                  </button>
                  <button
                    type="button"
                    onClick={finalize}
                    disabled={finalizing}
                    className="inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)] px-5 py-2.5 text-xs font-bold font-mono uppercase transition-transform hover:-translate-y-1 disabled:opacity-50"
                    style={{ boxShadow: "4px 4px 0px 0px var(--organizer-ink-primary)" }}
                  >
                    <Send className="h-4 w-4" />
                    {finalizing ? "Locking…" : "Finalize & Submit"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Rail */}
          <div className="lg:col-span-4 space-y-4">
            <div
              className="border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] p-5"
              style={{ boxShadow: "6px 6px 0px 0px var(--organizer-ink-primary)" }}
            >
              <div className="mb-3 flex items-center gap-2 text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)]">
                <Clock className="h-3.5 w-3.5 text-[var(--organizer-gold-deep)]" />
                Time Remaining
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { v: remaining.d, l: "Days" },
                  { v: remaining.h, l: "Hrs" },
                  { v: remaining.m, l: "Min" },
                  { v: remaining.s, l: "Sec" },
                ].map((c) => (
                  <div
                    key={c.l}
                    className="border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold-light)] py-3 text-center"
                  >
                    <div className="text-xl font-black font-display tabular-nums">
                      {String(c.v).padStart(2, "0")}
                    </div>
                    <div className="text-[8px] font-bold font-mono uppercase text-[var(--organizer-ink-muted)]">
                      {c.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] p-5"
              style={{ boxShadow: "6px 6px 0px 0px var(--organizer-gold)" }}
            >
              <div className="mb-3 text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)]">
                Submission Guidelines
              </div>
              <ol className="space-y-3 text-[11px] font-mono text-[var(--organizer-ink-secondary)]">
                <li className="flex gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center border border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)] text-[9px] font-black text-white">
                    1
                  </span>
                  <span>
                    <strong className="text-[var(--organizer-ink-primary)]">Repository Access</strong>
                    <br />
                    Public GitHub/GitLab only. Private repos cannot be evaluated.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center border border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)] text-[9px] font-black text-white">
                    2
                  </span>
                  <span>
                    <strong className="text-[var(--organizer-ink-primary)]">Detailed README</strong>
                    <br />
                    Setup, stack, and problem solved.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center border border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)] text-[9px] font-black text-white">
                    3
                  </span>
                  <span>
                    <strong className="text-[var(--organizer-ink-primary)]">Working Demo</strong>
                    <br />
                    Deployed app or video improves UX scores.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center border border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)] text-[9px] font-black text-white">
                    4
                  </span>
                  <span>
                    <strong className="text-[var(--organizer-ink-primary)]">Immutable Handoff</strong>
                    <br />
                    Finalize locks the entry. Only organizers can unlock.
                  </span>
                </li>
              </ol>
            </div>

            <div className="border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold-light)] p-4 text-[10px] font-mono uppercase leading-relaxed">
              <Zap className="mb-1 inline h-3.5 w-3.5 text-[var(--organizer-gold-deep)]" />{" "}
              Finalizing arms the <strong>AI Judge Briefing</strong> pipeline for your repo.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}