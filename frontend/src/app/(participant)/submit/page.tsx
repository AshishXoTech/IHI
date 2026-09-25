"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input, StatusBadge } from "@/components/ui";
import { PageHeader } from "@/components/layout/PageHeader";
import { clsx } from "clsx";

/* ==========================================================================
   TIME HELPERS
   ========================================================================== */

interface TimeParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function getTimeParts(ms: number): TimeParts {
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  const totalSec = Math.floor(ms / 1000);
  return {
    days: Math.floor(totalSec / 86400),
    hours: Math.floor((totalSec % 86400) / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
    total: ms,
  };
}

function formatCompact(ms: number) {
  const p = getTimeParts(ms);
  if (p.days > 0) {
    return `${p.days}d ${String(p.hours).padStart(2, "0")}:${String(p.minutes).padStart(2, "0")}:${String(p.seconds).padStart(2, "0")}`;
  }
  return [
    String(p.hours).padStart(2, "0"),
    String(p.minutes).padStart(2, "0"),
    String(p.seconds).padStart(2, "0"),
  ].join(":");
}

/* ==========================================================================
   MAIN PAGE
   ========================================================================== */

export default function SubmitProjectPage() {
  const router = useRouter();

  const [deadlineMs, setDeadlineMs] = useState<number>(
    Date.now() + (3 * 3600 + 42 * 60) * 1000
  );
  const [remaining, setRemaining] = useState<number>(3 * 3600 * 1000);
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    tagline: "",
    description: "",
    repository: "",
    demo: "",
  });

  const locked = remaining <= 0;
  const time = getTimeParts(remaining);
  const isUrgent = !locked && time.days === 0 && time.hours < 4;

  /* ---------- Server deadline + ticking clock ---------- */
  useEffect(() => {
    let mounted = true;

    async function fetchServerDeadline() {
      try {
        const res = await fetch("/api/submissions/time");
        if (res.ok) {
          const json = await res.json();
          if (json.ends_at && mounted) {
            const end = new Date(json.ends_at).getTime();
            setDeadlineMs(end);
            setRemaining(Math.max(0, end - Date.now()));
          }
        }
      } catch {
        // Fallback to client timer
      }
    }

    fetchServerDeadline();

    const interval = window.setInterval(() => {
      setRemaining(Math.max(0, deadlineMs - Date.now()));
    }, 1000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, [deadlineMs]);

  const update = (field: keyof typeof form, value: string) => {
    setSaved(false);
    setError(null);
    setForm((current) => ({ ...current, [field]: value }));
  };

  async function handleApiSubmit(isDraft: boolean) {
    if (locked) {
      setError("The submission deadline has passed. Form is locked.");
      return;
    }
    if (!form.title.trim()) {
      setError("Project title is required.");
      return;
    }
    if (!form.repository.trim()) {
      setError("Repository URL is required.");
      return;
    }

    setLoading(true);
    setError(null);

    const fullDescription = form.tagline
      ? `${form.tagline.trim()}\n\n${form.description.trim()}`
      : form.description.trim();

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          description: fullDescription,
          repo_url: form.repository.trim(),
          demo_url: form.demo.trim() || null,
          is_draft: isDraft,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.ok) {
        if (json.code === "forbidden") {
          setError("Submission deadline has passed. Modifications are locked.");
        } else {
          setError(json.error || "Failed to save submission.");
        }
        return;
      }

      if (isDraft) {
        setSaved(true);
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Network error — please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  /* ========================================================================
     SUCCESS STATE
     ======================================================================== */
  if (submitted) {
    return (
      <div className="p-6 lg:p-10 max-w-[1400px] mx-auto min-h-[70vh] flex items-center justify-center">
        <Card
          padding="none"
          variant="elevated"
          className="max-w-md w-full overflow-hidden border-[var(--signal-good)]/30 animate-scale-in"
        >
          <div className="bg-[var(--signal-good-bg)] p-8 border-b border-[var(--border-default)] text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--signal-good)]/20 text-[var(--signal-good)] mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12l5 5L20 7"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="text-heading-md font-display font-bold text-[var(--signal-good)] tracking-tight">
              Submission received
            </h1>
            <p className="mt-2 text-body-sm text-[var(--text-secondary)] leading-relaxed max-w-sm mx-auto">
              Your project has been finalized and sent to the AI Briefing Engine
              for judge review.
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-bg)] p-4 space-y-2">
              <p className="text-label text-[var(--text-muted)]">Project</p>
              <p className="text-body-md font-semibold text-[var(--text-primary)]">
                {form.title}
              </p>
              {form.repository && (
                <p className="text-xs font-mono text-[var(--accent-text)] truncate">
                  {form.repository}
                </p>
              )}
            </div>
            <Button
              className="w-full"
              size="lg"
              onClick={() => router.push("/team")}
              icon={<ArrowIcon />}
              iconPosition="right"
            >
              Return to workspace
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  /* ========================================================================
     MAIN FORM
     ======================================================================== */
  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto space-y-8">
      {/* Header */}
      <PageHeader
        eyebrow="Spring Innovation Challenge"
        title="Submit Project"
        description="Final submission & AI Judge Briefing trigger. Once finalized, your entry is locked."
        actions={
          <StatusBadge
            status={locked ? "critical" : isUrgent ? "attention" : saved ? "good" : "primary"}
            label={
              locked
                ? "Deadline Passed"
                : saved
                ? "Draft Saved"
                : isUrgent
                ? "Closing Soon"
                : "Submissions Open"
            }
            pulse={!locked && !saved}
          />
        }
      />

      {/* Locked banner */}
      {locked && (
        <Card
          padding="sm"
          className="border-[var(--signal-critical)]/40 bg-[var(--signal-critical-bg)]"
        >
          <p className="text-body-sm font-medium text-[var(--signal-critical)] flex items-center gap-2">
            <AlertIcon />
            The submission deadline has passed. Modifications are locked by
            authoritative server rule.
          </p>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================================================================
            LEFT: FORM
            ================================================================ */}
        <div className="lg:col-span-7 xl:col-span-8">
          <Card padding="none" variant="elevated" className="overflow-hidden">
            <div className="p-6 border-b border-[var(--border-default)] bg-[var(--surface-bg)]/60 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-heading-sm font-display font-semibold text-[var(--text-primary)]">
                  Project details
                </h2>
                <p className="text-body-sm text-[var(--text-muted)] mt-0.5">
                  Give judges the links and context they need.
                </p>
              </div>
              <span
                className={clsx(
                  "text-xs font-medium whitespace-nowrap",
                  saved ? "text-[var(--signal-good)]" : "text-[var(--text-muted)]"
                )}
              >
                {saved ? "✓ Draft saved" : "Saves to database"}
              </span>
            </div>

            <form
              className="p-6 space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                handleApiSubmit(false);
              }}
            >
              <Input
                label="Project title *"
                placeholder="e.g. Signal Foundry"
                value={form.title}
                disabled={locked || loading}
                onChange={(e) => update("title", e.target.value)}
                required
              />

              <Input
                label="One-line tagline"
                placeholder="What does your project make possible?"
                value={form.tagline}
                disabled={locked || loading}
                onChange={(e) => update("tagline", e.target.value)}
              />

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] tracking-tight select-none mb-1.5">
                  Project description
                </label>
                <textarea
                  value={form.description}
                  disabled={locked || loading}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Explain the problem, your approach, and what is ready to demo."
                  rows={5}
                  className={clsx(
                    "w-full resize-y rounded-[var(--radius-md)] border bg-[var(--surface)] px-3.5 py-2.5",
                    "text-body-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
                    "border-[var(--border-default)] hover:border-[var(--border-strong)]",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)]",
                    "transition-all duration-normal",
                    (locked || loading) &&
                      "opacity-40 pointer-events-none cursor-not-allowed bg-[var(--surface-bg)]"
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="Repository URL *"
                  type="url"
                  placeholder="https://github.com/your-team/project"
                  value={form.repository}
                  disabled={locked || loading}
                  onChange={(e) => update("repository", e.target.value)}
                  required
                  icon={<GithubIcon />}
                />
                <Input
                  label="Demo URL"
                  type="url"
                  placeholder="https://your-project.example.com"
                  value={form.demo}
                  disabled={locked || loading}
                  onChange={(e) => update("demo", e.target.value)}
                  icon={<GlobeIcon />}
                />
              </div>

              {error && (
                <Card
                  padding="sm"
                  className="border-[var(--destructive)]/40 bg-[var(--destructive-subtle)]"
                  role="alert"
                >
                  <p className="text-body-sm font-medium text-[var(--destructive)] flex items-center gap-2">
                    <AlertIcon />
                    {error}
                  </p>
                </Card>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-[var(--border-default)] pt-5 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={locked || loading}
                  onClick={() => handleApiSubmit(true)}
                >
                  Save Draft
                </Button>
                <Button
                  type="submit"
                  disabled={
                    locked ||
                    loading ||
                    !form.title.trim() ||
                    !form.repository.trim()
                  }
                  loading={loading}
                  icon={<LockIcon />}
                  iconPosition="right"
                >
                  Finalize & Submit
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* ================================================================
            RIGHT: COUNTDOWN + GUIDELINES
            ================================================================ */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          {/* Countdown */}
          <Card
            padding="md"
            variant="default"
            className={clsx(
              "relative overflow-hidden transition-colors duration-normal",
              locked
                ? "border-[var(--signal-critical)]/40 bg-[var(--signal-critical-bg)]"
                : isUrgent
                ? "border-[var(--signal-attention)]/40 bg-[var(--signal-attention-bg)]"
                : ""
            )}
          >
            {!locked && (
              <div
                className={clsx(
                  "absolute -top-12 -right-12 h-32 w-32 rounded-full blur-3xl opacity-20 pointer-events-none",
                  isUrgent ? "bg-[var(--signal-attention)]" : "bg-[var(--accent)]"
                )}
              />
            )}

            <div className="relative z-10 text-center">
              <p
                className={clsx(
                  "text-label mb-4",
                  locked
                    ? "text-[var(--signal-critical)]"
                    : isUrgent
                    ? "text-[var(--signal-attention)]"
                    : "text-[var(--text-muted)]"
                )}
              >
                {locked ? "DEADLINE PASSED" : "TIME REMAINING"}
              </p>

              {/* Compact mono readout for small screens */}
              <p
                className={clsx(
                  "font-mono text-heading-md font-bold tabular-nums tracking-tight sm:hidden mb-4",
                  locked
                    ? "text-[var(--signal-critical)]"
                    : "text-[var(--text-primary)]"
                )}
              >
                {formatCompact(remaining)}
              </p>

              {/* Unit boxes for larger screens */}
              <div className="hidden sm:flex justify-center gap-2.5">
                {(
                  [
                    { label: "DAYS", value: time.days },
                    { label: "HRS", value: time.hours },
                    { label: "MIN", value: time.minutes },
                    { label: "SEC", value: time.seconds },
                  ] as const
                ).map((unit) => (
                  <div key={unit.label} className="flex flex-col items-center">
                    <div
                      className={clsx(
                        "flex h-14 w-14 items-center justify-center rounded-[var(--radius-md)] border shadow-sm",
                        locked
                          ? "bg-[var(--signal-critical)]/10 border-[var(--signal-critical)]/20 text-[var(--signal-critical)]"
                          : isUrgent
                          ? "bg-[var(--surface-bg)] border-[var(--signal-attention)]/30 text-[var(--text-primary)]"
                          : "bg-[var(--surface-bg)] border-[var(--border-default)] text-[var(--text-primary)]"
                      )}
                    >
                      <span className="font-mono text-heading-sm font-bold tabular-nums tracking-tighter">
                        {String(unit.value).padStart(2, "0")}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-[var(--text-muted)] mt-1.5 tracking-widest uppercase">
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Guidelines */}
          <Card padding="md" variant="flat">
            <h3 className="text-body-md font-semibold text-[var(--text-primary)] mb-4">
              Submission Guidelines
            </h3>
            <ul className="space-y-4">
              {[
                {
                  title: "Repository Access",
                  desc: "Ensure your GitHub/GitLab repository is public. Private repos cannot be evaluated.",
                },
                {
                  title: "Detailed README",
                  desc: "Include setup instructions, tech stack, and the problem you solved.",
                },
                {
                  title: "Working Demo",
                  desc: "A deployed app or video demo improves UX/Viability scores significantly.",
                },
                {
                  title: "Immutable Handoff",
                  desc: "Once you click Finalize, your entry is locked. Only organizers can unlock it.",
                },
              ].map((g, i) => (
                <li key={g.title} className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--surface-bg)] border border-[var(--border-default)] text-[10px] font-mono text-[var(--text-secondary)]">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-body-sm font-semibold text-[var(--text-primary)]">
                      {g.title}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                      {g.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   ICONS
   ========================================================================== */

function AlertIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4.5v4.5M8 11.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M3.5 6.417V4.083a3.5 3.5 0 117 0v2.334m-8.167 0h9.334c.644 0 1.166.522 1.166 1.166v4.084c0 .644-.522 1.166-1.166 1.166H2.333c-.644 0-1.166-.522-1.166-1.166V7.583c0-.644.522-1.166 1.166-1.166z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M3 7h8M7 3l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}