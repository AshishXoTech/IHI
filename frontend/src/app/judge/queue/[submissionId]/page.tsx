"use client";

import React, {
    useEffect,
    useState,
    useCallback,
    useMemo,
    use,
    useRef,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button, Card, StatusBadge, Input } from "@/components/ui";
import AIBriefingPanel from "@/components/dashboard/AIBriefingPanel";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { judgeNavigation } from "@/components/layout/navigation";
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

export default function JudgeScoringScreen({
    params,
}: {
    params: Promise<{ submissionId: string }>;
}) {
    const { submissionId } = use(params);
    const router = useRouter();
    const supabase = useMemo(() => createClient(), []);
    const { isReducedMotion } = useMotion();

    // Refs for GSAP pin
    const containerRef = useRef<HTMLDivElement>(null);
    const leftPanelRef = useRef<HTMLDivElement>(null);
    const rightPanelRef = useRef<HTMLDivElement>(null);

    // UI State
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Data
    const [submission, setSubmission] = useState<{
        id: string;
        title: string;
        description: string;
        repo_url: string | null;
        demo_url: string | null;
        team_name: string;
    } | null>(null);
    const [criteria, setCriteria] = useState<RubricCriterion[]>(
        DEFAULT_FALLBACK_CRITERIA,
    );
    const [scores, setScores] = useState<Record<string, number>>({});
    const [feedback, setFeedback] = useState("");
    const [existingScore, setExistingScore] = useState<any | null>(null);

    // Correction Modal
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
            // 1. Check if already scored
            const scoreRes = await fetch(
                `/api/judging/score?submissionId=${submissionId}`,
            );
            if (scoreRes.ok) {
                const scoreJson = await scoreRes.json();
                if (scoreJson.isScored) {
                    setExistingScore(scoreJson.data);
                }
            }

            // 2. Load submission details
            const { data: subData } = await supabase
                .from("submissions")
                .select(
                    "id, title, description, repo_url, demo_url, fields, team_id, teams(name)",
                )
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

            // 3. Init score map
            const initialScores: Record<string, number> = {};
            DEFAULT_FALLBACK_CRITERIA.forEach((c) => {
                initialScores[c.id || c.title] = Math.floor(c.max_score / 2);
            });
            setScores(initialScores);
        } catch {
            setErrorMessage("Error loading scoring workspace.");
        } finally {
            setLoading(false);
        }
    }, [submissionId, supabase]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    /* ========================================================================
     GSAP PIN (Desktop only)
     ======================================================================== */
    useEffect(() => {
        if (isReducedMotion || loading || existingScore) return;
        if (
            !containerRef.current ||
            !rightPanelRef.current ||
            !leftPanelRef.current
        )
            return;

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
     CALCULATIONS & HANDLERS
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

            setSuccessMessage(
                "Score submitted successfully. Viewing locked summary.",
            );
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
            // Replace with real API when ready
            await new Promise((r) => setTimeout(r, 800));
            setShowCorrectionModal(false);
            router.push("/judge/queue");
        } finally {
            setCorrectionSubmitting(false);
        }
    };

    /* ========================================================================
     LOADING STATE
     ======================================================================== */
    if (loading) {
        return (
            <DashboardShell
                role="judge"
                userName="Dr. Priya Rao"
                userEmail="priya@ihi.io"
                eventName="Evaluation Portal"
                navigation={judgeNavigation}
            >
                <div className="flex min-h-[60vh] items-center justify-center">
                    <div className="text-center space-y-3">
                        <div className="mx-auto h-8 w-8 rounded-full border-2 border-[var(--border-default)] border-t-[var(--accent)] animate-spin" />
                        <p className="text-body-sm text-[var(--text-muted)]">
                            Loading scoring workspace…
                        </p>
                    </div>
                </div>
            </DashboardShell>
        );
    }

    /* ========================================================================
     MAIN RENDER
     ======================================================================== */
    return (
        <DashboardShell
            role="judge"
            userName="Dr. Priya Rao"
            userEmail="priya@ihi.io"
            eventName="Evaluation Portal"
            navigation={judgeNavigation}
        >
            <div data-register="tower" className="min-h-full">
                <div className="max-w-[1400px] mx-auto px-6 py-8 lg:px-10 space-y-8">
                    {/* Header */}
                    <PageHeader
                        breadcrumbs={[
                            { label: "Queue", href: "/judge/queue" },
                            { label: submission?.title || "Submission" },
                        ]}
                        title={submission?.title || "Project Submission"}
                        description={`Team: ${submission?.team_name || "—"}`}
                        actions={
                            <div className="flex items-center gap-3">
                                <StatusBadge
                                    status={
                                        existingScore ? "good" : "attention"
                                    }
                                    label={
                                        existingScore
                                            ? "Scored & Locked"
                                            : "Scoring Active"
                                    }
                                    pulse={!existingScore}
                                />
                                <Link href="/judge/queue">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        icon={<BackIcon />}
                                    >
                                        Back to Queue
                                    </Button>
                                </Link>
                            </div>
                        }
                    />

                    {/* Alerts */}
                    {errorMessage && (
                        <Card
                            padding="sm"
                            className="border-[var(--destructive)]/40 bg-[var(--destructive-subtle)]"
                        >
                            <p className="text-body-sm font-medium text-[var(--destructive)] flex items-center gap-2">
                                <AlertIcon /> {errorMessage}
                            </p>
                        </Card>
                    )}
                    {successMessage && (
                        <Card
                            padding="sm"
                            className="border-[var(--signal-good)]/40 bg-[var(--signal-good-bg)]"
                        >
                            <p className="text-body-sm font-medium text-[var(--signal-good)] flex items-center gap-2">
                                <CheckIcon /> {successMessage}
                            </p>
                        </Card>
                    )}

                    {/* ================================================================
              SPLIT-SCREEN LAYOUT
              ================================================================ */}
                    <div
                        ref={containerRef}
                        className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start relative"
                    >
                        {/* ---------- LEFT: PROJECT + AI ---------- */}
                        <div
                            ref={leftPanelRef}
                            className="lg:col-span-5 xl:col-span-6 space-y-6"
                        >
                            {/* Project Details */}
                            <Card padding="md" variant="default">
                                <h2 className="text-heading-sm font-display font-semibold text-[var(--text-primary)] mb-4">
                                    Project Details
                                </h2>
                                <p className="text-body-md text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                                    {submission?.description}
                                </p>

                                <div className="mt-6 pt-5 border-t border-[var(--border-default)] space-y-4">
                                    <div>
                                        <p className="text-label text-[var(--text-muted)] mb-1.5">
                                            Repository
                                        </p>
                                        {submission?.repo_url ? (
                                            <a
                                                href={submission.repo_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="font-mono text-body-sm text-[var(--accent-text)] hover:underline break-all"
                                            >
                                                {submission.repo_url} ↗
                                            </a>
                                        ) : (
                                            <span className="text-body-sm text-[var(--text-muted)] italic">
                                                Not provided
                                            </span>
                                        )}
                                    </div>
                                    {submission?.demo_url && (
                                        <div>
                                            <p className="text-label text-[var(--text-muted)] mb-1.5">
                                                Live Demo
                                            </p>
                                            <a
                                                href={submission.demo_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="font-mono text-body-sm text-[var(--accent-text)] hover:underline break-all"
                                            >
                                                {submission.demo_url} ↗
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </Card>

                            {/* AI Briefing */}
                            <AIBriefingPanel
                                submissionId={submissionId}
                                projectTitle={submission?.title || "Project Submission"}
                                onApplyScores={(aiScores: Record<string, number>) => {
                                    setScores((prev) => {
                                        const updated = { ...prev };
                                        criteria.forEach((c) => {
                                            const key = c.id || c.title;
                                            if (aiScores[key] !== undefined) {
                                                updated[key] = aiScores[key];
                                            } else if (
                                                aiScores[c.title] !== undefined
                                            ) {
                                                updated[key] =
                                                    aiScores[c.title];
                                            }
                                        });
                                        return updated;
                                    });
                                }}
                            />
                        </div>

                        {/* ---------- RIGHT: RUBRIC (pinned on desktop) ---------- */}
                        <div
                            ref={rightPanelRef}
                            className="lg:col-span-7 xl:col-span-6 w-full"
                        >
                            {existingScore ? (
                                /* ========== READ-ONLY SUMMARY ========== */
                                <Card
                                    padding="none"
                                    variant="elevated"
                                    className="overflow-hidden"
                                >
                                    <div className="p-6 border-b border-[var(--border-default)] bg-[var(--surface-bg)]/60 flex items-center justify-between">
                                        <div>
                                            <h2 className="text-heading-sm font-display font-semibold text-[var(--text-primary)]">
                                                Submitted Score Summary
                                            </h2>
                                            <p className="text-body-sm text-[var(--text-muted)] mt-1">
                                                {new Date(
                                                    existingScore.created_at ||
                                                        Date.now(),
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-label text-[var(--text-muted)]">
                                                Total
                                            </p>
                                            <p className="font-mono text-heading-md font-bold text-[var(--signal-good)] tabular-nums">
                                                {existingScore.total_score}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-3">
                                        {existingScore.criteria_scores?.map(
                                            (cs: any, i: number) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-bg)] p-4"
                                                >
                                                    <div>
                                                        <p className="text-body-sm font-semibold text-[var(--text-primary)]">
                                                            {cs.title}
                                                        </p>
                                                        <p className="text-xs font-mono text-[var(--text-muted)] mt-0.5">
                                                            Weight {cs.weight}%
                                                        </p>
                                                    </div>
                                                    <p className="font-mono text-body-lg font-bold text-[var(--text-primary)] tabular-nums">
                                                        {cs.score}
                                                        <span className="text-body-sm text-[var(--text-muted)] font-normal">
                                                            {" "}
                                                            / {cs.max_score}
                                                        </span>
                                                    </p>
                                                </div>
                                            ),
                                        )}
                                    </div>

                                    {existingScore.feedback && (
                                        <div className="px-6 pb-6">
                                            <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-bg)] p-4">
                                                <p className="text-label text-[var(--text-muted)] mb-2">
                                                    Judge Feedback
                                                </p>
                                                <p className="text-body-sm text-[var(--text-secondary)] leading-relaxed">
                                                    {existingScore.feedback}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-6 border-t border-[var(--border-default)] bg-[var(--surface-bg)]">
                                        <Button
                                            variant="secondary"
                                            className="w-full border-[var(--signal-attention)]/40 text-[var(--signal-attention)] hover:bg-[var(--signal-attention-bg)]"
                                            onClick={() =>
                                                setShowCorrectionModal(true)
                                            }
                                        >
                                            Request Score Correction
                                        </Button>
                                    </div>
                                </Card>
                            ) : (
                                /* ========== ACTIVE SCORING FORM ========== */
                                <Card
                                    padding="none"
                                    variant="elevated"
                                    className="overflow-hidden flex flex-col"
                                >
                                    {/* Header with live total */}
                                    <div className="p-6 border-b border-[var(--border-default)] bg-[var(--surface-bg)]/60 flex items-center justify-between">
                                        <div>
                                            <h2 className="text-heading-sm font-display font-semibold text-[var(--text-primary)]">
                                                Rubric Evaluation
                                            </h2>
                                            <p className="text-body-sm text-[var(--text-muted)] mt-0.5">
                                                Scores are immutable once
                                                submitted
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-label text-[var(--text-muted)]">
                                                Weighted Total
                                            </p>
                                            <p className="font-mono text-heading-md font-bold text-[var(--accent-text)] tabular-nums">
                                                {calculateWeightedTotal()}
                                                <span className="text-body-sm text-[var(--text-muted)] font-normal">
                                                    {" "}
                                                    / 100
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    <form
                                        onSubmit={handleScoreSubmit}
                                        className="flex flex-col flex-1"
                                    >
                                        <div className="p-6 space-y-6 overflow-y-auto">
                                            {criteria.map((c) => {
                                                const key = c.id || c.title;
                                                const val =
                                                    scores[key] ??
                                                    Math.floor(c.max_score / 2);
                                                const pct =
                                                    (val / c.max_score) * 100;

                                                return (
                                                    <div
                                                        key={key}
                                                        className="space-y-3 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-bg)] p-5"
                                                    >
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="min-w-0">
                                                                <label className="text-body-sm font-semibold text-[var(--text-primary)]">
                                                                    {c.title}
                                                                </label>
                                                                <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                                                                    {
                                                                        c.description
                                                                    }
                                                                </p>
                                                            </div>
                                                            <div className="text-right flex-shrink-0">
                                                                <p className="text-xs font-mono text-[var(--text-muted)]">
                                                                    Weight{" "}
                                                                    {c.weight}%
                                                                </p>
                                                                <p className="font-mono text-body-lg font-bold text-[var(--text-primary)] tabular-nums mt-0.5">
                                                                    {val}
                                                                    <span className="text-body-sm text-[var(--text-muted)] font-normal">
                                                                        {" "}
                                                                        /{" "}
                                                                        {
                                                                            c.max_score
                                                                        }
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Custom range track */}
                                                        <div className="relative h-2 w-full rounded-full bg-[var(--surface)] border border-[var(--border-default)] overflow-hidden">
                                                            <div
                                                                className="absolute inset-y-0 left-0 rounded-full bg-[var(--accent)] transition-all duration-fast"
                                                                style={{
                                                                    width: `${pct}%`,
                                                                }}
                                                            />
                                                            <input
                                                                type="range"
                                                                min={0}
                                                                max={
                                                                    c.max_score
                                                                }
                                                                step={1}
                                                                value={val}
                                                                onChange={(e) =>
                                                                    setScores({
                                                                        ...scores,
                                                                        [key]: Number(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        ),
                                                                    })
                                                                }
                                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                                aria-label={
                                                                    c.title
                                                                }
                                                            />
                                                        </div>

                                                        <div className="flex justify-between px-0.5">
                                                            {Array.from(
                                                                {
                                                                    length:
                                                                        c.max_score +
                                                                        1,
                                                                },
                                                                (_, i) => i,
                                                            )
                                                                .filter(
                                                                    (t) =>
                                                                        t %
                                                                            2 ===
                                                                            0 ||
                                                                        t ===
                                                                            c.max_score,
                                                                )
                                                                .map((tick) => (
                                                                    <span
                                                                        key={
                                                                            tick
                                                                        }
                                                                        className="text-[10px] font-mono text-[var(--text-muted)] select-none"
                                                                    >
                                                                        {tick}
                                                                    </span>
                                                                ))}
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {/* Feedback */}
                                            <div>
                                                <label className="block text-label text-[var(--text-muted)] mb-2">
                                                    Qualitative Feedback
                                                </label>
                                                <textarea
                                                    value={feedback}
                                                    onChange={(e) =>
                                                        setFeedback(
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Provide constructive feedback for the team…"
                                                    rows={4}
                                                    className={clsx(
                                                        "w-full rounded-[var(--radius-md)] border bg-[var(--surface)] p-3",
                                                        "text-body-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
                                                        "border-[var(--border-default)] hover:border-[var(--border-strong)]",
                                                        "focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)]",
                                                        "transition-all duration-normal resize-y min-h-[100px]",
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <div className="p-6 border-t border-[var(--border-default)] bg-[var(--surface-bg)] mt-auto">
                                            <Button
                                                type="submit"
                                                size="lg"
                                                className="w-full"
                                                loading={submitting}
                                                icon={<SubmitIcon />}
                                                iconPosition="right"
                                            >
                                                Submit Score (Immutable)
                                            </Button>
                                        </div>
                                    </form>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ================================================================
          CORRECTION REQUEST MODAL
          ================================================================ */}
            {showCorrectionModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="correction-title"
                    onClick={(e) => {
                        if (e.target === e.currentTarget)
                            setShowCorrectionModal(false);
                    }}
                >
                    <Card
                        padding="none"
                        variant="elevated"
                        className="w-full max-w-lg animate-scale-in overflow-hidden"
                    >
                        <div className="p-6 border-b border-[var(--border-default)]">
                            <h3
                                id="correction-title"
                                className="text-heading-sm font-display font-semibold text-[var(--text-primary)]"
                            >
                                Request Score Correction
                            </h3>
                            <p className="text-body-sm text-[var(--text-secondary)] mt-2">
                                Submitted scores are immutable. This creates a
                                pending review for organizers.
                            </p>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-label text-[var(--text-muted)] mb-2">
                                    Reason for Correction *
                                </label>
                                <textarea
                                    rows={4}
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Explain why this score needs adjustment…"
                                    className={clsx(
                                        "w-full rounded-[var(--radius-md)] border bg-[var(--surface)] p-3",
                                        "text-body-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
                                        "border-[var(--border-default)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)]",
                                        "transition-all duration-normal resize-y",
                                    )}
                                />
                                <p className="text-xs text-[var(--text-muted)] mt-1.5">
                                    Minimum 10 characters required.
                                </p>
                            </div>
                        </div>

                        <div className="p-6 border-t border-[var(--border-default)] bg-[var(--surface-bg)] flex justify-end gap-3">
                            <Button
                                variant="secondary"
                                onClick={() => setShowCorrectionModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCorrectionRequest}
                                loading={correctionSubmitting}
                                disabled={reason.trim().length < 10}
                                className="bg-[var(--signal-attention)] hover:opacity-90 text-white border-transparent"
                            >
                                Submit Correction Request
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </DashboardShell>
    );
}

/* ==========================================================================
   INLINE ICONS
   ========================================================================== */

function BackIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
                d="M8.75 10.5L5.25 7l3.5-3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function AlertIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="flex-shrink-0"
        >
            <circle
                cx="8"
                cy="8"
                r="7"
                stroke="currentColor"
                strokeWidth="1.5"
            />
            <path
                d="M8 4.5v4.5M8 11.5h.01"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="flex-shrink-0"
        >
            <path
                d="M3.5 8.5l3 3 6-6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function SubmitIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}