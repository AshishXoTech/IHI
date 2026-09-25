"use client";

import React, { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Terminal,
  Sliders,
  Award,
  Sparkles,
  Clock,
  ArrowRight,
  Shield,
  FileCode,
  CheckCircle2,
  Layers,
  Radio,
  ArrowLeft,
  LayoutDashboard,
  UserCheck,
  Send,
  BookOpen,
  Eye,
  RefreshCw,
} from "lucide-react";

type UserRole = "participant" | "organizer" | "judge";

const floatOne: Variants = {
  animate: {
    y: [0, -12, 0],
    rotate: [6, 12, 6],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
  },
};

const floatTwo: Variants = {
  animate: {
    y: [0, 14, 0],
    rotate: [-6, -12, -6],
    transition: { duration: 7, repeat: Infinity, ease: "easeInOut" },
  },
};

export default function EventHubPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = (params?.eventId as string) || "nexhack-2.0";

  const [role, setRole] = useState<UserRole>("participant");
  const [userName, setUserName] = useState<string>("Operative");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Read session role from cookies
    const getCookie = (name: string) => {
      const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
      return match ? decodeURIComponent(match[2]) : null;
    };

    const cookieRole = getCookie("ihi_role") as UserRole | null;
    const cookieName = getCookie("ihi_user_name") || getCookie("ihi_user_email") || "Hacker";

    if (cookieRole && ["participant", "organizer", "judge"].includes(cookieRole)) {
      setRole(cookieRole);
    } else {
      // Fallback check URL or default to participant
      setRole("participant");
    }

    setUserName(cookieName.split("@")[0]);
    setIsLoaded(true);
  }, []);

  const formattedEventTitle = eventId.replace(/-/g, " ").toUpperCase();

  return (
    <div className="min-h-screen bg-[var(--organizer-bg)] relative overflow-hidden text-[var(--organizer-ink-primary)] pb-24">
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
        variants={floatOne}
        animate="animate"
        className="absolute top-20 right-12 w-20 h-20 bg-[var(--organizer-gold)] border-2 border-[var(--organizer-ink-primary)] z-0 hidden lg:block"
        style={{ boxShadow: "6px 6px 0px 0px var(--organizer-ink-primary)" }}
      />
      <motion.div
        variants={floatTwo}
        animate="animate"
        className="absolute bottom-32 left-10 w-24 h-24 rounded-full bg-[var(--organizer-surface)] border-2 border-[var(--organizer-ink-primary)] z-0 hidden lg:flex items-center justify-center"
        style={{ boxShadow: "6px 6px 0px 0px var(--organizer-ink-primary)" }}
      >
        <div className="w-10 h-10 rounded-full bg-[var(--organizer-gold-deep)]" />
      </motion.div>

      {/* Header Bar */}
      <header className="relative z-10 bg-[var(--organizer-surface)] border-b-2 border-[var(--organizer-ink-primary)] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/hackathons"
              className="px-3 py-1.5 bg-[var(--organizer-bg)] border-2 border-[var(--organizer-ink-primary)] font-mono text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 hover:bg-[var(--organizer-gold-light)] transition-colors"
              style={{ boxShadow: "2px 2px 0px 0px var(--organizer-ink-primary)" }}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> ALL EVENTS
            </Link>

            <div
              className="px-3 py-1.5 bg-[var(--organizer-gold-light)] border-2 border-[var(--organizer-ink-primary)] font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--organizer-ink-primary)] hidden sm:block"
              style={{ boxShadow: "2px 2px 0px 0px var(--organizer-ink-primary)" }}
            >
              EVENT NODE: {eventId}
            </div>
          </div>

          {/* Role POV Selector */}
          <div className="flex items-center gap-3">
            <div className="flex items-center border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-bg)] p-0.5">
              <span className="px-2 text-[9px] font-mono font-bold uppercase text-[var(--organizer-ink-muted)]">
                POV:
              </span>
              <button
                type="button"
                onClick={() => setRole("participant")}
                className={`px-2.5 py-1 text-[9px] font-mono font-bold uppercase transition-colors ${
                  role === "participant"
                    ? "bg-[var(--organizer-gold)] text-[var(--organizer-ink-primary)] border border-[var(--organizer-ink-primary)]"
                    : "text-[var(--organizer-ink-muted)] hover:text-[var(--organizer-ink-primary)]"
                }`}
              >
                Hacker
              </button>
              <button
                type="button"
                onClick={() => setRole("organizer")}
                className={`px-2.5 py-1 text-[9px] font-mono font-bold uppercase transition-colors ${
                  role === "organizer"
                    ? "bg-[var(--organizer-gold)] text-[var(--organizer-ink-primary)] border border-[var(--organizer-ink-primary)]"
                    : "text-[var(--organizer-ink-muted)] hover:text-[var(--organizer-ink-primary)]"
                }`}
              >
                Organizer
              </button>
            </div>

            {role === "organizer" && (
              <Link
                href={`/events/${eventId}/dashboard`}
                className="px-3 py-1.5 bg-[var(--organizer-ink-primary)] text-white font-mono text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 hover:bg-[var(--organizer-gold)] hover:text-[var(--organizer-ink-primary)] transition-colors"
                style={{ boxShadow: "2px 2px 0px 0px var(--organizer-gold)" }}
              >
                <LayoutDashboard className="w-3.5 h-3.5" /> DASHBOARD →
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-10">
        {/* Banner Pill */}
        <div className="mb-4 inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold-light)] px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest">
          <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          {role === "organizer" ? "ORGANIZER CONTROL NODE" : "PARTICIPANT WORKSPACE"}
          {" · "}
          <span className="text-[var(--organizer-gold-deep)]">LIVE HACKING</span>
        </div>

        {/* Hero Title */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tighter uppercase">
              {formattedEventTitle} <span className="text-[var(--organizer-gold-deep)]">HUB.</span>
            </h1>
            <p className="text-xs font-mono font-bold uppercase tracking-wide text-[var(--organizer-ink-muted)] mt-2">
              {role === "organizer"
                ? "Autonomous orchestration environment for scoring, team rosters, and evaluation bounds."
                : `Welcome back, ${userName}. Complete team formation and submit your project before the deadline.`}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 min-w-full md:min-w-0">
            <div
              className="bg-[var(--organizer-surface)] border-2 border-[var(--organizer-ink-primary)] p-3"
              style={{ boxShadow: "3px 3px 0px 0px var(--organizer-gold)" }}
            >
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[var(--organizer-ink-muted)] block">
                PRIZE POOL
              </span>
              <span className="text-xl font-black font-display text-[var(--organizer-gold-deep)]">
                $50,000
              </span>
            </div>
            <div
              className="bg-[var(--organizer-surface)] border-2 border-[var(--organizer-ink-primary)] p-3"
              style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
            >
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[var(--organizer-ink-muted)] block">
                BUILDERS
              </span>
              <span className="text-xl font-black font-display">342</span>
            </div>
            <div
              className="bg-[var(--organizer-surface)] border-2 border-[var(--organizer-ink-primary)] p-3"
              style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
            >
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[var(--organizer-ink-muted)] block">
                TEAMS
              </span>
              <span className="text-xl font-black font-display">86</span>
            </div>
            <div
              className="bg-[var(--organizer-surface)] border-2 border-[var(--organizer-ink-primary)] p-3"
              style={{ boxShadow: "3px 3px 0px 0px var(--organizer-gold)" }}
            >
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[var(--organizer-ink-muted)] block">
                SUBMISSIONS
              </span>
              <span className="text-xl font-black font-display text-emerald-700">OPEN</span>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* PARTICIPANT POV CONTENT */}
        {/* ==================================================================== */}
        {role === "participant" && (
          <div className="space-y-10">
            {/* Active Status Card */}
            <div
              className="bg-[var(--organizer-surface)] border-2 border-[var(--organizer-ink-primary)] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6"
              style={{ boxShadow: "6px 6px 0px 0px var(--organizer-gold)" }}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[var(--organizer-gold-light)] border-2 border-[var(--organizer-ink-primary)]">
                  <Clock className="w-8 h-8 text-[var(--organizer-gold-deep)] animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-emerald-100 text-emerald-900 px-2 py-0.5 border border-emerald-700">
                      SUBMISSION GATE OPEN
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase text-[var(--organizer-ink-muted)]">
                      DEADLINE: 14H 32M REMAINING
                    </span>
                  </div>
                  <h3 className="text-2xl font-black font-display uppercase tracking-tight">
                    Hacking Phase Active
                  </h3>
                  <p className="text-xs font-mono text-[var(--organizer-ink-muted)] uppercase mt-0.5">
                    Your team "Null Pointers" is registered under the AI/ML Track.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <Link
                  href={`/submit?eventId=${eventId}`}
                  className="flex-1 md:flex-initial px-6 py-3 bg-[var(--organizer-gold)] border-2 border-[var(--organizer-ink-primary)] font-mono text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[var(--organizer-gold-deep)] hover:text-white transition-all"
                  style={{ boxShadow: "4px 4px 0px 0px var(--organizer-ink-primary)" }}
                >
                  <Send className="w-4 h-4" /> SUBMIT PROJECT →
                </Link>
              </div>
            </div>

            {/* Hacker Action Cards */}
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--organizer-ink-muted)] mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[var(--organizer-gold-deep)]" />
                HACKER WORKSPACE MODULES
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Module 1: Team Management */}
                <div
                  className="bg-[var(--organizer-surface)] border-2 border-[var(--organizer-ink-primary)] p-6 flex flex-col justify-between"
                  style={{ boxShadow: "6px 6px 0px 0px var(--organizer-ink-primary)" }}
                >
                  <div>
                    <div className="w-10 h-10 bg-[var(--organizer-gold-light)] border-2 border-[var(--organizer-ink-primary)] flex items-center justify-center mb-4">
                      <Users className="w-5 h-5 text-[var(--organizer-ink-primary)]" />
                    </div>
                    <h3 className="text-xl font-black font-display uppercase tracking-tight mb-2">
                      MY TEAM & ROSTER
                    </h3>
                    <p className="text-xs font-mono text-[var(--organizer-ink-muted)] leading-relaxed mb-6 uppercase">
                      Manage team members, share invite keys, and assign project roles.
                    </p>
                  </div>

                  <Link
                    href="/team"
                    className="w-full py-2.5 bg-[var(--organizer-bg)] border-2 border-[var(--organizer-ink-primary)] font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[var(--organizer-gold)] transition-colors"
                    style={{ boxShadow: "2px 2px 0px 0px var(--organizer-ink-primary)" }}
                  >
                    MANAGE TEAM →
                  </Link>
                </div>

                {/* Module 2: Project Submission */}
                <div
                  className="bg-[var(--organizer-surface)] border-2 border-[var(--organizer-ink-primary)] p-6 flex flex-col justify-between"
                  style={{ boxShadow: "6px 6px 0px 0px var(--organizer-gold)" }}
                >
                  <div>
                    <div className="w-10 h-10 bg-[var(--organizer-gold-light)] border-2 border-[var(--organizer-ink-primary)] flex items-center justify-center mb-4">
                      <FileCode className="w-5 h-5 text-[var(--organizer-gold-deep)]" />
                    </div>
                    <h3 className="text-xl font-black font-display uppercase tracking-tight mb-2">
                      SUBMIT PROJECT
                    </h3>
                    <p className="text-xs font-mono text-[var(--organizer-ink-muted)] leading-relaxed mb-6 uppercase">
                      Attach repository, demo video link, tech stack deck, and AI briefing.
                    </p>
                  </div>

                  <Link
                    href={`/submit?eventId=${eventId}`}
                    className="w-full py-2.5 bg-[var(--organizer-gold)] border-2 border-[var(--organizer-ink-primary)] font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[var(--organizer-gold-deep)] hover:text-white transition-colors"
                    style={{ boxShadow: "2px 2px 0px 0px var(--organizer-ink-primary)" }}
                  >
                    LAUNCH SUBMISSION →
                  </Link>
                </div>

                {/* Module 3: Live Leaderboard & Scores */}
                <div
                  className="bg-[var(--organizer-surface)] border-2 border-[var(--organizer-ink-primary)] p-6 flex flex-col justify-between"
                  style={{ boxShadow: "6px 6px 0px 0px var(--organizer-ink-primary)" }}
                >
                  <div>
                    <div className="w-10 h-10 bg-[var(--organizer-gold-light)] border-2 border-[var(--organizer-ink-primary)] flex items-center justify-center mb-4">
                      <Award className="w-5 h-5 text-[var(--organizer-ink-primary)]" />
                    </div>
                    <h3 className="text-xl font-black font-display uppercase tracking-tight mb-2">
                      RESULTS & LEADERBOARD
                    </h3>
                    <p className="text-xs font-mono text-[var(--organizer-ink-muted)] leading-relaxed mb-6 uppercase">
                      Track score reviews, criterion breakdowns, and winner announcements.
                    </p>
                  </div>

                  <Link
                    href={`/events/${eventId}/results`}
                    className="w-full py-2.5 bg-[var(--organizer-bg)] border-2 border-[var(--organizer-ink-primary)] font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[var(--organizer-gold)] transition-colors"
                    style={{ boxShadow: "2px 2px 0px 0px var(--organizer-ink-primary)" }}
                  >
                    VIEW LEADERBOARD →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* ORGANIZER POV CONTENT */}
        {/* ==================================================================== */}
        {role === "organizer" && (
          <div className="space-y-10">
            {/* Control Panel Grid */}
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--organizer-ink-muted)] mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-[var(--organizer-gold-deep)]" />
                ORGANIZER MANAGEMENT CONSOLE
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Console Dashboard */}
                <div
                  className="bg-[var(--organizer-surface)] border-2 border-[var(--organizer-ink-primary)] p-6 flex flex-col justify-between"
                  style={{ boxShadow: "6px 6px 0px 0px var(--organizer-ink-primary)" }}
                >
                  <div>
                    <div className="w-10 h-10 bg-[var(--organizer-gold-light)] border-2 border-[var(--organizer-ink-primary)] flex items-center justify-center mb-4">
                      <Terminal className="w-5 h-5 text-[var(--organizer-ink-primary)]" />
                    </div>
                    <h3 className="text-xl font-black font-display uppercase tracking-tight mb-2">
                      CONSOLE DASHBOARD
                    </h3>
                    <p className="text-xs font-mono text-[var(--organizer-ink-muted)] leading-relaxed mb-6 uppercase">
                      Monitor live analytics, real-time submission feeds, and team velocity.
                    </p>
                  </div>

                  <Link
                    href={`/events/${eventId}/dashboard`}
                    className="w-full py-2.5 bg-[var(--organizer-ink-primary)] text-white font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[var(--organizer-gold)] hover:text-[var(--organizer-ink-primary)] transition-colors"
                    style={{ boxShadow: "3px 3px 0px 0px var(--organizer-gold)" }}
                  >
                    OPEN CONSOLE →
                  </Link>
                </div>

                {/* Rubric Builder */}
                <div
                  className="bg-[var(--organizer-surface)] border-2 border-[var(--organizer-ink-primary)] p-6 flex flex-col justify-between"
                  style={{ boxShadow: "6px 6px 0px 0px var(--organizer-gold)" }}
                >
                  <div>
                    <div className="w-10 h-10 bg-[var(--organizer-gold-light)] border-2 border-[var(--organizer-ink-primary)] flex items-center justify-center mb-4">
                      <Sliders className="w-5 h-5 text-[var(--organizer-gold-deep)]" />
                    </div>
                    <h3 className="text-xl font-black font-display uppercase tracking-tight mb-2">
                      RUBRIC BUILDER
                    </h3>
                    <p className="text-xs font-mono text-[var(--organizer-ink-muted)] leading-relaxed mb-6 uppercase">
                      Configure criterion weights, scoring scales, and API validation bounds.
                    </p>
                  </div>

                  <Link
                    href={`/events/${eventId}/judging/rubric`}
                    className="w-full py-2.5 bg-[var(--organizer-gold)] border-2 border-[var(--organizer-ink-primary)] font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[var(--organizer-gold-deep)] hover:text-white transition-colors"
                    style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
                  >
                    EDIT RUBRIC →
                  </Link>
                </div>

                {/* Event Results Gate */}
                <div
                  className="bg-[var(--organizer-surface)] border-2 border-[var(--organizer-ink-primary)] p-6 flex flex-col justify-between"
                  style={{ boxShadow: "6px 6px 0px 0px var(--organizer-ink-primary)" }}
                >
                  <div>
                    <div className="w-10 h-10 bg-[var(--organizer-gold-light)] border-2 border-[var(--organizer-ink-primary)] flex items-center justify-center mb-4">
                      <Award className="w-5 h-5 text-[var(--organizer-ink-primary)]" />
                    </div>
                    <h3 className="text-xl font-black font-display uppercase tracking-tight mb-2">
                      EVENT RESULTS
                    </h3>
                    <p className="text-xs font-mono text-[var(--organizer-ink-muted)] leading-relaxed mb-6 uppercase">
                      Review immutable scores, monitor judge completions, and publish leaderboards.
                    </p>
                  </div>

                  <Link
                    href={`/events/${eventId}/results`}
                    className="w-full py-2.5 bg-[var(--organizer-bg)] border-2 border-[var(--organizer-ink-primary)] font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[var(--organizer-gold)] transition-colors"
                    style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
                  >
                    VIEW RESULTS →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}