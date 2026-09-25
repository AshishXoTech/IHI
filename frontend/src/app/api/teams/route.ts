import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getMockStore,
  MOCK_EVENT_ID,
  MOCK_USER_ID,
  MOCK_USER_NAME,
} from "@/lib/mocks/teams";
import type { Team, ApiResult } from "@/types/shared";

// ─────────────────────────────────────────────────────────────
// MOCKS ARE OFF BY DEFAULT.
// Only enable with USE_MOCKS=true in .env.local
// ─────────────────────────────────────────────────────────────
const USE_MOCKS = process.env.USE_MOCKS === "true";

export async function GET(req: NextRequest) {
  try {
    const eventId = req.nextUrl.searchParams.get("event_id");

    // ── Mock path (explicit opt-in only) ──────────────────────
    if (USE_MOCKS) {
      const { teams } = getMockStore();
      const data = eventId
        ? teams.filter((t) => t.event_id === eventId || eventId === MOCK_EVENT_ID)
        : teams;
      return NextResponse.json({ ok: true, data } satisfies ApiResult<Team[]>);
    }

    // ── Live Supabase path ────────────────────────────────────
    const supabase = await createClient();

    let query = supabase
      .from("teams")
      .select(
        `
        id,
        event_id,
        name,
        description,
        skills_wanted,
        skills_needed,
        track,
        max_members,
        max_size,
        status,
        lead_user_id,
        created_by,
        is_locked,
        created_at,
        team_members(count)
      `
      )
      .order("created_at", { ascending: true });

    if (eventId) {
      query = query.eq("event_id", eventId);
    }

    const { data, error } = await query;

    if (error) {
      // Graceful fallback if some columns don't exist yet
      const { data: fallback, error: fallbackError } = await supabase
        .from("teams")
        .select("*, team_members(count)")
        .order("created_at", { ascending: true });

      if (fallbackError) {
        return NextResponse.json(
          { ok: false, error: fallbackError.message } satisfies ApiResult<never>,
          { status: 500 }
        );
      }

      const mappedFallback: Team[] = (fallback ?? []).map((row: any) => ({
        id: row.id,
        event_id: row.event_id,
        name: row.name,
        description: row.description ?? null,
        skills_wanted: row.skills_wanted ?? row.skills_needed ?? [],
        track: row.track ?? null,
        max_members: row.max_members ?? row.max_size ?? 4,
        status: row.status ?? (row.is_locked ? "locked" : "forming"),
        lead_user_id: row.lead_user_id ?? row.created_by ?? "",
        member_count: row.team_members?.[0]?.count ?? 0,
        created_at: row.created_at,
      }));

      return NextResponse.json({
        ok: true,
        data: mappedFallback,
      } satisfies ApiResult<Team[]>);
    }

    const mapped: Team[] = (data ?? []).map((row: any) => ({
      id: row.id,
      event_id: row.event_id,
      name: row.name,
      description: row.description ?? null,
      skills_wanted: row.skills_wanted ?? row.skills_needed ?? [],
      track: row.track ?? null,
      max_members: row.max_members ?? row.max_size ?? 4,
      status: row.status ?? (row.is_locked ? "locked" : "forming"),
      lead_user_id: row.lead_user_id ?? row.created_by ?? "",
      member_count: row.team_members?.[0]?.count ?? 0,
      created_at: row.created_at,
    }));

    return NextResponse.json({ ok: true, data: mapped } satisfies ApiResult<Team[]>);
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body?.name?.trim()) {
      return NextResponse.json(
        {
          ok: false,
          error: "Team name is required",
          code: "validation",
        } satisfies ApiResult<never>,
        { status: 400 }
      );
    }

    const name = String(body.name).trim();
    if (name.length > 48) {
      return NextResponse.json(
        {
          ok: false,
          error: "Name too long (max 48 characters)",
          code: "validation",
        } satisfies ApiResult<never>,
        { status: 400 }
      );
    }

    const maxMembers = Number(body.max_members ?? body.max_size ?? 4);
    if (maxMembers < 1 || maxMembers > 10) {
      return NextResponse.json(
        {
          ok: false,
          error: "max_members must be between 1 and 10",
          code: "validation",
        } satisfies ApiResult<never>,
        { status: 400 }
      );
    }

    const skills =
      body.skills_wanted ?? body.skills_needed ?? body.skills ?? [];

    // ── Mock path (explicit opt-in only) ──────────────────────
    if (USE_MOCKS) {
      const store = getMockStore();
      const onTeam = Object.values(store.members).some((list) =>
        list.some((m) => m.user_id === MOCK_USER_ID)
      );
      if (onTeam) {
        return NextResponse.json(
          {
            ok: false,
            error: "Already on a team",
            code: "already_on_team",
          } satisfies ApiResult<never>,
          { status: 409 }
        );
      }
      if (
        store.teams.some(
          (t) =>
            t.event_id === (body.event_id || MOCK_EVENT_ID) &&
            t.name.toLowerCase() === name.toLowerCase()
        )
      ) {
        return NextResponse.json(
          {
            ok: false,
            error: "Duplicate team name",
            code: "duplicate_name",
          } satisfies ApiResult<never>,
          { status: 409 }
        );
      }

      const id = `t_${Date.now()}`;
      const team: Team = {
        id,
        event_id: body.event_id || MOCK_EVENT_ID,
        name,
        description: body.description ?? null,
        skills_wanted: Array.isArray(skills) ? skills : [],
        track: body.track ?? null,
        max_members: maxMembers,
        status: "forming",
        lead_user_id: MOCK_USER_ID,
        member_count: 1,
        created_at: new Date().toISOString(),
      };
      store.setTeams([...store.teams, team]);
      store.setMembers({
        ...store.members,
        [id]: [
          {
            id: `m_${Date.now()}`,
            team_id: id,
            user_id: MOCK_USER_ID,
            role: "lead",
            display_name: MOCK_USER_NAME,
            skills: [],
            joined_at: team.created_at,
          },
        ],
      });
      store.setSolo(store.solo.filter((s) => s.user_id !== MOCK_USER_ID));

      return NextResponse.json(
        { ok: true, data: team } satisfies ApiResult<Team>,
        { status: 201 }
      );
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

    // Resolve event_id: body → first published event → first any event
    let eventId: string | null = body.event_id ?? null;
    if (!eventId) {
      const { data: published } = await supabase
        .from("events")
        .select("id")
        .in("status", ["published", "registration_open", "team_formation", "live"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      eventId = published?.id ?? null;
    }
    if (!eventId) {
      const { data: anyEvent } = await supabase
        .from("events")
        .select("id")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      eventId = anyEvent?.id ?? null;
    }

    if (!eventId) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "No event found. Create and publish an event first, then create a team.",
          code: "validation",
        } satisfies ApiResult<never>,
        { status: 400 }
      );
    }

    // Block if already on a team for this event
    const { data: existing } = await supabase
      .from("team_members")
      .select("id, teams!inner(event_id)")
      .eq("user_id", user.id)
      .eq("teams.event_id", eventId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        {
          ok: false,
          error: "You are already on a team for this event",
          code: "already_on_team",
        } satisfies ApiResult<never>,
        { status: 409 }
      );
    }

    // Insert team — try primary schema first, then alternate column names
    let team: any = null;
    let insertError: any = null;

    // Attempt A: original Dev B schema columns
    const attemptA = await supabase
      .from("teams")
      .insert({
        event_id: eventId,
        name,
        description: body.description ?? null,
        skills_wanted: Array.isArray(skills) ? skills : [],
        track: body.track ?? null,
        max_members: maxMembers,
        status: "forming",
        lead_user_id: user.id,
      })
      .select()
      .single();

    if (!attemptA.error && attemptA.data) {
      team = attemptA.data;
    } else {
      insertError = attemptA.error;

      // Attempt B: migration schema columns (skills_needed / max_size / created_by)
      const attemptB = await supabase
        .from("teams")
        .insert({
          event_id: eventId,
          name,
          description: body.description ?? null,
          skills_needed: Array.isArray(skills) ? skills : [],
          max_size: maxMembers,
          is_locked: false,
          created_by: user.id,
        })
        .select()
        .single();

      if (!attemptB.error && attemptB.data) {
        team = attemptB.data;
        insertError = null;
      } else {
        insertError = attemptB.error || insertError;
      }
    }

    if (!team) {
      if (insertError?.code === "23505") {
        return NextResponse.json(
          {
            ok: false,
            error: "A team with this name already exists for this event",
            code: "duplicate_name",
          } satisfies ApiResult<never>,
          { status: 409 }
        );
      }
      return NextResponse.json(
        {
          ok: false,
          error: insertError?.message || "Failed to create team",
        } satisfies ApiResult<never>,
        { status: 500 }
      );
    }

    // Add creator as lead/leader
    const { error: memErr } = await supabase.from("team_members").insert({
      team_id: team.id,
      user_id: user.id,
      role: "lead",
    });

    // If "lead" check constraint fails, retry as "leader"
    if (memErr) {
      const { error: memErr2 } = await supabase.from("team_members").insert({
        team_id: team.id,
        user_id: user.id,
        role: "leader",
      });
      if (memErr2) {
        await supabase.from("teams").delete().eq("id", team.id);
        return NextResponse.json(
          { ok: false, error: memErr2.message } satisfies ApiResult<never>,
          { status: 500 }
        );
      }
    }

    // Remove from looking_for_team pool if present
    await supabase
      .from("looking_for_team")
      .delete()
      .eq("event_id", eventId)
      .eq("user_id", user.id);

    const result: Team = {
      id: team.id,
      event_id: team.event_id,
      name: team.name,
      description: team.description ?? null,
      skills_wanted: team.skills_wanted ?? team.skills_needed ?? [],
      track: team.track ?? null,
      max_members: team.max_members ?? team.max_size ?? maxMembers,
      status: team.status ?? "forming",
      lead_user_id: team.lead_user_id ?? team.created_by ?? user.id,
      member_count: 1,
      created_at: team.created_at,
    };

    return NextResponse.json(
      { ok: true, data: result } satisfies ApiResult<Team>,
      { status: 201 }
    );
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