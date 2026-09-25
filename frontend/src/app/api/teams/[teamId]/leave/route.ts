import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getMockStore, MOCK_USER_ID } from "@/lib/mocks/teams";
import type { ApiResult } from "@/types/shared";

/**
 * POST /api/teams/[teamId]/leave
 * Removes current user from team, reassigns lead if necessary,
 * and dissolves empty teams.
 */

// Force mocks off by default unless USE_MOCKS=true is set in .env.local
const USE_MOCKS = process.env.USE_MOCKS === "true";

type Ctx = { params: Promise<{ teamId: string }> };

export async function POST(_req: NextRequest, context: Ctx) {
  try {
    const { teamId } = await context.params;

    if (!teamId) {
      return NextResponse.json(
        {
          ok: false,
          error: "Team ID is required",
          code: "validation",
        } satisfies ApiResult<never>,
        { status: 400 }
      );
    }

    // ── Mock path (explicit opt-in only) ──────────────────────
    if (USE_MOCKS) {
      const store = getMockStore();
      const list = store.members[teamId] ?? [];
      const me = list.find((m) => m.user_id === MOCK_USER_ID);
      if (!me) {
        return NextResponse.json(
          {
            ok: false,
            error: "Not a member of this team",
            code: "not_found",
          } satisfies ApiResult<never>,
          { status: 404 }
        );
      }

      let remaining = list.filter((m) => m.user_id !== MOCK_USER_ID);

      if (me.role === "lead" && remaining.length > 0) {
        remaining = remaining
          .sort((a, b) => a.joined_at.localeCompare(b.joined_at))
          .map((m, i) => (i === 0 ? { ...m, role: "lead" as const } : m));
        const newLead = remaining[0];
        store.setTeams(
          store.teams.map((t) =>
            t.id === teamId
              ? {
                  ...t,
                  lead_user_id: newLead.user_id,
                  member_count: remaining.length,
                  status:
                    remaining.length >= t.max_members ? t.status : "forming",
                }
              : t
          )
        );
        store.setMembers({ ...store.members, [teamId]: remaining });
      } else if (remaining.length === 0) {
        store.setTeams(store.teams.filter((t) => t.id !== teamId));
        const { [teamId]: _, ...rest } = store.members;
        store.setMembers(rest);
      } else {
        store.setTeams(
          store.teams.map((t) =>
            t.id === teamId
              ? {
                  ...t,
                  member_count: remaining.length,
                  status:
                    remaining.length < t.max_members && t.status === "full"
                      ? "forming"
                      : t.status,
                }
              : t
          )
        );
        store.setMembers({ ...store.members, [teamId]: remaining });
      }

      return NextResponse.json({ ok: true, data: { left: true } });
    }

    // ── Live Supabase path ────────────────────────────────────
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          error: "Unauthorized — please log in first",
          code: "unauthorized",
        } satisfies ApiResult<never>,
        { status: 401 }
      );
    }

    // 1. Delete membership row for current user
    const { error: deleteError } = await supabase
      .from("team_members")
      .delete()
      .eq("team_id", teamId)
      .eq("user_id", user.id);

    if (deleteError) {
      return NextResponse.json(
        { ok: false, error: deleteError.message } satisfies ApiResult<never>,
        { status: 500 }
      );
    }

    // 2. Count remaining members
    const { count } = await supabase
      .from("team_members")
      .select("id", { count: "exact", head: true })
      .eq("team_id", teamId);

    const remainingCount = count ?? 0;

    if (remainingCount === 0) {
      // Dissolve empty team if no members remain
      await supabase.from("teams").delete().eq("id", teamId);
    } else {
      // Unlock / re-open team if it was full
      try {
        await supabase
          .from("teams")
          .update({
            is_locked: false,
            status: "forming",
          })
          .eq("id", teamId);
      } catch {
        // Fallback for alternate column schemas
        await supabase
          .from("teams")
          .update({ is_locked: false })
          .eq("id", teamId);
      }

      // Check if a leader remains, reassign if leader left
      const { data: leadCheck } = await supabase
        .from("team_members")
        .select("id")
        .eq("team_id", teamId)
        .in("role", ["lead", "leader"])
        .maybeSingle();

      if (!leadCheck) {
        // Promote oldest remaining member
        const { data: oldestMember } = await supabase
          .from("team_members")
          .select("id")
          .eq("team_id", teamId)
          .order("joined_at", { ascending: true })
          .limit(1)
          .maybeSingle();

        if (oldestMember) {
          await supabase
            .from("team_members")
            .update({ role: "lead" })
            .eq("id", oldestMember.id);
        }
      }
    }

    return NextResponse.json({ ok: true, data: { left: true } });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: err?.message || "Internal server error",
      } satisfies ApiResult<never>,
      { status: 500 }
    );
  }
}