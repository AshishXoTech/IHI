import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Fetch active event deadline
    const { data: eventRow } = await supabase
      .from("events")
      .select("ends_at, status")
      .in("status", ["published", "registration_open", "team_formation", "live"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const endsAt = eventRow?.ends_at || new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();

    return NextResponse.json({
      ok: true,
      server_time: new Date().toISOString(),
      ends_at: endsAt,
      status: eventRow?.status || "live",
    });
  } catch (err: any) {
    // Fallback: 7 days in future
    return NextResponse.json({
      ok: true,
      server_time: new Date().toISOString(),
      ends_at: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      status: "live",
    });
  }
}