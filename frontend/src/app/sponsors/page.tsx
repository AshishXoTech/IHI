"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import {
  Building2,
  ExternalLink,
  Award,
  Zap,
  ArrowRight,
  PlusCircle,
  Database,
  Cpu,
  Globe,
  Layers,
} from "lucide-react";
import Link from "next/link";

interface Sponsor {
  id: string;
  name: string;
  tagline: string;
  tier: "Title Sponsor" | "Platinum Tier" | "Gold Tier" | "Silver Tier";
  tierColor: string;
  grantValue: string;
  bountyTracks: string[];
  description: string;
  website: string;
  icon: React.ReactNode;
}

const DUMMY_SPONSORS: Sponsor[] = [
  {
    id: "anthropic",
    name: "Anthropic",
    tagline: "Frontier AI Safety & Claude 3.5 Models",
    tier: "Title Sponsor",
    tierColor: "bg-[var(--organizer-gold-light)] text-[var(--organizer-gold-deep)] border-[var(--organizer-ink-primary)]",
    grantValue: "$25,000 API CREDITS",
    bountyTracks: ["AI/ML Reasoning", "Agentic Systems", "AI Safety"],
    description:
      "Providing hackathon participants with direct access to Claude 3.5 Sonnet & Haiku APIs, offering dedicated technical mentorship and high-tier compute credits.",
    website: "https://anthropic.com",
    icon: <Cpu className="h-6 w-6 text-[var(--organizer-gold-deep)]" />,
  },
  {
    id: "supabase",
    name: "Supabase",
    tagline: "The Open Source Firebase Alternative",
    tier: "Platinum Tier",
    tierColor: "bg-emerald-100 text-emerald-900 border-[var(--organizer-ink-primary)]",
    grantValue: "$10,000 DB CREDITS",
    bountyTracks: ["Realtime Apps", "Vector Search", "Database Architecture"],
    description:
      "Empowering hackers to build instant Postgres backends with Auth, Row Level Security, Edge Functions, and Vector Embeddings in minutes.",
    website: "https://supabase.com",
    icon: <Database className="h-6 w-6 text-emerald-700" />,
  },
  {
    id: "solana",
    name: "Solana Foundation",
    tagline: "High-Performance Blockchain Infrastructure",
    tier: "Gold Tier",
    tierColor: "bg-purple-100 text-purple-900 border-[var(--organizer-ink-primary)]",
    grantValue: "$15,000 PRIZE POOL",
    bountyTracks: ["Web3 Payment Rails", "DeFi Innovation", "Solana Mobile"],
    description:
      "Sponsoring decentralized applications, high-throughput microtransactions, and Web3 user experience breakthroughs.",
    website: "https://solana.com",
    icon: <Layers className="h-6 w-6 text-purple-700" />,
  },
  {
    id: "vercel",
    name: "Vercel",
    tagline: "Frontend Cloud & Next.js Ecosystem",
    tier: "Silver Tier",
    tierColor: "bg-blue-100 text-blue-900 border-[var(--organizer-ink-primary)]",
    grantValue: "$5,000 INFRASTRUCTURE",
    bountyTracks: ["Frontend UX", "Serverless Edge", "Developer Tools"],
    description:
      "Sponsoring instant global deployments, Next.js App Router integrations, and premium performance monitoring tools.",
    website: "https://vercel.com",
    icon: <Globe className="h-6 w-6 text-blue-700" />,
  },
];

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

const floatVariantsReverse: Variants = {
  animate: {
    y: [0, 15, 0],
    rotate: [0, -5, 5, 0],
    transition: { duration: 7, repeat: Infinity, ease: "easeInOut" },
  },
};

export default function SponsorsPage() {
  return (
    <div className="relative min-h-screen bg-[var(--organizer-bg)] text-[var(--organizer-ink-primary)] selection:bg-[var(--organizer-gold)] selection:text-white pb-24 overflow-hidden">
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

      {/* Floating Framer Motion Shapes */}
      <motion.div
        variants={floatVariants}
        animate="animate"
        className="pointer-events-none absolute top-16 right-12 z-0 hidden lg:block h-16 w-16 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)]"
        style={{ boxShadow: "6px 6px 0px 0px var(--organizer-ink-primary)" }}
      />
      <motion.div
        variants={floatVariantsReverse}
        animate="animate"
        className="pointer-events-none absolute bottom-32 left-8 z-0 hidden lg:block h-14 w-14 rounded-full border-2 border-[var(--organizer-ink-primary)] bg-white p-2"
      >
        <div className="h-full w-full rounded-full bg-[var(--organizer-gold-deep)]" />
      </motion.div>

      {/* Page Shell Container */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        
        {/* Navigation & Eyebrow */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] px-3 py-1.5 text-[10px] font-bold font-mono uppercase tracking-wider transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
            >
              ← Home
            </Link>
            <span className="inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold-light)] px-3 py-1 text-[10px] font-bold font-mono uppercase tracking-widest">
              IHI NETWORK · PARTNERS
            </span>
          </div>

          <Link
            href="/sponsors/register"
            className="inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)] px-5 py-2.5 text-xs font-bold font-mono uppercase tracking-wider transition-transform hover:-translate-x-1 hover:-translate-y-1"
            style={{ boxShadow: "4px 4px 0px 0px var(--organizer-ink-primary)" }}
          >
            <PlusCircle className="h-4 w-4" /> Become a Sponsor
          </Link>
        </div>

        {/* Display Title */}
        <div className="mb-10">
          <h1 className="text-5xl sm:text-7xl font-black font-display tracking-tighter uppercase">
            GLOBAL <span className="text-[var(--organizer-gold-deep)]">SPONSORS.</span>
          </h1>
          <p className="mt-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--organizer-ink-muted)] max-w-2xl">
            Industry leaders empowering hackers with API grants, infrastructure, and direct bounty prize pools across all IHI events.
          </p>
        </div>

        {/* Global Impact Stats Strip */}
        <div
          className="mb-12 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] p-6"
          style={{ boxShadow: "6px 6px 0px 0px var(--organizer-gold)" }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)]">
                Active Sponsors
              </p>
              <p className="text-3xl font-black font-mono mt-1">14+</p>
            </div>
            <div>
              <p className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)]">
                Total Grant Pool
              </p>
              <p className="text-3xl font-black font-mono mt-1 text-[var(--organizer-gold-deep)]">$150,000+</p>
            </div>
            <div>
              <p className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)]">
                Bounty Tracks
              </p>
              <p className="text-3xl font-black font-mono mt-1">28</p>
            </div>
            <div>
              <p className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)]">
                Projects Funded
              </p>
              <p className="text-3xl font-black font-mono mt-1">120+</p>
            </div>
          </div>
        </div>

        {/* Sponsors Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {DUMMY_SPONSORS.map((sponsor) => (
            <motion.div
              key={sponsor.id}
              variants={cardVariants}
              className="border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] p-6 flex flex-col justify-between transition-transform hover:-translate-y-1"
              style={{ boxShadow: "6px 6px 0px 0px var(--organizer-gold)" }}
            >
              <div>
                {/* Header Row */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-3 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-bg)]"
                      style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
                    >
                      {sponsor.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black font-display uppercase tracking-tight">
                        {sponsor.name}
                      </h3>
                      <p className="text-[10px] font-bold font-mono uppercase tracking-wider text-[var(--organizer-ink-muted)]">
                        {sponsor.tagline}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center border-2 px-2.5 py-1 text-[9px] font-bold font-mono uppercase tracking-widest ${sponsor.tierColor}`}
                  >
                    {sponsor.tier}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs font-mono text-[var(--organizer-ink-secondary)] leading-relaxed mb-6">
                  {sponsor.description}
                </p>

                {/* Grant Value Box */}
                <div className="border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold-light)] p-3 mb-6 flex items-center justify-between">
                  <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)] flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-[var(--organizer-gold-deep)]" /> Active Grant
                  </span>
                  <span className="text-xs font-black font-mono text-[var(--organizer-gold-deep)] uppercase tracking-wider">
                    {sponsor.grantValue}
                  </span>
                </div>

                {/* Bounty Tracks */}
                <div className="mb-6">
                  <p className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)] mb-2">
                    Sponsored Tracks
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {sponsor.bountyTracks.map((track) => (
                      <span
                        key={track}
                        className="border border-[var(--organizer-ink-primary)] bg-[var(--organizer-bg)] px-2.5 py-1 text-[10px] font-bold font-mono uppercase tracking-wider"
                      >
                        {track}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t-2 border-[var(--organizer-border-light)] flex items-center justify-between">
                <a
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold font-mono uppercase tracking-wider text-[var(--organizer-ink-muted)] hover:text-[var(--organizer-ink-primary)] transition-colors"
                >
                  Visit Website <ExternalLink className="h-3.5 w-3.5" />
                </a>

                <Link
                  href="/sponsors/register"
                  className="inline-flex items-center gap-1 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] px-3 py-1.5 text-[10px] font-bold font-mono uppercase tracking-wider transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
                  style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
                >
                  Partner Details <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Sponsor Call-To-Action Banner */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] p-8 sm:p-12 text-center relative overflow-hidden"
          style={{ boxShadow: "6px 6px 0px 0px var(--organizer-gold)" }}
        >
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold-light)] px-3 py-1 text-[10px] font-bold font-mono uppercase tracking-widest">
              ORGANIZERS & ENTERPRISE
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tighter uppercase">
              WANT TO SPONSOR <span className="text-[var(--organizer-gold-deep)]">AN EVENT?</span>
            </h2>
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--organizer-ink-muted)]">
              Connect with elite builder talent, review automatic telemetry from developer submissions, and host custom bounty challenges.
            </p>
            <div className="pt-4 flex justify-center gap-4">
              <Link
                href="/sponsors/register"
                className="inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)] px-6 py-3 text-xs font-bold font-mono uppercase tracking-wider transition-transform hover:-translate-x-1 hover:-translate-y-1"
                style={{ boxShadow: "4px 4px 0px 0px var(--organizer-ink-primary)" }}
              >
                Register As Sponsor <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}