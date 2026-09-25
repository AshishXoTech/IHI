import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ApiResult, Sponsor } from "@/types/shared";

/**
 * PATCH /api/sponsors/[id]
 * Update status (approve/reject), sponsorship tier, or details.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized", code: "unauthorized" } satisfies ApiResult<never>,
        { status: 401 }
      );
    }

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (body.status !== undefined) updates.status = body.status;
    if (body.sponsorship_type !== undefined) updates.sponsorship_type = body.sponsorship_type;
    if (body.sponsorship_criteria !== undefined) updates.sponsorship_criteria = body.sponsorship_criteria;
    if (body.technologies !== undefined) updates.technologies = body.technologies;

    const { data, error } = await supabase
      .from("sponsors")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message, code: "validation" } satisfies ApiResult<never>,
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, data: data as Sponsor } satisfies ApiResult<Sponsor>);
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message, code: "validation" } satisfies ApiResult<never>,
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/sponsors/[id]
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized", code: "unauthorized" } satisfies ApiResult<never>,
        { status: 401 }
      );
    }

    const { error } = await supabase.from("sponsors").delete().eq("id", id);

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message, code: "validation" } satisfies ApiResult<never>,
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, data: { id } } satisfies ApiResult<{ id: string }>);
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message, code: "validation" } satisfies ApiResult<never>,
      { status: 500 }
    );
  }
}