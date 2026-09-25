"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Button, Input, Card } from "@/components/ui";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingFooter } from "@/components/landing/LandingFooter";
import type { Sponsor } from "@/types/sponsor";

// Editorial Sponsor Tier Colors (Hard contrasted for the new style)
const TIER_COLORS: Record<string, string> = {
  Title: "bg-[var(--organizer-ink-primary)] text-[var(--organizer-gold)] border-[var(--organizer-ink-primary)]",
  Platinum: "bg-[var(--organizer-gold)] text-[#FFFFFF] border-[var(--organizer-gold-deep)]",
  Gold: "bg-[var(--organizer-gold-light)] text-[var(--organizer-gold-deep)] border-[var(--organizer-gold-champagne)]",
  Silver: "bg-[var(--organizer-surface-hover)] text-[var(--organizer-ink-secondary)] border-[var(--organizer-border)]",
  Bronze: "bg-[var(--organizer-surface)] text-[var(--organizer-ink-muted)] border-[var(--organizer-border-light)]",
  "API Partner": "bg-emerald-50 text-emerald-800 border-emerald-200",
  "In-Kind": "bg-[var(--organizer-surface-hover)] text-[var(--organizer-ink-secondary)] border-[var(--organizer-border)]",
};

// Framer Motion Variants explicitly typed to fix TS errors
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
};

const floatVariants: Variants = {
  animate: {
    y: [0, -15, 0],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All");

  useEffect(() => {
    async function loadSponsors() {
      try {
        setLoading(true);
        const res = await fetch("/api/sponsors?status=approved");
        const json = await res.json();
        if (json.ok && Array.isArray(json.data)) {
          setSponsors(json.data);
        } else {
          setError(json.error || "Could not load sponsor directory.");
        }
      } catch {
        setError("Network error loading sponsors.");
      } finally {
        setLoading(false);
      }
    }
    loadSponsors();
  }, []);

  const industries = ["All", ...Array.from(new Set(sponsors.map((s) => s.industry).filter(Boolean)))];

  const filteredSponsors = sponsors.filter((s) => {
    const matchesSearch =
      s.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.sponsorship_criteria && s.sponsorship_criteria.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesIndustry = selectedIndustry === "All" || s.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="min-h-screen bg-[var(--organizer-bg)] text-[var(--organizer-ink-primary)] flex flex-col relative overflow-hidden">
      
      {/* 1. MLH-Style Blueprint Grid Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(var(--organizer-border) 1px, transparent 1px), 
            linear-gradient(90deg, var(--organizer-border) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
        }}
      />

      {/* 2. Floating Abstract Graphics */}
      <motion.div 
        variants={floatVariants} 
        animate="animate"
        className="absolute top-32 right-[5%] z-0 hidden lg:flex items-center justify-center w-32 h-32 rounded-3xl bg-[var(--organizer-gold)] border-4 border-[var(--organizer-ink-primary)] opacity-80"
        style={{ boxShadow: "8px 8px 0px 0px var(--organizer-ink-primary)", transform: "rotate(12deg)" }}
      >
        <span className="text-5xl">âœ¦</span>
      </motion.div>

      <motion.div 
        variants={floatVariants} 
        animate="animate"
        style={{ animationDelay: "1s" }}
        className="absolute top-96 left-[2%] z-0 hidden lg:flex items-center justify-center w-24 h-24 rounded-full bg-[var(--organizer-surface)] border-4 border-[var(--organizer-ink-primary)] opacity-80"
      >
        <div className="w-10 h-10 bg-[var(--organizer-gold-deep)] rounded-full" />
      </motion.div>

      <LandingNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-16 lg:px-8 space-y-12 relative z-10">
        
        {/* Header Hero */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-2 border-[var(--organizer-ink-primary)] pb-10">
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-black font-display tracking-tighter text-[var(--organizer-ink-primary)] uppercase">
              Sponsor <br/><span className="text-[var(--organizer-gold-deep)]">Directory.</span>
            </h1>
            <p className="text-[var(--organizer-ink-secondary)] text-lg leading-relaxed font-medium">
              Discover the industry leaders, cloud platforms, and API partners powering modern developer hackathons through the IHI network.
            </p>
          </div>

          <Link href="/sponsors/register">
            <Button
              size="lg"
              className="bg-[var(--organizer-gold)] text-[var(--organizer-ink-primary)] font-bold uppercase tracking-widest border-2 border-[var(--organizer-ink-primary)] hover:bg-[var(--organizer-gold-deep)] hover:text-white transition-all duration-200"
              style={{ boxShadow: "4px 4px 0px 0px var(--organizer-ink-primary)" }}
            >
              Get Started â†’
            </Button>
          </Link>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[var(--organizer-surface)] p-4 rounded-xl border-2 border-[var(--organizer-ink-primary)]" style={{ boxShadow: "4px 4px 0px 0px var(--organizer-border)" }}>
          <div className="w-full sm:w-80">
            <Input
              placeholder="Search companies, tech, APIs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[var(--organizer-bg)] border-[var(--organizer-border)] text-[var(--organizer-ink-primary)] font-mono focus:ring-[var(--organizer-gold)] focus:border-[var(--organizer-ink-primary)]"
            />
          </div>

          <div className="flex gap-2 flex-wrap w-full sm:w-auto">
            {industries.map((ind) => (
              <button
                key={ind}
                onClick={() => setSelectedIndustry(ind)}
                className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider border-2 transition-all ${
                  selectedIndustry === ind
                    ? "bg-[var(--organizer-ink-primary)] border-[var(--organizer-ink-primary)] text-[var(--organizer-gold)]"
                    : "bg-[var(--organizer-surface)] border-[var(--organizer-border)] text-[var(--organizer-ink-muted)] hover:border-[var(--organizer-ink-primary)] hover:text-[var(--organizer-ink-primary)]"
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="p-4 border-2 border-red-500 bg-red-50 font-mono text-red-800 font-bold uppercase">
            {error}
          </div>
        )}

        {/* Animated Sponsor Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 rounded-xl border-2 border-[var(--organizer-border)] bg-[var(--organizer-surface)] animate-pulse p-6" />
            ))}
          </div>
        ) : filteredSponsors.length === 0 ? (
          <div className="text-center py-20 rounded-xl border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] space-y-6" style={{ boxShadow: "8px 8px 0px 0px var(--organizer-border)" }}>
            <p className="text-xl font-bold font-display text-[var(--organizer-ink-muted)] uppercase tracking-widest">No matching partners found</p>
            <Link href="/sponsors/register">
              <Button size="lg" className="bg-[var(--organizer-ink-primary)] text-white border-2 border-[var(--organizer-ink-primary)]">
                Register Your Company
              </Button>
            </Link>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredSponsors.map((sponsor) => {
              const tierBadgeClass = TIER_COLORS[sponsor.sponsorship_type] || TIER_COLORS.Silver;

              return (
                <motion.article
                  variants={cardVariants}
                  key={sponsor.id}
                  // Neo-Brutalist Card Style
                  className="rounded-xl border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] p-6 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-2 hover:-translate-x-1 space-y-6"
                  style={{ boxShadow: "6px 6px 0px 0px var(--organizer-gold)" }}
                >
                  <div className="space-y-5">
                    <div className="flex items-start justify-between gap-3 border-b-2 border-[var(--organizer-border-light)] pb-4">
                      <div>
                        <h2 className="text-2xl font-black font-display text-[var(--organizer-ink-primary)] uppercase tracking-tight leading-none">
                          {sponsor.company_name}
                        </h2>
                        <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)] mt-1 block">
                          {sponsor.industry}
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border-2 ${tierBadgeClass}`}>
                        {sponsor.sponsorship_type}
                      </span>
                    </div>

                    {sponsor.technologies && sponsor.technologies.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--organizer-ink-muted)]">
                          Provided APIs
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {sponsor.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-1 rounded bg-[var(--organizer-bg)] border border-[var(--organizer-border)] text-xs font-mono font-semibold text-[var(--organizer-ink-secondary)]"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {sponsor.sponsorship_criteria && (
                      <div className="space-y-2 bg-[var(--organizer-surface-hover)] p-3 rounded-lg border border-[var(--organizer-border-light)]">
                        <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--organizer-ink-muted)]">
                          Sponsor Bounties
                        </p>
                        <p className="text-xs font-medium text-[var(--organizer-ink-secondary)] leading-relaxed">
                          {sponsor.sponsorship_criteria}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <a
                      href={sponsor.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-black font-mono uppercase tracking-widest text-[var(--organizer-gold-deep)] hover:text-[var(--organizer-ink-primary)] transition-colors"
                    >
                      Website â†—
                    </a>
                    {sponsor.linkedin_company_page && (
                      <a
                        href={sponsor.linkedin_company_page}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)] hover:text-[var(--organizer-ink-primary)] transition-colors"
                      >
                        LinkedIn
                      </a>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </main>

      <LandingFooter />
    </div>
  );
}
