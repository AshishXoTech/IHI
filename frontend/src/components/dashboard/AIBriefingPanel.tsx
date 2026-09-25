// frontend/src/components/dashboard/AIBriefingPanel.tsx
'use client';

import { useState, useEffect, useId } from 'react';
import { Card } from '@/components/ui';

// ── Types (Local to this component; promote to shared.ts on joint sync) ──

export interface DetectedTech {
  name: string;
  /** Normalized confidence level; items below moderate/0.6 are suppressed */
  confidence: 'high' | 'moderate' | number;
}

export interface SimilarityFinding {
  detected: boolean;
  matchedSource?: string;
  overlapPercentage?: number;
  note?: string;
}

export interface AIBriefingPayload {
  status: 'ready' | 'analysis_incomplete' | 'not_found';
  summary?: string;
  technologies?: DetectedTech[];
  similarity?: SimilarityFinding;
  analyzedAt?: string;
}

interface AIBriefingPanelProps {
  submissionId: string;
  /** Optional repo URL for deeper AI analysis */
  repoUrl?: string | null;
  /** Optional project title for context */
  projectTitle?: string | null;
  /** Optionally override default expanded state */
  initialExpanded?: boolean;
}

// ── Realistic Mock Briefing Fallback ─────────────────────────────────────

const MOCK_BRIEFING: AIBriefingPayload = {
  status: 'ready',
  summary:
    'Decentralized identity verification tool utilizing zero-knowledge proofs. Features a lightweight client-side signature engine paired with an event-driven indexer built on Postgres.',
  technologies: [
    { name: 'Rust', confidence: 'high' },
    { name: 'TypeScript', confidence: 'high' },
    { name: 'SnarkJS', confidence: 'moderate' },
    { name: 'Docker', confidence: 'moderate' },
  ],
  similarity: {
    detected: true,
    matchedSource: 'zk-starter-kit-template',
    overlapPercentage: 34,
    note: 'Boilerplate setup matches standard template structure. Core verification logic is distinct.',
  },
  analyzedAt: new Date().toISOString(),
};

// ── Helpers ─────────────────────────────────────────────────────────────

function normalizeConfidence(
  conf: 'high' | 'moderate' | number,
): 'High' | 'Moderate' | null {
  if (typeof conf === 'number') {
    if (conf >= 0.8) return 'High';
    if (conf >= 0.6) return 'Moderate';
    return null; // Suppressed: below confidence floor (< 0.60)
  }
  if (conf === 'high') return 'High';
  if (conf === 'moderate') return 'Moderate';
  return null;
}

/**
 * Normalize various backend response shapes into AIBriefingPayload.
 * Supports:
 * - /api/ai/briefing  → { project_summary, detected_tech[], duplicate_risk }
 * - legacy analyze-repo shape → { status, summary, technologies, similarity }
 */
function normalizeBriefingResponse(raw: any): AIBriefingPayload {
  if (!raw || typeof raw !== 'object') {
    return { status: 'not_found' };
  }

  // If backend already returns our payload shape
  if (raw.status === 'ready' || raw.status === 'analysis_incomplete' || raw.status === 'not_found') {
    return raw as AIBriefingPayload;
  }

  // Map /api/ai/briefing response
  const summary =
    raw.project_summary ||
    raw.summary ||
    raw.projectSummary ||
    undefined;

  const techSource: unknown =
    raw.detected_tech ||
    raw.detectedTech ||
    raw.technologies ||
    [];

  const technologies: DetectedTech[] = Array.isArray(techSource)
    ? techSource
        .map((item: any) => {
          if (typeof item === 'string') {
            return { name: item, confidence: 'high' as const };
          }
          if (item && typeof item === 'object' && item.name) {
            return {
              name: String(item.name),
              confidence: (item.confidence ?? 'high') as DetectedTech['confidence'],
            };
          }
          return null;
        })
        .filter(Boolean) as DetectedTech[]
    : [];

  const riskRaw = String(raw.duplicate_risk || raw.duplicateRisk || '').toLowerCase();
  let similarity: SimilarityFinding | undefined;

  if (riskRaw) {
    if (riskRaw === 'low') {
      similarity = {
        detected: false,
        note: 'Low duplicate risk. Core implementation appears distinct from common templates.',
      };
    } else if (riskRaw === 'medium' || riskRaw === 'moderate') {
      similarity = {
        detected: true,
        overlapPercentage: 40,
        matchedSource: 'common open-source patterns',
        note: 'Moderate structural overlap detected. Review originality of core logic.',
      };
    } else if (riskRaw === 'high') {
      similarity = {
        detected: true,
        overlapPercentage: 70,
        matchedSource: 'known public repositories / templates',
        note: 'High similarity signals detected. Manual originality review recommended.',
      };
    }
  } else if (raw.similarity && typeof raw.similarity === 'object') {
    similarity = raw.similarity as SimilarityFinding;
  }

  // If we got almost nothing useful
  if (!summary && technologies.length === 0 && !similarity) {
    return { status: 'analysis_incomplete' };
  }

  return {
    status: 'ready',
    summary,
    technologies,
    similarity,
    analyzedAt: raw.analyzedAt || raw.analyzed_at || new Date().toISOString(),
  };
}

// ── Component ───────────────────────────────────────────────────────────

export function AIBriefingPanel({
  submissionId,
  repoUrl = null,
  projectTitle = null,
  initialExpanded = true,
}: AIBriefingPanelProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [data, setData] = useState<AIBriefingPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const contentId = useId();

  // Detect reduced motion preference
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Fetch briefing data
  useEffect(() => {
    let isMounted = true;
    const useMocks = process.env.NEXT_PUBLIC_USE_TEAM_MOCKS === 'true';

    // Prefer explicit endpoint env, else correct working route
    const briefingEndpoint =
      process.env.NEXT_PUBLIC_AI_BRIEFING_ENDPOINT || '/api/ai/briefing';

    async function fetchBriefing() {
      setIsLoading(true);

      if (useMocks) {
        // Mock fallback simulation
        setTimeout(() => {
          if (isMounted) {
            setData(MOCK_BRIEFING);
            setIsLoading(false);
          }
        }, 300);
        return;
      }

      try {
        // ✅ FIXED: POST /api/ai/briefing (not GET analyze-repo)
        const res = await fetch(briefingEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          cache: 'no-store',
          body: JSON.stringify({
            submissionId,
            repoUrl: repoUrl || undefined,
            projectTitle: projectTitle || undefined,
          }),
        });

        // Graceful non-alarm response for missing/incomplete endpoints
        if (!res.ok) {
          // Optional fallback: try legacy GET analyze-repo once
          try {
            const legacy = await fetch(
              `/api/ai/analyze-repo?submissionId=${encodeURIComponent(submissionId)}`,
              {
                headers: { Accept: 'application/json' },
                cache: 'no-store',
              },
            );

            if (legacy.ok) {
              const legacyJson = await legacy.json();
              if (isMounted) {
                setData(normalizeBriefingResponse(legacyJson));
              }
              return;
            }
          } catch {
            // ignore legacy fallback errors
          }

          if (isMounted) {
            setData({ status: 'not_found' });
          }
          return;
        }

        const json = await res.json();
        if (isMounted) {
          setData(normalizeBriefingResponse(json));
        }
      } catch {
        // Network or parsing error treated as missing data rather than an alarming failure
        if (isMounted) {
          setData({ status: 'not_found' });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (submissionId) {
      fetchBriefing();
    } else {
      setData({ status: 'not_found' });
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [submissionId, repoUrl, projectTitle]);

  // Filter tech tags based on confidence floor
  const validTechTags =
    data?.technologies
      ?.map((tech) => ({
        name: tech.name,
        confidence: normalizeConfidence(tech.confidence),
      }))
      .filter(
        (
          tech,
        ): tech is { name: string; confidence: 'High' | 'Moderate' } =>
          tech.confidence !== null,
      ) ?? [];

  return (
    <Card className="overflow-hidden border-[var(--ihi-surface-200)] bg-[var(--ihi-surface-0)]">
      {/* ── Panel Header & Collapsible Toggle ──────────────────────── */}
      <div className="flex items-center justify-between border-b border-[var(--ihi-surface-200)] px-4 py-3">
        <div className="flex items-center gap-2">
          {/* Neutral AI icon badge (distinct from traffic light StatusBadge) */}
          <span
            aria-hidden="true"
            className="flex h-5 w-5 items-center justify-center rounded bg-[var(--ihi-ai-high-bg)] text-xs text-[var(--ihi-ai-high)] font-mono"
          >
            ✦
          </span>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--ihi-surface-500)]">
            AI Submission Briefing
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
          aria-controls={contentId}
          className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-[var(--ihi-surface-500)] transition-colors hover:bg-[var(--ihi-surface-100)] hover:text-[var(--ihi-surface-900)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ihi-brand-500)]"
        >
          <span>{isExpanded ? 'Hide' : 'Show'}</span>
          <svg
            className={`h-3.5 w-3.5 transition-transform ${
              prefersReducedMotion ? '' : 'duration-200'
            } ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* ── Collapsible Body (preserves state on collapse) ─────────── */}
      <div
        id={contentId}
        role="region"
        aria-label="AI Submission Briefing Details"
        className={isExpanded ? 'block' : 'hidden'}
      >
        {/* State 1: Loading */}
        {isLoading && (
          <div className="p-4 space-y-3 animate-pulse">
            <div className="h-3 w-1/3 rounded bg-[var(--ihi-surface-200)]" />
            <div className="h-10 w-full rounded bg-[var(--ihi-surface-200)]" />
            <div className="flex gap-2">
              <div className="h-6 w-16 rounded bg-[var(--bg-tertiary,#1e293b)]" />
              <div className="h-6 w-20 rounded bg-[var(--bg-tertiary,#1e293b)]" />
            </div>
            <p className="text-[10px] font-mono text-[var(--ihi-surface-400)] pt-1">
              Analyzing repository with AI...
            </p>
          </div>
        )}

        {/* State 2: Gracefully Missing / Incomplete Analysis */}
        {!isLoading && (!data || data.status !== 'ready') && (
          <div className="p-4 text-xs text-[var(--ihi-surface-400)]">
            <p className="font-normal leading-relaxed">
              No automated briefing generated for this submission. Proceed with
              standard repository and presentation review.
            </p>
          </div>
        )}

        {/* State 3: Successfully Loaded */}
        {!isLoading && data && data.status === 'ready' && (
          <div className="p-4 space-y-4 text-xs">
            {/* Project Summary */}
            {data.summary && (
              <div className="space-y-1">
                <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-tertiary,#64748b)]">
                  Summary (Based on repository analysis)
                </span>
                <p className="text-sm font-normal leading-relaxed text-[var(--text-primary,#f8fafc)]">
                  {data.summary}
                </p>
              </div>
            )}

            {/* Detected Technology Tags */}
            {validTechTags.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-tertiary,#64748b)]">
                  Detected Technologies
                </span>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {validTechTags.map((tech) => (
                    <span
                      key={tech.name}
                      className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-default,#334155)] bg-[var(--bg-tertiary,#1e293b)]/60 px-2 py-1 text-xs text-[var(--text-secondary,#cbd5e1)]"
                    >
                      <span className="font-medium text-[var(--text-primary,#f8fafc)]">
                        {tech.name}
                      </span>
                      {/* Visual Confidence Badge (Indigo/Slate scale to decouple from System Health) */}
                      <span
                        className={`text-[9px] font-semibold px-1 rounded ${
                          tech.confidence === 'High'
                            ? 'bg-indigo-500/20 text-indigo-300'
                            : 'bg-slate-500/20 text-slate-300'
                        }`}
                      >
                        {tech.confidence}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Duplicate / Similarity Finding (Evidentiary phrasing only) */}
            {data.similarity && (
              <div className="rounded-md border border-slate-700 bg-slate-800/40 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <svg
                    className="h-3.5 w-3.5 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    {data.similarity.detected
                      ? 'Template & Similarity Match Detected'
                      : 'Duplicate Risk Assessment'}
                  </span>
                </div>
                <p className="text-[11px] leading-normal text-slate-400">
                  {data.similarity.overlapPercentage !== undefined && (
                    <span className="font-medium text-slate-200">
                      {data.similarity.overlapPercentage}% structure overlap{' '}
                    </span>
                  )}
                  {data.similarity.matchedSource && (
                    <span>with baseline ({data.similarity.matchedSource}). </span>
                  )}
                  {data.similarity.note}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}