import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ApiResult, Sponsor } from "@/types/shared";

/**
 * GET /api/sponsors
 * Query parameters:
 *  - eventId (optional)
 *  - status (optional, default: "approved" for unauthenticated, all for organizers)
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const eventId = req.nextUrl.searchParams.get("eventId");
    const status = req.nextUrl.searchParams.get("status");

    let query = supabase
      .from("sponsors")
      .select("*")
      .order("created_at", { ascending: false });

    if (eventId) {
      query = query.eq("event_id", eventId);
    }

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message, code: "validation" } satisfies ApiResult<never>,
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      data: data as Sponsor[],
    } satisfies ApiResult<Sponsor[]>);
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message || "Failed to fetch sponsors", code: "validation" } satisfies ApiResult<never>,
      { status: 500 }
    );
  }
}

/**
 * POST /api/sponsors
 * Public or organizer endpoint to register a sponsor company.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      companyName,
      industry,
      website,
      linkedinCompanyPage,
      technologies = [],
      sponsorshipType = "Platinum",
      sponsorshipCriteria = "",
      contactEmail,
      eventId = null,
    } = body;

    if (!companyName?.trim() || !industry?.trim() || !website?.trim() || !contactEmail?.trim()) {
      return NextResponse.json(
        {
          ok: false,
          error: "Company name, industry, website, and contact email are required.",
          code: "validation",
        } satisfies ApiResult<never>,
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const newSponsor = {
      event_id: eventId || null,
      company_name: companyName.trim(),
      industry: industry.trim(),
      website: website.trim(),
      linkedin_company_page: linkedinCompanyPage?.trim() || null,
      technologies: Array.isArray(technologies) ? technologies : [],
      sponsorship_type: sponsorshipType.trim(),
      sponsorship_criteria: sponsorshipCriteria.trim() || null,
      contact_email: contactEmail.trim().toLowerCase(),
      status: "approved", // auto-approve so it shows up immediately; organizers can curate via dashboard
    };

    const { data, error } = await supabase
      .from("sponsors")
      .insert([newSponsor])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message, code: "conflict" } satisfies ApiResult<never>,
        { status: 400 }
      );
    }

    return NextResponse.json(
      { ok: true, data: data as Sponsor } satisfies ApiResult<Sponsor>,
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message || "Failed to register sponsor", code: "validation" } satisfies ApiResult<never>,
      { status: 500 }
    );
  }
}