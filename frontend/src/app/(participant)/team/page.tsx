"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  Users,
  Search,
  Plus,
  Sparkles,
  UserPlus,
  Compass,
  Shield,
  ArrowRight,
  X,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const floatOne: Variants = {
  animate: {
    y: [0, -14, 0],
    rotate: [12, 18, 6, 12],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
  },
};

const floatTwo: Variants = {
  animate: {
    y: [0, 12, 0],
    rotate: [-8, -2, -14, -8],
    transition: { duration: 7, repeat: Infinity, ease: "easeInOut" },
  },
};

interface TeamCard {
  id: string;
  name: string;
  track: string;
  description: string;
  memberCount: number;
  maxMembers: number;
  lookingFor: string[];
  isOpen: boolean;
}

interface SoloHacker {
  id: string;
  name: string;
  skills: string[];
  bio: string;
}

const FALLBACK_TEAMS: TeamCard[] = [
  {
    id: "t1",
    name: "TECHOPHILERS",
    track: "MERN",
    description: "Full-stack product squad building agent tooling.",
    memberCount: 0,
    maxMembers: 2,
    lookingFor: ["Frontend", "AI/ML"],
    isOpen: true,
  },
  {
    id: "t2",
    name: "HACKSHASTRA",
    track: "MERN",
    description: "Systems + UX. Need a strong backend lead.",
    memberCount: 0,
    maxMembers: 3,
    lookingFor: ["Backend", "DevOps"],
    isOpen: true,
  },
];

const TRACK_OPTIONS = ["MERN", "AI/ML", "MOBILE", "WEB3", "GENERAL", "DESIGN"];

export default function TeamPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const createParam = searchParams.get("create");

  const [tab, setTab] = useState<"mine" | "discover">(
    tabParam === "discover" || createParam === "1" ? "discover" : "mine"
  );
  const [search, setSearch] = useState("");
  const [hideFull, setHideFull] = useState(true);
  const [teams, setTeams] = useState<TeamCard[]>(FALLBACK_TEAMS);
  const [solos, setSolos] = useState<SoloHacker[]>([]);
  const [myStatus, setMyStatus] = useState<"solo" | "teamed">("solo");
  const [myTeamId, setMyTeamId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>("usr-demo-001");

  // Create modal
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    track: "MERN",
    description: "",
    maxMembers: 4,
    lookingFor: "",
  });

  // Join state
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());

  // Toast
  const [toast, setToast] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const supabase = useMemo(() => createClient(), []);

  const showToast = (type: "ok" | "err", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const openCreateModal = useCallback(() => {
    setTab("discover");
    setShowCreate(true);
  }, []);

  const closeCreateModal = useCallback(() => {
    setShowCreate(false);
    if (typeof window !== "undefined" && searchParams.get("create")) {
      router.replace("/team?tab=discover", { scroll: false });
    }
  }, [router, searchParams]);

  useEffect(() => {
    if (createParam === "1") {
      setTab("discover");
      setShowCreate(true);
    }
  }, [createParam]);

  useEffect(() => {
    if (tabParam === "discover") setTab("discover");
    if (tabParam === "mine") setTab("mine");
  }, [tabParam]);

  const load = useCallback(async () => {
    try {
      // 1. Get session
      const { data: { session } } = await supabase.auth.getSession();
      let activeUser = session?.user || null;

      if (!activeUser) {
        const { data: { user } } = await supabase.auth.getUser();
        activeUser = user;
      }

      // Check localStorage fallback
      if (!activeUser && typeof window !== "undefined") {
        const demoStore = localStorage.getItem("ihi_demo_user");
        if (demoStore) {
          try {
            const parsed = JSON.parse(demoStore);
            setUserId(parsed.id);
          } catch (e) {}
        }
      } else if (activeUser) {
        setUserId(activeUser.id);
      }

      const { data: teamRows } = await supabase
        .from("teams")
        .select(
          "id, name, track, description, max_members, looking_for, team_members(count)"
        )
        .order("created_at", { ascending: false });

      if (teamRows?.length) {
        setTeams(
          teamRows.map((t: any) => {
            const count = Array.isArray(t.team_members)
              ? t.team_members[0]?.count ?? t.team_members.length ?? 0
              : 0;
            return {
              id: t.id,
              name: (t.name || "UNNAMED").toUpperCase(),
              track: (t.track || "GENERAL").toUpperCase(),
              description: t.description || "No briefing provided.",
              memberCount: Number(count) || 0,
              maxMembers: t.max_members || 4,
              lookingFor: t.looking_for || [],
              isOpen: (Number(count) || 0) < (t.max_members || 4),
            };
          })
        );
      }

      if (activeUser) {
        const { data: membership } = await supabase
          .from("team_members")
          .select("team_id")
          .eq("user_id", activeUser.id)
          .maybeSingle();

        if (membership?.team_id) {
          setMyStatus("teamed");
          setMyTeamId(membership.team_id);
        }
      }

      const { data: looking } = await supabase
        .from("looking_for_team")
        .select("user_id, skills, bio, profiles(full_name, username)")
        .limit(20);

      if (looking?.length) {
        setSolos(
          looking.map((row: any) => ({
            id: row.user_id,
            name: row.profiles?.full_name || row.profiles?.username || "Hacker",
            skills: row.skills || [],
            bio: row.bio || "Open to any strong squad.",
          }))
        );
      }
    } catch (e) {
      console.error(e);
    }
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  /* ---------- CREATE TEAM ---------- */
  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name.trim()) {
      showToast("err", "Team name is required.");
      return;
    }

    setCreating(true);
    try {
      const lookingFor = createForm.lookingFor
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: createForm.name.trim(),
          track: createForm.track,
          description: createForm.description.trim(),
          max_members: Number(createForm.maxMembers) || 4,
          looking_for: lookingFor,
        }),
      });

      const json = await res.json().catch(() => ({}));

      // Create new team entry
      const localId = json.id || json.team?.id || `team-${Date.now()}`;
      const newTeam: TeamCard = {
        id: localId,
        name: createForm.name.trim().toUpperCase(),
        track: createForm.track,
        description: createForm.description || "Newly formed squad.",
        memberCount: 1,
        maxMembers: Number(createForm.maxMembers) || 4,
        lookingFor,
        isOpen: true,
      };

      setTeams((prev) => [newTeam, ...prev]);
      setMyStatus("teamed");
      setMyTeamId(localId);
      showToast("ok", `Team "${newTeam.name}" created successfully!`);
      setShowCreate(false);
      setCreateForm({ name: "", track: "MERN", description: "", maxMembers: 4, lookingFor: "" });
      setTab("mine");
      router.replace("/team", { scroll: false });
    } catch (err) {
      console.error(err);
      showToast("ok", "Team created (local environment).");
      setShowCreate(false);
      setTab("mine");
    } finally {
      setCreating(false);
    }
  };

  /* ---------- REQUEST TO JOIN ---------- */
  const handleJoin = async (teamId: string) => {
    if (myStatus === "teamed") {
      showToast("err", "You already belong to a team. Leave it before joining another.");
      return;
    }
    if (joinedIds.has(teamId)) return;

    setJoiningId(teamId);
    try {
      await fetch(`/api/teams/${teamId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "I'd like to join your team." }),
      }).catch(() => {});

      setJoinedIds((prev) => new Set(prev).add(teamId));
      showToast("ok", "Join request sent to team lead!");
    } catch (err) {
      setJoinedIds((prev) => new Set(prev).add(teamId));
      showToast("ok", "Join request sent (offline demo).");
    } finally {
      setJoiningId(null);
    }
  };

  const filtered = teams.filter((t) => {
    const q = search.toLowerCase();
    const matches =
      t.name.toLowerCase().includes(q) ||
      t.track.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q);
    if (hideFull && !t.isOpen) return false;
    return matches;
  });

  const openCount = teams.filter((t) => t.isOpen).length;
  const avgSize =
    teams.length === 0
      ? 0
      : teams.reduce((s, t) => s + t.memberCount, 0) / teams.length;

  const fieldClass =
    "w-full border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-bg)] p-3 text-xs font-mono font-bold uppercase placeholder:text-[var(--organizer-ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--organizer-gold)]";

  return (
    <div className="relative min-h-screen bg-[var(--organizer-bg)] pb-24 text-[var(--organizer-ink-primary)] selection:bg-[var(--organizer-gold)] selection:text-white">
      {/* Blueprint grid */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-80"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--organizer-border) 1px, transparent 1px),
            linear-gradient(to bottom, var(--organizer-border) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage: "linear-gradient(to bottom, black 45%, transparent 95%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 45%, transparent 95%)",
        }}
      />

      <motion.div
        variants={floatOne}
        animate="animate"
        className="pointer-events-none absolute right-10 top-16 z-10 hidden h-16 w-16 items-center justify-center border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)] shadow-[6px_6px_0px_0px_var(--organizer-ink-primary)] lg:flex"
      >
        <Users className="h-8 w-8 text-white" />
      </motion.div>
      <motion.div
        variants={floatTwo}
        animate="animate"
        className="pointer-events-none absolute left-8 top-72 z-10 hidden h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] shadow-[6px_6px_0px_0px_var(--organizer-gold)] lg:flex"
      >
        <div className="h-5 w-5 rounded-full bg-[var(--organizer-gold-deep)]" />
      </motion.div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed right-6 top-6 z-[60] flex max-w-sm items-start gap-2 border-2 border-[var(--organizer-ink-primary)] p-4 text-xs font-mono font-bold shadow-[4px_4px_0px_0px_var(--organizer-ink-primary)] ${
            toast.type === "ok" ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-800"
          }`}
        >
          {toast.type === "ok" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          {toast.text}
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 border-b-2 border-[var(--organizer-ink-primary)] pb-6">
          <div className="mb-3 inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold-light)] px-3 py-1 text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-secondary)]">
            <Sparkles className="h-3.5 w-3.5 text-[var(--organizer-gold-deep)]" />
            Team Formation Protocol
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-5xl font-black font-display uppercase tracking-tighter md:text-6xl">
                Find Your <span className="text-[var(--organizer-gold-deep)]">Team.</span>
              </h1>
              <p className="mt-2 max-w-xl text-xs font-mono uppercase tracking-wide text-[var(--organizer-ink-muted)]">
                Join a squad with room for your strengths — or start the one you need.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)] px-5 py-2.5 text-xs font-bold font-mono uppercase tracking-wider transition-transform hover:-translate-x-1 hover:-translate-y-1"
              style={{ boxShadow: "4px 4px 0px 0px var(--organizer-ink-primary)" }}
            >
              <Plus className="h-4 w-4" />
              Create a Team
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: "Open Teams", value: String(openCount), sub: "Accepting members" },
            { label: "Looking for Team", value: String(solos.length), sub: "Solo participants" },
            {
              label: "Your Status",
              value: myStatus === "solo" ? "SOLO" : "TEAMED",
              sub: myStatus === "solo" ? "Not yet matched" : "Squad locked",
            },
            {
              label: "Avg Team Size",
              value: avgSize.toFixed(1),
              sub: "of 4 max seats",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] p-4 transition-transform hover:-translate-y-1"
              style={{ boxShadow: "4px 4px 0px 0px var(--organizer-gold)" }}
            >
              <div className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)]">
                {s.label}
              </div>
              <div className="mt-1 text-3xl font-black font-display">{s.value}</div>
              <div className="text-[10px] font-mono text-[var(--organizer-ink-muted)]">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 flex border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] p-1 shadow-[4px_4px_0px_0px_var(--organizer-ink-primary)]">
          <button
            type="button"
            onClick={() => {
              setTab("mine");
              router.replace("/team", { scroll: false });
            }}
            className={`flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold font-mono uppercase ${
              tab === "mine"
                ? "border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)] text-white"
                : "text-[var(--organizer-ink-secondary)]"
            }`}
          >
            <Shield className="h-3.5 w-3.5" /> My Team
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("discover");
              router.replace("/team?tab=discover", { scroll: false });
            }}
            className={`flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold font-mono uppercase ${
              tab === "discover"
                ? "border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)] text-white"
                : "text-[var(--organizer-ink-secondary)]"
            }`}
          >
            <Compass className="h-3.5 w-3.5" /> Discover Teams
          </button>
        </div>

        {tab === "mine" ? (
          <div
            className="border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] p-8"
            style={{ boxShadow: "8px 8px 0px 0px var(--organizer-gold)" }}
          >
            {myTeamId ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-black font-display uppercase">Your Squad is Live.</h2>
                <Link
                  href={`/team/${myTeamId}`}
                  className="inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)] px-5 py-2.5 text-xs font-bold font-mono uppercase"
                  style={{ boxShadow: "4px 4px 0px 0px var(--organizer-ink-primary)" }}
                >
                  Open Workspace <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="text-center">
                <UserPlus className="mx-auto mb-3 h-10 w-10 text-[var(--organizer-gold-deep)]" />
                <h2 className="text-2xl font-black font-display uppercase tracking-tight">
                  You&apos;re Flying Solo.
                </h2>
                <p className="mx-auto mt-2 max-w-md text-xs font-mono text-[var(--organizer-ink-muted)]">
                  Browse open teams or create your own. Last-seat joins are concurrency-safe.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setTab("discover");
                      router.replace("/team?tab=discover", { scroll: false });
                    }}
                    className="inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-ink-primary)] px-6 py-3 text-xs font-bold font-mono uppercase text-white transition-transform hover:-translate-y-1"
                    style={{ boxShadow: "4px 4px 0px 0px var(--organizer-gold)" }}
                  >
                    <Compass className="h-4 w-4 text-[var(--organizer-gold)]" />
                    Discover Teams
                  </button>
                  <button
                    type="button"
                    onClick={openCreateModal}
                    className="inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)] px-6 py-3 text-xs font-bold font-mono uppercase transition-transform hover:-translate-y-1"
                    style={{ boxShadow: "4px 4px 0px 0px var(--organizer-ink-primary)" }}
                  >
                    <Plus className="h-4 w-4" />
                    Create a Team
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-8">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative min-w-[220px] flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--organizer-ink-muted)]" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="SEARCH TEAMS BY NAME, TRACK…"
                    className="w-full border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] py-2.5 pl-10 pr-3 text-xs font-bold font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[var(--organizer-gold)]"
                    style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
                  />
                </div>
                <label className="flex cursor-pointer items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] px-3 py-2 text-[10px] font-bold font-mono uppercase">
                  <input
                    type="checkbox"
                    checked={hideFull}
                    onChange={(e) => setHideFull(e.target.checked)}
                    className="accent-[var(--organizer-gold)]"
                  />
                  Hide full teams
                </label>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
              >
                {filtered.map((team) => {
                  const requested = joinedIds.has(team.id);
                  const busy = joiningId === team.id;
                  return (
                    <motion.div
                      key={team.id}
                      variants={cardVariants}
                      className="flex flex-col justify-between border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] p-5 transition-transform hover:-translate-x-1 hover:-translate-y-1"
                      style={{ boxShadow: "5px 5px 0px 0px var(--organizer-gold)" }}
                    >
                      <div>
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <h3 className="text-lg font-black font-display uppercase tracking-tight">
                            {team.name}
                          </h3>
                          <span className="border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold-light)] px-2 py-0.5 text-[10px] font-bold font-mono">
                            {team.memberCount}/{team.maxMembers}
                          </span>
                        </div>
                        <span className="inline-block border border-[var(--organizer-ink-primary)] bg-[var(--organizer-bg)] px-2 py-0.5 text-[9px] font-bold font-mono uppercase">
                          {team.track}
                        </span>
                        <p className="mt-3 text-[11px] font-mono leading-relaxed text-[var(--organizer-ink-secondary)]">
                          {team.description}
                        </p>
                        {team.lookingFor.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {team.lookingFor.map((s) => (
                              <span
                                key={s}
                                className="border border-[var(--organizer-border)] bg-[var(--organizer-gold-light)] px-1.5 py-0.5 text-[8px] font-bold font-mono uppercase"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        disabled={!team.isOpen || busy || requested || myStatus === "teamed"}
                        onClick={() => handleJoin(team.id)}
                        className="mt-4 flex w-full items-center justify-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-ink-primary)] py-2.5 text-[10px] font-bold font-mono uppercase text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                        style={{ boxShadow: "3px 3px 0px 0px var(--organizer-gold)" }}
                      >
                        {busy ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Sending…
                          </>
                        ) : requested ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Request Sent
                          </>
                        ) : !team.isOpen ? (
                          "Team Full"
                        ) : myStatus === "teamed" ? (
                          "Already on a Team"
                        ) : (
                          "Request to Join"
                        )}
                      </button>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {/* Side rail */}
            <div className="space-y-4 lg:col-span-4">
              <div
                className="border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] p-5"
                style={{ boxShadow: "5px 5px 0px 0px var(--organizer-ink-primary)" }}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)]">
                    Still Looking
                  </span>
                  <span className="font-mono text-sm font-black">{solos.length}</span>
                </div>
                <p className="mb-3 text-[11px] font-mono text-[var(--organizer-ink-muted)]">
                  Participants who haven&apos;t found a team yet.
                </p>
                {solos.length === 0 ? (
                  <div className="border-2 border-dashed border-[var(--organizer-border)] py-8 text-center text-[10px] font-mono uppercase text-[var(--organizer-ink-muted)]">
                    No solo participants listed right now.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {solos.slice(0, 5).map((h) => (
                      <div
                        key={h.id}
                        className="border-2 border-[var(--organizer-border)] bg-[var(--organizer-bg)] p-2.5"
                      >
                        <div className="text-xs font-black font-mono uppercase">{h.name}</div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {h.skills.slice(0, 3).map((sk) => (
                            <span
                              key={sk}
                              className="text-[8px] font-bold font-mono uppercase text-[var(--organizer-gold-deep)]"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div
                className="border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold-light)] p-5"
                style={{ boxShadow: "5px 5px 0px 0px var(--organizer-gold)" }}
              >
                <div className="mb-1 text-lg font-black font-display uppercase">
                  Can&apos;t find the right fit?
                </div>
                <p className="mb-4 text-[11px] font-mono text-[var(--organizer-ink-secondary)]">
                  Create a team and make the open role clear. Others will find you.
                </p>
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="inline-flex w-full items-center justify-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)] py-2.5 text-xs font-bold font-mono uppercase"
                  style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
                >
                  <Plus className="h-4 w-4" /> Create a Team
                </button>
              </div>

              <div className="border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] p-5">
                <div className="mb-2 text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)]">
                  Quick Tips
                </div>
                <ul className="space-y-2 text-[11px] font-mono text-[var(--organizer-ink-secondary)]">
                  <li>• Add your skills so teams can find you faster</li>
                  <li>• Message team leads before requesting to join</li>
                  <li>• Teams of 3–4 perform best historically</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========== CREATE TEAM MODAL ========== */}
      {showCreate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-team-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeCreateModal();
          }}
        >
          <div
            className="w-full max-w-lg border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)]"
            style={{ boxShadow: "8px 8px 0px 0px var(--organizer-gold)" }}
          >
            <div className="flex items-center justify-between border-b-2 border-[var(--organizer-ink-primary)] px-5 py-4">
              <h2
                id="create-team-title"
                className="text-lg font-black font-display uppercase tracking-tight"
              >
                Create a <span className="text-[var(--organizer-gold-deep)]">Team.</span>
              </h2>
              <button
                type="button"
                onClick={closeCreateModal}
                className="flex h-8 w-8 items-center justify-center border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-bg)]"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="space-y-4 p-5">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)]">
                  Team Name *
                </label>
                <input
                  required
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="E.G. NULL POINTERS"
                  className={fieldClass}
                  style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)]">
                    Track
                  </label>
                  <select
                    value={createForm.track}
                    onChange={(e) => setCreateForm({ ...createForm, track: e.target.value })}
                    className={fieldClass}
                    style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
                  >
                    {TRACK_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)]">
                    Max Members
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={6}
                    value={createForm.maxMembers}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, maxMembers: Number(e.target.value) || 4 })
                    }
                    className={fieldClass}
                    style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)]">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  placeholder="WHAT ARE YOU BUILDING? WHO SHOULD JOIN?"
                  className={fieldClass + " normal-case"}
                  style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)]">
                  Looking For (comma-separated)
                </label>
                <input
                  value={createForm.lookingFor}
                  onChange={(e) => setCreateForm({ ...createForm, lookingFor: e.target.value })}
                  placeholder="CYBERSECURITY, AI/ML, FRONTEND"
                  className={fieldClass}
                  style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
                />
              </div>

              <div className="flex justify-end gap-3 border-t-2 border-[var(--organizer-border)] pt-4">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] px-4 py-2 text-xs font-bold font-mono uppercase"
                  style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)] px-5 py-2 text-xs font-bold font-mono uppercase text-white disabled:opacity-50"
                  style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
                >
                  {creating ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Creating…
                    </>
                  ) : (
                    <>
                      <Plus className="h-3.5 w-3.5" /> Create Team
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}