import { NextRequest, NextResponse } from "next/server";

const BACKEND =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.BACKEND_URL ||
  "http://localhost:8000/api";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await context.params;
  const auth = request.headers.get("authorization");

  try {
    const response = await fetch(
      `${BACKEND}/organizer/events/${eventId}/submissions/lock`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(auth ? { Authorization: auth } : {}),
        },
        body: JSON.stringify(await request.json().catch(() => ({}))),
      }
    );

    const text = await response.text();
    let data: unknown = { ok: response.ok };
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { ok: response.ok, message: text };
      }
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[submissions lock POST]", error);
    return NextResponse.json(
      { ok: false, error: "Backend unreachable" },
      { status: 503 }
    );
  }
}
