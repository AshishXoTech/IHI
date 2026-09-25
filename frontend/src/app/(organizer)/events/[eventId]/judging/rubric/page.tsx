"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import { Plus, Trash2, ShieldCheck, ArrowLeft, Save, Users, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface Criterion {
  id: string;
  name: string;
  weight: number;
  scale: number;
  description: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
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

const floatVariantsReverse: Variants = {
  animate: {
    y: [0, 15, 0],
    rotate: [0, -5, 5, 0],
    transition: { duration: 7, repeat: Infinity, ease: "easeInOut" },
  },
};

export default function RubricBuilderPage() {
  const routeParams = useParams();
  const eventId = (routeParams?.eventId as string) || "1";

  const [rubricTitle, setRubricTitle] = useState("Main Evaluation Rubric");
  const [criteria, setCriteria] = useState<Criterion[]>([
    {
      id: "1",
      name: "Technical Complexity",
      weight: 30,
      scale: 10,
      description: "Architecture, algorithm complexity, code structure, and technical execution accuracy.",
    },
    {
      id: "2",
      name: "Originality & Innovation",
      weight: 25,
      scale: 10,
      description: "Uniqueness of the problem solved or novel approach taken.",
    },
    {
      id: "3",
      name: "Design / UX",
      weight: 25,
      scale: 10,
      description: "Usability, aesthetics, user interaction flow, and visual polish.",
    },
    {
      id: "4",
      name: "Impact",
      weight: 20,
      scale: 10,
      description: "Real-world usefulness, potential market size, or social value.",
    },
  ]);

  const totalWeight = criteria.reduce((sum, c) => sum + (Number(c.weight) || 0), 0);
  const isValid = totalWeight === 100;

  const handleCriterionChange = (id: string, field: keyof Criterion, value: string | number) => {
    setCriteria((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleAddCriterion = () => {
    const newId = (criteria.length + 1).toString();
    setCriteria((prev) => [
      ...prev,
      {
        id: newId,
        name: `New Criterion ${newId}`,
        weight: 0,
        scale: 10,
        description: "",
      },
    ]);
  };

  const handleRemoveCriterion = (id: string) => {
    setCriteria((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="relative min-h-screen bg-[var(--organizer-bg)] text-[var(--organizer-ink-primary)] selection:bg-[var(--organizer-gold)] selection:text-white pb-24 overflow-hidden p-6">
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
        className="pointer-events-none absolute top-12 right-12 z-0 hidden lg:block h-16 w-16 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)]"
        style={{ boxShadow: "6px 6px 0px 0px var(--organizer-ink-primary)" }}
      />
      <motion.div
        variants={floatVariantsReverse}
        animate="animate"
        className="pointer-events-none absolute bottom-24 right-24 z-0 hidden lg:block h-12 w-12 rounded-full border-2 border-[var(--organizer-ink-primary)] bg-white p-2"
      >
        <div className="h-full w-full rounded-full bg-[var(--organizer-gold-deep)]" />
      </motion.div>

      {/* Main Container */}
      <div className="relative z-10 mx-auto max-w-5xl">
        
        {/* Top Eyebrow Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Link
              href={`/events/${eventId}/dashboard`}
              className="inline-flex items-center gap-1 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] px-3 py-1.5 text-[10px] font-bold font-mono uppercase tracking-wider transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
            >
              <ArrowLeft className="h-3 w-3" /> Back
            </Link>
            <span className="inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold-light)] px-3 py-1 text-[10px] font-bold font-mono uppercase tracking-widest">
              JUDGING · RUBRIC
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] px-5 py-2.5 text-xs font-bold font-mono uppercase tracking-wider transition-transform hover:-translate-x-1 hover:-translate-y-1"
              style={{ boxShadow: "4px 4px 0px 0px var(--organizer-ink-primary)" }}
            >
              <Users className="h-4 w-4" /> Judge Assign
            </button>
            <button
              disabled={!isValid}
              className={`inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] px-5 py-2.5 text-xs font-bold font-mono uppercase tracking-wider transition-transform hover:-translate-x-1 hover:-translate-y-1 ${
                isValid
                  ? "bg-[var(--organizer-gold)] text-[var(--organizer-ink-primary)]"
                  : "bg-gray-200 text-gray-400 opacity-60 cursor-not-allowed"
              }`}
              style={{ boxShadow: "4px 4px 0px 0px var(--organizer-ink-primary)" }}
            >
              <Save className="h-4 w-4" /> Save Rubric
            </button>
          </div>
        </div>

        {/* Display Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tighter uppercase">
            RUBRIC <span className="text-[var(--organizer-gold-deep)]">BUILDER.</span>
          </h1>
          <p className="mt-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--organizer-ink-muted)]">
            Criteria weights must sum to exactly 100 (UI + API + DB verification enforced).
          </p>
        </div>

        {/* Form Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Running Total Card */}
          <motion.div
            variants={cardVariants}
            className="border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] p-6 transition-transform hover:-translate-y-0.5"
            style={{ boxShadow: "6px 6px 0px 0px var(--organizer-gold)" }}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)]">
                  Running weight total
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-black font-mono tracking-tight">
                    {totalWeight}
                  </span>
                  <span className="text-lg font-bold font-mono text-[var(--organizer-ink-muted)]">
                    / 100
                  </span>
                </div>
              </div>

              <div>
                {isValid ? (
                  <span className="inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-emerald-100 px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider text-emerald-900">
                    <ShieldCheck className="h-4 w-4 text-emerald-700" /> Valid — 100%
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-amber-100 px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider text-amber-900">
                    <AlertTriangle className="h-4 w-4 text-amber-700" /> Invalid Total ({totalWeight}% / 100%)
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Rubric Title Field */}
          <motion.div
            variants={cardVariants}
            className="border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] p-6"
            style={{ boxShadow: "6px 6px 0px 0px var(--organizer-gold)" }}
          >
            <label className="block text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)] mb-2">
              Rubric title
            </label>
            <input
              type="text"
              value={rubricTitle}
              onChange={(e) => setRubricTitle(e.target.value)}
              className="w-full border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-bg)] p-3 text-xs font-mono font-bold uppercase placeholder:text-[var(--organizer-ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--organizer-gold)]"
              style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
            />
          </motion.div>

          {/* Criteria Cards */}
          {criteria.map((item, idx) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              className="border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] p-6"
              style={{ boxShadow: "6px 6px 0px 0px var(--organizer-gold)" }}
            >
              <div className="flex items-center justify-between pb-4 border-b-2 border-[var(--organizer-border-light)] mb-4">
                <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-secondary)]">
                  CRITERION {idx + 1}
                </span>
                {criteria.length > 1 && (
                  <button
                    onClick={() => handleRemoveCriterion(item.id)}
                    className="inline-flex items-center gap-1 text-xs font-bold font-mono uppercase tracking-wider text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)] mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleCriterionChange(item.id, "name", e.target.value)}
                    className="w-full border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-bg)] p-3 text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-[var(--organizer-gold)]"
                    style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)] mb-1">
                      Weight (%)
                    </label>
                    <input
                      type="number"
                      value={item.weight}
                      onChange={(e) => handleCriterionChange(item.id, "weight", Number(e.target.value))}
                      className="w-full border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-bg)] p-3 text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-[var(--organizer-gold)]"
                      style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)] mb-1">
                      Scale (max score)
                    </label>
                    <input
                      type="number"
                      value={item.scale}
                      onChange={(e) => handleCriterionChange(item.id, "scale", Number(e.target.value))}
                      className="w-full border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-bg)] p-3 text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-[var(--organizer-gold)]"
                      style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)] mb-1">
                    Description (optional)
                  </label>
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => handleCriterionChange(item.id, "description", e.target.value)}
                    className="w-full border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-bg)] p-3 text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-[var(--organizer-gold)]"
                    style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
                  />
                </div>
              </div>
            </motion.div>
          ))}

          {/* Add Criterion Button */}
          <motion.div variants={cardVariants}>
            <button
              onClick={handleAddCriterion}
              className="w-full inline-flex items-center justify-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] py-3 text-xs font-bold font-mono uppercase tracking-wider transition-transform hover:-translate-x-1 hover:-translate-y-1"
              style={{ boxShadow: "4px 4px 0px 0px var(--organizer-ink-primary)" }}
            >
              <Plus className="h-4 w-4" /> Add criterion
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}