"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import type { TeamChatMessage } from "@/types/shared";
import { clsx } from "clsx";

interface TeamChatProps {
  teamId: string;
  currentUserId: string;
  initialMessages?: TeamChatMessage[];
  className?: string;
}

// Normalizes database row schema (team_messages) to frontend interface (TeamChatMessage)
function normalizeMessage(raw: any): TeamChatMessage {
  return {
    id: raw.id,
    team_id: raw.team_id,
    user_id: raw.user_id || raw.sender_id || "",
    display_name: raw.display_name || raw.sender_name || "Team Member",
    body: raw.body || raw.content || "",
    reported: raw.reported ?? raw.is_flagged ?? false,
    created_at: raw.created_at || new Date().toISOString(),
  };
}

export function TeamChat({
  teamId,
  currentUserId,
  initialMessages = [],
  className,
}: TeamChatProps) {
  const [messages, setMessages] = useState<TeamChatMessage[]>(
    initialMessages.map(normalizeMessage)
  );
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Fetch initial message history if not provided via props
  useEffect(() => {
    let isMounted = true;
    async function loadInitialMessages() {
      if (initialMessages.length > 0) return;
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("team_messages")
          .select("*")
          .eq("team_id", teamId)
          .order("created_at", { ascending: true });

        if (!error && data && isMounted) {
          setMessages(data.map(normalizeMessage));
        } else {
          // Fallback to API endpoint
          const res = await fetch(`/api/teams/${teamId}/messages`);
          if (res.ok) {
            const json = await res.json();
            const list = json.data || json.messages || [];
            if (isMounted) setMessages(list.map(normalizeMessage));
          }
        }
      } catch (err) {
        console.error("Failed to load initial chat history:", err);
      }
    }
    loadInitialMessages();
    return () => {
      isMounted = false;
    };
  }, [teamId, initialMessages]);

  // Realtime subscription for instant multi-user updates
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`team-chat:${teamId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "team_messages",
          filter: `team_id=eq.${teamId}`,
        },
        (payload) => {
          const row = normalizeMessage(payload.new);
          setMessages((prev) => {
            if (prev.some((m) => m.id === row.id)) return prev;
            return [...prev, row];
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "team_chat_messages",
          filter: `team_id=eq.${teamId}`,
        },
        (payload) => {
          const row = normalizeMessage(payload.new);
          setMessages((prev) => {
            if (prev.some((m) => m.id === row.id)) return prev;
            return [...prev, row];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [teamId]);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    const trimmed = body.trim();
    if (!trimmed || sending) return;
    if (trimmed.length > 2000) {
      setError("Message must be 2000 characters or fewer.");
      return;
    }

    setSending(true);
    setError(null);
    try {
      const res = await fetch(`/api/teams/${teamId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: trimmed, content: trimmed }),
      });
      const json = await res.json();
      if (!res.ok || (!json.ok && !json.data)) {
        setError(json.error || "Could not send message.");
        return;
      }

      const newMsg = normalizeMessage(json.data || json.message || json);
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
      setBody("");
    } catch {
      setError("Network error — try again.");
    } finally {
      setSending(false);
    }
  }

  async function handleReport(messageId: string) {
    try {
      await fetch(`/api/teams/${teamId}/messages/${messageId}/report`, {
        method: "POST",
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, reported: true } : m))
      );
    } catch {
      // silent — reporting is best-effort
    }
  }

  return (
    <div
      className={clsx(
        "flex flex-col border border-[var(--border-default)] rounded-lg bg-[var(--surface)] overflow-hidden",
        className
      )}
    >
      <div className="px-3 py-2 border-b border-[var(--border-default)] bg-[var(--surface-bg)] flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          Team Workspace Chat
        </h3>
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="Realtime active" />
      </div>

      <div
        ref={listRef}
        className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 min-h-[220px] max-h-[380px]"
        role="log"
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)] text-center py-12">
            No messages yet. Say hello to your team!
          </p>
        ) : (
          messages.map((m) => {
            const mine = m.user_id === currentUserId;
            return (
              <div
                key={m.id}
                className={clsx(
                  "flex flex-col max-w-[85%]",
                  mine ? "self-end items-end" : "self-start items-start"
                )}
              >
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="text-[11px] font-medium text-[var(--text-secondary)]">
                    {mine ? "You" : m.display_name}
                  </span>
                  <time className="text-[10px] text-[var(--text-muted)]">
                    {new Date(m.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
                <div
                  className={clsx(
                    "rounded-md px-2.5 py-1.5 text-sm leading-relaxed",
                    mine
                      ? "bg-[var(--accent-subtle,#0284c7)] text-white"
                      : "bg-[var(--surface-bg)] text-[var(--text-primary)] border border-[var(--border-default)]"
                  )}
                >
                  {m.reported ? (
                    <span className="italic text-[var(--text-muted)]">
                      Message reported for review
                    </span>
                  ) : (
                    m.body
                  )}
                </div>
                {!mine && !m.reported && (
                  <button
                    type="button"
                    onClick={() => handleReport(m.id)}
                    className="mt-0.5 text-[10px] text-[var(--text-muted)] hover:text-[var(--destructive)] outline-none rounded-sm"
                  >
                    Report
                  </button>
                )}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="flex gap-2 p-2 border-t border-[var(--border-default)]"
      >
        <input
          type="text"
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Message your team…"
          maxLength={2000}
          aria-label="Chat message"
          className="flex-1 rounded-md px-3 py-2 text-sm bg-[var(--surface-bg)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] border border-[var(--border-default)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        />
        <Button type="submit" size="md" loading={sending} disabled={!body.trim()}>
          Send
        </Button>
      </form>

      {error && (
        <p className="px-3 pb-2 text-xs text-rose-500 font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}