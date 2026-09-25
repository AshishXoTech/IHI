"use client";

import React, { useCallback, useEffect, useState, use } from "react";
import Link from "next/link";
import { 
  Button, 
  Card, 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell, 
  TableEmpty 
} from "@/components/ui";
import { clsx } from "clsx";
import type { ApiResult, JudgeInvite } from "@/types/shared";

export default function JudgeAssignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Next.js 15 requires awaiting dynamic route params
  const { id: eventId } = use(params);

  const [emailText, setEmailText] = useState("");
  const [invites, setInvites] = useState<JudgeInvite[]>([]);
  const [assignments, setAssignments] = useState<
    { id: string; judge_user_id: string; submission_id: string | null; status: string }[]
  >([]);
  
  const [assignSummary, setAssignSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [invRes, asgRes] = await Promise.all([
        fetch(`/api/judging/invites?eventId=${encodeURIComponent(eventId)}`),
        fetch(`/api/judging/assign?eventId=${encodeURIComponent(eventId)}`),
      ]);
      
      const invJson = (await invRes.json()) as ApiResult<JudgeInvite[]>;
      const asgJson = (await asgRes.json()) as ApiResult<typeof assignments>;
      
      if (invRes.ok && invJson.ok) setInvites(invJson.data);
      if (asgRes.ok && asgJson.ok) setAssignments(asgJson.data as typeof assignments);
    } catch {
      setError("Failed to load invites/assignments.");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleInvite = async () => {
    const emails = emailText
      .split(/[\n,;]+/)
      .map((e) => e.trim())
      .filter(Boolean);
      
    if (emails.length === 0) {
      setError("Enter at least one judge email.");
      return;
    }
    
    setInviting(true);
    setError(null);
    setAssignSummary(null);
    
    try {
      const res = await fetch("/api/judging/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, emails, eventName: `Event ${eventId}` }),
      });
      
      const json = (await res.json()) as ApiResult<{ magicResults?: { email: string; magicLinkSent: boolean; note?: string; devUrl?: string }[] }>;
      
      if (!res.ok || !json.ok) {
        setError(!json.ok ? json.error : "Invite failed.");
        return;
      }
      
      setEmailText("");
      
      let hasDevUrls = false;
      const notes = (json.data.magicResults || [])
        .map((m) => {
          if (m.devUrl) hasDevUrls = true;
          return `${m.email}: ${m.magicLinkSent ? "magic link sent" : m.note || "saved only"}`;
        })
        .join(" · ");
        
      setAssignSummary(notes || "Invites saved successfully.");
      
      if (hasDevUrls) {
        console.log("DEV MAGIC LINKS GENERATED:");
        (json.data.magicResults || []).forEach(m => {
          if (m.devUrl) console.log(`${m.email} -> ${m.devUrl}`);
        });
      }
      
      await load();
    } catch {
      setError("Network error sending invites.");
    } finally {
      setInviting(false);
    }
  };

  const handleAutoAssign = async () => {
    setAssigning(true);
    setError(null);
    setAssignSummary(null);
    try {
      const res = await fetch("/api/judging/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });
      
      const json = (await res.json()) as ApiResult<{
        assignmentCount: number;
        judgeCount: number;
        submissionCount: number;
        perJudge: Record<string, number>;
      }>;
      
      if (!res.ok || !json.ok) {
        setError(!json.ok ? json.error : "Assign failed.");
        return;
      }
      
      const per = Object.entries(json.data.perJudge)
        .map(([id, n]) => `${id.slice(0, 8)}… → ${n} submission(s)`)
        .join(" | ");
        
      setAssignSummary(
        `Assigned ${json.data.assignmentCount} submission(s) across ${json.data.judgeCount} judge(s). ${per}`
      );
      
      await load();
    } catch {
      setError("Network error during auto-assign.");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white px-4 py-10 sm:px-8 overflow-hidden">
      
      {/* ==========================================================================
          PREMIUM BACKGROUND: Diagonal { I H I } + Blueprint Grid
          ========================================================================== */}
      <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
        {/* Subtle Dark Blueprint Grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse at center, black 20%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 20%, transparent 85%)",
          }}
        />

        {/* Diagonal Giant { I H I } Background */}
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 -rotate-12 items-center gap-6 opacity-[0.06]">
          <span className="font-display text-[16rem] md:text-[22rem] font-black text-gray-500">
            {"{"}
          </span>
          <span
            className="font-display text-[18rem] md:text-[28rem] font-black tracking-tighter"
            style={{ color: "#E4574C" }} /* Brand Red */
          >
            I
          </span>
          <span
            className="font-display text-[18rem] md:text-[28rem] font-black tracking-tighter"
            style={{ color: "#2FB67C" }} /* Brand Green */
          >
            H
          </span>
          <span
            className="font-display text-[18rem] md:text-[28rem] font-black tracking-tighter"
            style={{ color: "#3E6FF3" }} /* Brand Blue */
          >
            I
          </span>
          <span className="font-display text-[16rem] md:text-[22rem] font-black text-gray-500">
            {"}"}
          </span>
        </div>
      </div>

      {/* ==========================================================================
          FOREGROUND UI
          ========================================================================== */}
      <div className="relative z-10 mx-auto max-w-5xl space-y-6">
        
        {/* Page Header (Glassmorphism) */}
        <header className="flex flex-col gap-4 border-b border-gray-800 pb-6 sm:flex-row sm:items-end sm:justify-between rounded-2xl bg-black/40 backdrop-blur-md p-6 border">
          <div>
            <p className="font-body text-[10px] font-semibold uppercase tracking-widest text-gray-500">
              Judging · {eventId}
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-white">
              Judges & assignments
            </h1>
            <p className="mt-2 max-w-xl font-body text-sm text-gray-400">
              Invite judges by email, then distribute submissions evenly across your active roster.
            </p>
          </div>
          <Link href={`/events/${eventId}/judging/rubric`}>
            <button className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-700 bg-black/50 px-4 font-body text-xs font-bold uppercase tracking-wider text-white transition-colors hover:border-gray-500 hover:bg-gray-800">
              Rubric builder
            </button>
          </Link>
        </header>

        {/* Alerts */}
        {error && (
          <div role="alert" className="rounded-md border border-red-900/30 bg-red-900/10 px-4 py-3 font-body text-sm text-red-400 flex items-center gap-2 backdrop-blur-md">
            <span aria-hidden="true">⚠️</span>
            {error}
          </div>
        )}
        {assignSummary && (
          <div role="status" className="rounded-md border border-gold/30 bg-gold/10 px-4 py-3 font-body text-sm text-gold-light flex items-start gap-2 backdrop-blur-md">
            <span aria-hidden="true" className="mt-0.5">✨</span>
            <p>{assignSummary}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Invite Form (Glassmorphism) */}
          <div className="overflow-hidden rounded-xl border border-gray-700 bg-gray-900/60 backdrop-blur-md shadow-sm">
            <div className="border-b border-gray-800 p-5 bg-black/40">
              <h3 className="font-display text-lg font-bold text-white">
                Invite Judges
              </h3>
              <p className="mt-1 font-body text-sm text-gray-400">
                Send secure magic links. One email per line or comma-separated.
              </p>
            </div>
            <div className="p-5 flex flex-col h-full">
              <textarea
                className={clsx(
                  "min-h-[120px] w-full resize-y rounded-lg border bg-black/80 p-3",
                  "font-body text-sm text-white placeholder:text-gray-600",
                  "border-gray-700 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30",
                  "transition-shadow duration-200"
                )}
                placeholder={"judge1@university.edu\njudge2@university.edu"}
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
              />
              <button
                type="button"
                disabled={inviting}
                onClick={handleInvite}
                className="mt-4 inline-flex h-10 w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-gold px-6 font-body text-sm font-bold uppercase tracking-wider text-black transition-all duration-200 hover:-translate-y-px hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 self-start"
              >
                {inviting ? "Sending..." : "Send invites"}
              </button>
            </div>
          </div>

          {/* Auto Assign Card (Glassmorphism) */}
          <div className="overflow-hidden rounded-xl border border-gray-700 bg-gray-900/60 backdrop-blur-md shadow-sm flex flex-col justify-between">
            <div className="p-5">
              <h3 className="font-display text-lg font-bold text-white">
                Auto-assign (round-robin)
              </h3>
              <p className="mt-2 font-body text-sm text-gray-400 leading-relaxed">
                Distributes all event submissions evenly across judges who have accounts. 
                Replaces previous assignments for this event. 
                <br /><br />
                <em className="text-gray-500">Note: COI & Track matching are disabled in MVP.</em>
              </p>
            </div>
            <div className="border-t border-gray-800 bg-black/40 p-5">
              <button
                type="button"
                disabled={assigning}
                onClick={handleAutoAssign}
                className="inline-flex h-10 w-full sm:w-auto items-center justify-center gap-2 rounded-md border border-gold/40 bg-transparent text-gold-light px-6 font-body text-sm font-bold uppercase tracking-wider transition-all duration-200 hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-60 self-start"
              >
                {assigning ? "Assigning..." : "Run auto-assign"}
              </button>
            </div>
          </div>
        </div>

        {/* Invited Judges Table (Glassmorphism) */}
        <Card padding="none" variant="elevated" className="overflow-hidden border-gray-800 bg-gray-900/60 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-gray-800 bg-black/40 p-4">
            <h2 className="font-display text-base font-semibold text-white">
              Invited judges
            </h2>
            <span className="font-mono text-xs text-gray-500">Live roster</span>
          </div>
          
          {loading ? (
            <p className="p-6 font-body text-sm text-gray-500 text-center animate-pulse">Loading roster…</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800 hover:bg-transparent">
                    <TableHead className="text-gray-500 font-semibold">Email</TableHead>
                    <TableHead className="text-gray-500 font-semibold">Status</TableHead>
                    <TableHead className="text-gray-500 font-semibold text-right">Invited At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invites.length === 0 ? (
                    <TableEmpty colSpan={3} message="No invites yet." className="text-gray-500" />
                  ) : (
                    invites.map((inv) => (
                      <TableRow key={inv.id} className="border-gray-800 hover:bg-black/30">
                        <TableCell className="font-body text-sm text-white">{inv.email}</TableCell>
                        <TableCell>
                          <span className="inline-flex rounded-full border border-gray-700 bg-black/60 px-2 py-0.5 font-mono text-[10px] uppercase text-gray-400">
                            {inv.status}
                          </span>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-gray-500 text-right">
                          {new Date(inv.created_at).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>

        {/* Assignments Table (Glassmorphism) */}
        <Card padding="none" variant="elevated" className="overflow-hidden border-gray-800 bg-gray-900/60 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-gray-800 bg-black/40 p-4">
            <h2 className="font-display text-base font-semibold text-white">
              Current assignments
            </h2>
            <span className="font-mono text-xs text-gray-500">{assignments.length} total</span>
          </div>
          
          {loading ? (
            <p className="p-6 font-body text-sm text-gray-500 text-center animate-pulse">Loading assignments…</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800 hover:bg-transparent">
                    <TableHead className="text-gray-500 font-semibold">Judge User ID</TableHead>
                    <TableHead className="text-gray-500 font-semibold">Submission ID</TableHead>
                    <TableHead className="text-gray-500 font-semibold text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.length === 0 ? (
                    <TableEmpty colSpan={3} message="No assignments yet." className="text-gray-500" />
                  ) : (
                    assignments.map((a) => (
                      <TableRow key={a.id} className="border-gray-800 hover:bg-black/30">
                        <TableCell className="font-mono text-xs text-gold-light">{a.judge_user_id.slice(0, 12)}…</TableCell>
                        <TableCell className="font-mono text-xs text-gray-400">{a.submission_id?.slice(0, 12)}…</TableCell>
                        <TableCell className="text-right">
                          <span className={clsx(
                            "inline-flex rounded-full px-2 py-0.5 font-mono text-[10px] uppercase backdrop-blur-md",
                            a.status === "completed" ? "bg-gold/10 text-gold-light border border-gold/30" : "bg-black/60 border border-gray-700 text-gray-400"
                          )}>
                            {a.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>

      </div>
    </div>
  );
}