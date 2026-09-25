"use client";

import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button, Card, StatusBadge } from "@/components/ui";
import { AIBriefingPanel } from "@/components/dashboard/AIBriefingPanel";
import { PageHeader } from "@/components/layout/PageHeader";
import { createClient } from "@/lib/supabase/client";
import { useMotion } from "@/components/providers/MotionProvider";
import type { CriterionScoreInput, RubricCriterion } from "@/types/shared";
import { clsx } from "clsx";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const DEFAULT_FALLBACK_CRITERIA: RubricCriterion[] = [
  {
    id: "fallback-1",
    title: "Technical Complexity",
    description: "Architecture, code quality, and technical depth",
    max_score: 10,
    weight: 30,
  },
  {
    id: "fallback-2",
    title: "Originality & Innovation",
    description: "Uniqueness of idea and creative execution",
    max_score: 10,
    weight: 25,
  },
  {
    id: "fallback-3",
    title: "Design & User Experience",
    description: "UI polish, responsiveness, and usability",
    max_score: 10,
    weight: 25,
  },
  {
    id: "fallback-4",
    title: "Impact & Utility",
    description: "Practical application and real-world value",
    max_score: 10,
    weight: 20,
  },
];

export interface ScoreWorkspaceProps {
  submissionId: string;
  eventId?: string;
}

export function ScoreWorkspace({ submissionId, eventId }: ScoreWorkspaceProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const { isReducedMotion } = useMotion();

  const queueHref = eventId
    ? `/judge/queue?eventId=${encodeURIComponent(eventId)}`
    : "/judge/queue";

  // GSAP Pin Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  // State
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [submission, setSubmission] = useState<{
    id: string;
    title: string;
    description: string;
    repo_url: string | null;
    demo_url: string | null;
    team_name: string;
  } | null>(null);

  const [criteria, setCriteria] = useState<RubricCriterion[]>(DEFAULT_FALLBACK_CRITERIA);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState("");
  const [existingScore, setExistingScore] = useState<any | null>(null);

  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [reason, setReason] = useState("");
  const [correctionSubmitting, setCorrectionSubmitting] = useState(false);

  /* ========================================================================
     DATA LOADING
     ======================================================================== */
  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const scoreUrl = eventId
        ? `/api/judging/score?submissionId=${submissionId}&eventId=${encodeURIComponent(eventId)}`
        : `/api/judging/score?submissionId=${submissionId}`;

      const scoreRes = await fetch(scoreUrl);
      if (scoreRes.ok) {
        const scoreJson = await scoreRes.json();
        if (scoreJson.isScored) {
          setExistingScore(scoreJson.data);
        }
      }

      const { data: subData } = await supabase
        .from("submissions")
        .select("id, title, description, repo_url, demo_url, fields, team_id, teams(name)")
        .eq("id", submissionId)
        .maybeSingle();

      if (subData) {
        const teamName = Array.isArray(subData.teams)
          ? subData.teams[0]?.name
          : (subData.teams as any)?.name || "Assigned Team";

        setSubmission({
          id: subData.id,
          title:
            subData.title ||
            subData.fields?.title ||
            subData.fields?.project_title ||
            "Project Submission",
          description:
            subData.description ||
            subData.fields?.description ||
            "No project description provided.",
          repo_url:
            subData.repo_url ||
            subData.fields?.repo_url ||
            subData.fields?.repo ||
            null,
          demo_url:
            subData.demo_url ||
            subData.fields?.demo_url ||
            subData.fields?.demo ||
            null,
          team_name: teamName,
        });
      }

      const initialScores: Record<string, number> = {};
      DEFAULT_FALLBACK_CRITERIA.forEach((c) => {
        initialScores[c.id || c.title] = Math.floor(c.max_score / 2);
      });
      setScores(initialScores);
      setCriteria(DEFAULT_FALLBACK_CRITERIA);
    } catch {
      setErrorMessage("Error loading scoring workspace.");
    } finally {
      setLoading(false);
    }
  }, [submissionId, supabase, eventId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ========================================================================
     GSAP PINNING (Desktop Only, respects prefers-reduced-motion)
     ======================================================================== */
  useEffect(() => {
    if (isReducedMotion || loading || existingScore) return;
    if (!containerRef.current || !rightPanelRef.current || !leftPanelRef.current) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const st = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top+=96",
        end: () =>
          `+=${leftPanelRef.current!.offsetHeight - rightPanelRef.current!.offsetHeight}`,
        pin: rightPanelRef.current,
        pinSpacing: false,
        invalidateOnRefresh: true,
      });
      return () => st.kill();
    });

    return () => mm.revert();
  }, [isReducedMotion, loading, existingScore]);

  /* ========================================================================
     CALCULATIONS & SUBMISSION
     ======================================================================== */
  const calculateWeightedTotal = () => {
    let total = 0;
    criteria.forEach((c) => {
      const key = c.id || c.title;
      const s = scores[key] || 0;
      total += (s / c.max_score) * c.weight;
    });
    return total.toFixed(1);
  };

  const handleScoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (existingScore || submitting) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    setSubmitting(true);

    const payloadCriteria: CriterionScoreInput[] = criteria.map((c) => {
      const key = c.id || c.title;
      return {
        criterion_id: key,
        title: c.title,
        score: Number(scores[key] ?? 0),
        max_score: c.max_score,
        weight: c.weight,
      };
    });

    try {
      const res = await fetch("/api/judging/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId,
          eventId: eventId || undefined,
          criteriaScores: payloadCriteria,
          feedback,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.ok) {
        setErrorMessage(json.error || "Failed to submit score.");
        setSubmitting(false);
        return;
      }

      setSuccessMessage("Score submitted successfully. Viewing locked summary.");
      await loadData();
    } catch {
      setErrorMessage("Network error submitting score.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCorrectionRequest = async () => {
    if (reason.trim().length < 10) return;
    setCorrectionSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setShowCorrectionModal(false);
      router.push(queueHref);
    } finally {
      setCorrectionSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="space-y-3 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-700 border-t-gold" />
          <p className="font-body text-sm text-gray-400">Loading scoring workspace…</p>
        </div>
      </div>
    );
  }

  // Description formatted strictly as a string for PageHeader
  const headerDescription = `Team: ${submission?.team_name || "—"}${
    eventId ? ` · Event ID: ${eventId}` : ""
  }`;

  return (
    <div className="mx-auto max-w-[1400px] space-y-8 p-6 lg:p-10">
      {/* Header */}
      <div className="rounded-2xl border border-gray-800 bg-black/50 p-5 backdrop-blur-md md:p-6">
        <PageHeader
          breadcrumbs={[
            { label: "Queue", href: queueHref },
            { label: submission?.title || "Submission" },
          ]}
          title={submission?.title || "Project Submission"}
          description={headerDescription}
          actions={
            <div className="flex items-center gap-3">
              <StatusBadge
                status={existingScore ? "good" : "attention"}
                label={existingScore ? "Scored & Locked" : "Scoring Active"}
                pulse={!existingScore}
              />
              <Link href={queueHref}>
                <Button variant="secondary" size="sm" icon={<BackIcon />}>
                  Back to Queue
                </Button>
              </Link>
            </div>
          }
        />
      </div>

      {/* Alerts */}
      {errorMessage && (
        <div className="rounded-xl border border-gray-600 bg-gray-900/80 px-4 py-3 backdrop-blur-md">
          <p className="flex items-center gap-2 font-body text-sm font-medium text-white">
            <AlertIcon /> {errorMessage}
          </p>
        </div>
      )}
      {successMessage && (
        <div className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 backdrop-blur-md">
          <p className="flex items-center gap-2 font-body text-sm font-medium text-gold-light">
            <CheckIcon /> {successMessage}
          </p>
        </div>
      )}

      {/* Split-Screen Workspace */}
      <div ref={containerRef} className="relative grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Left Column: Brief + AI */}
        <div ref={leftPanelRef} className="space-y-6 lg:col-span-5 xl:col-span-6">
          <Card padding="md" variant="default" className="border-gray-800 bg-gray-900/70 backdrop-blur-md">
            <h2 className="mb-4 font-display text-lg font-semibold text-white">
              Project Details
            </h2>
            <p className="whitespace-pre-line font-body text-sm leading-relaxed text-gray-300">
              {submission?.description}
            </p>

            <div className="mt-6 space-y-4 border-t border-gray-800 pt-5">
              <div>
                <p className="mb-1.5 font-body text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Repository
                </p>
                {submission?.repo_url ? (
                  <a
                    href={submission.repo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all font-mono text-sm text-gold-light hover:underline"
                  >
                    {submission.repo_url} ↗
                  </a>
                ) : (
                  <span className="font-body text-sm italic text-gray-500">Not provided</span>
                )}
              </div>
              {submission?.demo_url && (
                <div>
                  <p className="mb-1.5 font-body text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Live Demo
                  </p>
                  <a
                    href={submission.demo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all font-mono text-sm text-gold-light hover:underline"
                  >
                    {submission.demo_url} ↗
                  </a>
                </div>
              )}
            </div>
          </Card>

          <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/70 backdrop-blur-md">
            <AIBriefingPanel
              submissionId={submissionId}
              repoUrl={submission?.repo_url}
              projectTitle={submission?.title}
            />
          </div>
        </div>

        {/* Right Column: Rubric (Pinned) */}
        <div ref={rightPanelRef} className="w-full lg:col-span-7 xl:col-span-6">
          {existingScore ? (
            /* Read-Only Summary */
            <Card padding="none" variant="elevated" className="overflow-hidden border-gray-800 bg-gray-900/80 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-gray-800 bg-black/40 p-6">
                <div>
                  <h2 className="font-display text-lg font-semibold text-white">
                    Submitted Score Summary
                  </h2>
                  <p className="mt-1 font-body text-sm text-gray-500">
                    {new Date(existingScore.created_at || Date.now()).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-body text-[10px] font-semibold uppercase tracking-wider text-gray-500">Total</p>
                  <p className="font-mono text-2xl font-bold tabular-nums text-gold-light">
                    {existingScore.total_score}
                  </p>
                </div>
              </div>

              <div className="space-y-3 p-6">
                {existingScore.criteria_scores?.map((cs: any, i: number) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-gray-800 bg-black/40 p-4">
                    <div>
                      <p className="font-body text-sm font-semibold text-white">{cs.title}</p>
                      <p className="mt-0.5 font-mono text-xs text-gray-500">Weight {cs.weight}%</p>
                    </div>
                    <p className="font-mono text-lg font-bold tabular-nums text-white">
                      {cs.score}
                      <span className="text-sm font-normal text-gray-500"> / {cs.max_score}</span>
                    </p>
                  </div>
                ))}
              </div>

              {existingScore.feedback && (
                <div className="px-6 pb-6">
                  <div className="rounded-lg border border-gray-800 bg-black/40 p-4">
                    <p className="mb-2 font-body text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                      Judge Feedback
                    </p>
                    <p className="font-body text-sm leading-relaxed text-gray-300">
                      {existingScore.feedback}
                    </p>
                  </div>
                </div>
              )}

              <div className="border-t border-gray-800 bg-black/40 p-6">
                <Button
                  variant="secondary"
                  className="w-full border-gold/40 text-gold-light hover:bg-gold/10"
                  onClick={() => setShowCorrectionModal(true)}
                >
                  Request Score Correction
                </Button>
              </div>
            </Card>
          ) : (
            /* Active Scoring Form */
            <Card padding="none" variant="elevated" className="flex flex-col overflow-hidden border-gray-800 bg-gray-900/80 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-gray-800 bg-black/40 p-6">
                <div>
                  <h2 className="font-display text-lg font-semibold text-white">
                    Rubric Evaluation
                  </h2>
                  <p className="mt-0.5 font-body text-sm text-gray-500">
                    Scores are immutable once submitted
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-body text-[10px] font-semibold uppercase tracking-wider text-gray-500">Weighted Total</p>
                  <p className="font-mono text-2xl font-bold tabular-nums text-gold-light">
                    {calculateWeightedTotal()}
                    <span className="text-sm font-normal text-gray-500"> / 100</span>
                  </p>
                </div>
              </div>

              <form onSubmit={handleScoreSubmit} className="flex flex-1 flex-col">
                <div className="space-y-6 overflow-y-auto p-6">
                  {criteria.map((c) => {
                    const key = c.id || c.title;
                    const val = scores[key] ?? Math.floor(c.max_score / 2);
                    const pct = (val / c.max_score) * 100;

                    return (
                      <div key={key} className="space-y-3 rounded-lg border border-gray-800 bg-black/40 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <label className="font-body text-sm font-semibold text-white">
                              {c.title}
                            </label>
                            <p className="mt-1 font-body text-xs leading-relaxed text-gray-500">
                              {c.description}
                            </p>
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <p className="font-mono text-xs text-gray-500">Weight {c.weight}%</p>
                            <p className="mt-0.5 font-mono text-lg font-bold tabular-nums text-white">
                              {val}
                              <span className="text-sm font-normal text-gray-500"> / {c.max_score}</span>
                            </p>
                          </div>
                        </div>

                        <div className="relative h-2 w-full overflow-hidden rounded-full border border-gray-800 bg-gray-900">
                          <div className="absolute inset-y-0 left-0 rounded-full bg-gold" style={{ width: `${pct}%` }} />
                          <input
                            type="range"
                            min={0}
                            max={c.max_score}
                            step={1}
                            value={val}
                            onChange={(e) =>
                              setScores({ ...scores, [key]: Number(e.target.value) })
                            }
                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                            aria-label={c.title}
                          />
                        </div>

                        <div className="flex justify-between px-0.5">
                          {Array.from({ length: c.max_score + 1 }, (_, i) => i)
                            .filter((t) => t % 2 === 0 || t === c.max_score)
                            .map((tick) => (
                              <span key={tick} className="select-none font-mono text-[10px] text-gray-600">
                                {tick}
                              </span>
                            ))}
                        </div>
                      </div>
                    );
                  })}

                  <div>
                    <label className="mb-2 block font-body text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                      Qualitative Feedback
                    </label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Provide constructive feedback for the team…"
                      rows={4}
                      className={clsx(
                        "min-h-[100px] w-full resize-y rounded-lg border bg-black p-3",
                        "font-body text-sm text-white placeholder:text-gray-600",
                        "border-gray-700 hover:border-gray-500",
                        "focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30",
                        "transition-shadow duration-200"
                      )}
                    />
                  </div>
                </div>

                <div className="mt-auto border-t border-gray-800 bg-black/40 p-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gold px-6 font-body text-sm font-bold uppercase tracking-wider text-black transition-all duration-200 hover:-translate-y-px hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {submitting ? "Submitting…" : "Submit Score (Immutable)"}
                    {!submitting && <SubmitIcon />}
                  </button>
                </div>
              </form>
            </Card>
          )}
        </div>
      </div>

      {/* Correction Modal */}
      {showCorrectionModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="correction-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCorrectionModal(false);
          }}
        >
          <Card padding="none" variant="elevated" className="w-full max-w-lg overflow-hidden border-gray-700 bg-gray-900">
            <div className="border-b border-gray-800 p-6">
              <h3 id="correction-title" className="font-display text-lg font-semibold text-white">
                Request Score Correction
              </h3>
              <p className="mt-2 font-body text-sm text-gray-400">
                Submitted scores are immutable. This creates a pending review for organizers.
              </p>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <label className="mb-2 block font-body text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Reason for Correction *
                </label>
                <textarea
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain why this score needs adjustment…"
                  className={clsx(
                    "w-full resize-y rounded-lg border bg-black p-3",
                    "font-body text-sm text-white placeholder:text-gray-600",
                    "border-gray-700 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
                  )}
                />
                <p className="mt-1.5 font-body text-xs text-gray-500">
                  Minimum 10 characters required.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-800 bg-black/40 p-6">
              <Button variant="secondary" onClick={() => setShowCorrectionModal(false)}>
                Cancel
              </Button>
              <button
                type="button"
                onClick={handleCorrectionRequest}
                disabled={correctionSubmitting || reason.trim().length < 10}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-gold px-4 font-body text-sm font-bold uppercase tracking-wider text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gold-light"
              >
                {correctionSubmitting ? "Submitting…" : "Submit Correction Request"}
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function BackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M8.75 10.5L5.25 7l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4.5v4.5M8 11.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SubmitIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}