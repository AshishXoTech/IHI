import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth/session";
import { AuthError } from "@/lib/auth/errors";
import { createClient } from "@/lib/supabase/server";
import type { ApiResult, JudgeInvite } from "@/types/shared";
import { signMagicToken, buildMagicUrl } from "@/lib/auth/magic";
import { sendJudgeMagicEmail } from "@/lib/auth/email";

const inviteSchema = z.object({
  eventId: z.string().min(1, "Event ID is required."),
  emails: z
    .array(z.string().trim().email("Please provide valid email addresses."))
    .min(1, "At least one judge email is required."),
  eventName: z.string().trim().min(1, "Event name is required."),
});

const singleInviteSchema = z.object({
  eventId: z.string().min(1, "Event ID is required."),
  email: z.string().trim().email("Please provide a valid email address."),
  eventName: z.string().trim().min(1, "Event name is required."),
});

const IS_UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function resolveEventId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  eventKey: string
) {
  let query = supabase.from("events").select("id");

  query = IS_UUID.test(eventKey)
    ? query.or(`id.eq.${eventKey},slug.eq.${eventKey}`)
    : query.eq("slug", eventKey);

  const { data } = await query.maybeSingle();

  return data?.id ?? (IS_UUID.test(eventKey) ? eventKey : null);
}

function errorResponse(
  error: string,
  code: "validation" | "unauthorized" | "not_found" | "conflict",
  status: number
) {
  return NextResponse.json(
    { ok: false, error, code } satisfies ApiResult<never>,
    { status }
  );
}

export async function GET(request: NextRequest) {
  try {
    await requireRole("organizer");

    const eventKey = request.nextUrl.searchParams.get("eventId");

    if (!eventKey) {
      return errorResponse(
        "eventId is required.",
        "validation",
        400
      );
    }

    const supabase = await createClient();
    const eventId = await resolveEventId(supabase, eventKey);

    if (!eventId) {
      return errorResponse(
        "Event not found.",
        "not_found",
        404
      );
    }

    const { data, error } = await supabase
      .from("judge_invites")
      .select("id, event_id, email, status, created_at")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[api/judging/invites] GET failed:", error);

      return errorResponse(
        "Failed to load judge invites.",
        "conflict",
        500
      );
    }

    return NextResponse.json(
      {
        ok: true,
        data: data ?? [],
      } satisfies ApiResult<JudgeInvite[]>
    );
  } catch (err) {
    if (err instanceof AuthError) {
      return errorResponse(
        err.message,
        "unauthorized",
        err.status
      );
    }

    console.error(
      "[api/judging/invites] GET unexpected error:",
      err
    );

    return errorResponse(
      "Failed to load judge invites.",
      "conflict",
      500
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole("organizer");

    // Keep the authenticated organizer so the invite row records
    // who created the invitation.
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return errorResponse(
        "You must be signed in.",
        "unauthorized",
        401
      );
    }

    const body = await request.json();

    const parsed = Array.isArray(body?.emails)
      ? inviteSchema.safeParse(body)
      : singleInviteSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(
        parsed.error.issues[0]?.message ||
          "Invalid invite payload.",
        "validation",
        400
      );
    }

    const eventId = parsed.data.eventId;
    const eventName = parsed.data.eventName;

    const emails =
      "emails" in parsed.data
        ? parsed.data.emails
        : [parsed.data.email];

    const uniqueEmails = [
      ...new Set(
        emails.map((email) => email.toLowerCase())
      ),
    ];

    const resolvedEventId = await resolveEventId(
      supabase,
      eventId
    );

    if (!resolvedEventId) {
      return errorResponse(
        "Event not found.",
        "not_found",
        404
      );
    }

    const magicResults: Array<{
      email: string;
      magicLinkSent: boolean;
      note?: string;
      devUrl?: string;
    }> = [];

    for (const email of uniqueEmails) {
      const { error: inviteError } = await supabase
        .from("judge_invites")
        .upsert(
          {
            event_id: resolvedEventId,
            email,
            invited_by: user.id,
            status: "pending",
          },
          { onConflict: "event_id,email" }
        );

      if (inviteError) {
        console.error(
          "[api/judging/invites] DB error:",
          inviteError
        );

        magicResults.push({
          email,
          magicLinkSent: false,
          note: "Could not save invite.",
        });

        continue;
      }

      try {
        const magicToken = await signMagicToken({
          email,
          eventId: resolvedEventId,
          purpose: "judge-magic",
        });

        const emailResult = await sendJudgeMagicEmail({
          to: email,
          eventName,
          url: buildMagicUrl(magicToken),
        });

        magicResults.push({
          email,
          magicLinkSent: emailResult.delivered,
          ...(emailResult.devUrl
            ? { devUrl: emailResult.devUrl }
            : {}),
          ...(emailResult.delivered
            ? {}
            : {
                note:
                  "Invite saved; dev magic link generated.",
              }),
        });
      } catch (err) {
        console.error(
          `[api/judging/invites] Email failed for ${email}:`,
          err
        );

        magicResults.push({
          email,
          magicLinkSent: false,
          note:
            "Invite saved, but the magic link could not be sent.",
        });
      }
    }

    return NextResponse.json({
      ok: true,
      data: { magicResults },
    } satisfies ApiResult<{
      magicResults: typeof magicResults;
    }>);
  } catch (err) {
    if (err instanceof AuthError) {
      return errorResponse(
        err.message,
        "unauthorized",
        err.status
      );
    }

    console.error(
      "[api/judging/invites] POST unexpected error:",
      err
    );

    return errorResponse(
      "Failed to create judge invites.",
      "conflict",
      500
    );
  }
}