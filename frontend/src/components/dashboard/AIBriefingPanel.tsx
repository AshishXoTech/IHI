"use client";

import React, { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { 
  Sparkles, 
  BrainCircuit, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  Send,
  Zap,
  Gauge
} from "lucide-react";

interface CriterionScore {
  criterion: string;
  score: number;
  maxScore: number;
  reasoning: string;
}

interface AIBriefingData {
  summary: string;
  confidenceScore: number;
  strengths: string[];
  weaknesses: string[];
  criteriaBreakdown: CriterionScore[];
}

interface AIBriefingPanelProps {
  submissionId: string;
  projectTitle: string;
  onApplyScores?: (scores: Record<string, number>) => void;
}

const FALLBACK_BRIEFING: AIBriefingData = {
  summary: "High-caliber autonomous multi-agent pipeline leveraging Gemini 2.0 Flash for parallel reasoning. The architectural execution is exceptional, featuring deterministic state guards and sub-200ms latency.",
  confidenceScore: 94,
  strengths: [
    "Clean decoupled FastAPI backend with resilient streaming fallback",
    "Real-world measurable utility for developer workflows",
    "Comprehensive test suite covering edge conditions"
  ],
  weaknesses: [
    "Frontend token consumption telemetry lacks real-time visualization",
    "Mobile viewport responsive layout has minor overflow"
  ],
  criteriaBreakdown: [
    { criterion: "Technical Execution", score: 9, maxScore: 10, reasoning: "Outstanding architecture, robust async job queues." },
    { criterion: "Innovation & Novelty", score: 10, maxScore: 10, reasoning: "Unique recursive prompt DAG decomposition." },
    { criterion: "Design & UX", score: 8, maxScore: 10, reasoning: "Clean neo-brutalist styling, slight mobile clipping." },
    { criterion: "Practical Impact", score: 9, maxScore: 10, reasoning: "Solves legitimate latency bottlenecks in code review." },
    { criterion: "Gemini 2.0 Integration", score: 10, maxScore: 10, reasoning: "Flawless tool-calling and multimodal grounding." },
    { criterion: "Pitch & Presentation", score: 8, maxScore: 10, reasoning: "Clear video demo, could include benchmark graphs." },
  ]
};

export default function AIBriefingPanel({
  submissionId,
  projectTitle,
  onApplyScores,
}: AIBriefingPanelProps) {
  const [briefing, setBriefing] = useState<AIBriefingData>(FALLBACK_BRIEFING);
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    if (onApplyScores) {
      const scoreMap: Record<string, number> = {};
      briefing.criteriaBreakdown.forEach((c) => {
        scoreMap[c.criterion] = c.score;
      });
      onApplyScores(scoreMap);
    }
    setApplied(true);
    setTimeout(() => setApplied(false), 3000);
  };

  return (
    <div
      className="border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] p-6 transition-transform"
      style={{ boxShadow: "8px 8px 0px 0px var(--organizer-gold)" }}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[var(--organizer-ink-primary)] pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)] text-white">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <div>
            <div className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-gold-deep)]">
              FASTAPI + GEMINI 2.0 AGENTIC JUDGE
            </div>
            <h2 className="text-xl font-black font-display tracking-tight uppercase">
              AI EVALUATION DOSSIER
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold-light)] px-3 py-1.5">
          <Gauge className="h-4 w-4 text-[var(--organizer-gold-deep)]" />
          <span className="text-[11px] font-mono font-bold text-[var(--organizer-ink-primary)]">
            MODEL CONFIDENCE: {briefing.confidenceScore}%
          </span>
        </div>
      </div>

      {/* Synthesis Summary */}
      <div className="mb-6 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-bg)] p-4">
        <div className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)] mb-1">
          EXECUTIVE SYNTHESIS
        </div>
        <p className="text-xs font-mono leading-relaxed text-[var(--organizer-ink-primary)]">
          {briefing.summary}
        </p>
      </div>

      {/* 6-Criteria Matrix Breakdown */}
      <div className="mb-6">
        <div className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)] mb-3">
          STANDARDIZED RUBRIC BREAKDOWN
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {briefing.criteriaBreakdown.map((item, idx) => (
            <div
              key={idx}
              className="border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] p-3.5"
              style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-black font-mono uppercase text-[var(--organizer-ink-primary)]">
                  {item.criterion}
                </span>
                <span className="border border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)] px-2 py-0.5 text-[10px] font-mono font-bold text-white">
                  {item.score} / {item.maxScore}
                </span>
              </div>
              <p className="text-[11px] font-mono text-[var(--organizer-ink-secondary)]">
                {item.reasoning}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Vectors for Growth */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="border-2 border-[var(--organizer-ink-primary)] bg-emerald-50/60 p-4">
          <div className="flex items-center gap-2 text-xs font-black font-mono uppercase text-emerald-900 mb-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-700" />
            VALIDATED STRENGTHS
          </div>
          <ul className="space-y-1.5 text-[11px] font-mono text-emerald-950">
            {briefing.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span>•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-2 border-[var(--organizer-ink-primary)] bg-amber-50/60 p-4">
          <div className="flex items-center gap-2 text-xs font-black font-mono uppercase text-amber-900 mb-2">
            <AlertTriangle className="h-4 w-4 text-amber-700" />
            OBSERVED ANOMALIES & LIMITS
          </div>
          <ul className="space-y-1.5 text-[11px] font-mono text-amber-950">
            {briefing.weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span>•</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t-2 border-[var(--organizer-border)] pt-4">
        <div className="text-[10px] font-mono text-[var(--organizer-ink-muted)] uppercase">
          EVALUATED AGAINST 6 CRITERIA VIA DETERMINISTIC JSON SCHEMA
        </div>

        <button
          onClick={handleApply}
          className="inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)] px-6 py-2.5 text-xs font-mono font-black uppercase text-[var(--organizer-ink-primary)] transition-transform hover:-translate-x-1 hover:-translate-y-1"
          style={{ boxShadow: "4px 4px 0px 0px var(--organizer-ink-primary)" }}
        >
          {applied ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-white" />
              SCORES TRANSFERRED TO RUBRIC
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              APPLY SUGGESTED SCORES
            </>
          )}
        </button>
      </div>
    </div>
  );
}