import { NextRequest, NextResponse } from 'next/server';

const BACKEND =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.BACKEND_URL ||
  'http://localhost:8000/api';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await context.params;
  const auth = req.headers.get('authorization');

  try {
    const res = await fetch(
      `${BACKEND}/organizer/events/${eventId}/submissions`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(auth ? { Authorization: auth } : {}),
        },
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      // Bubble real backend errors
      const errText = await res.text();
      return NextResponse.json(
        { error: errText || 'Failed to load submissions' },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(normalizePayload(eventId, data));
  } catch (e) {
    console.error('[submissions GET]', e);
    return NextResponse.json(
      {
        error:
          'Backend unreachable. Start your API server or check NEXT_PUBLIC_API_URL.',
      },
      { status: 503 }
    );
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await context.params;
  const auth = req.headers.get('authorization');
  const body = await req.json().catch(() => ({}));
  const action = body?.action || 'lock';

  try {
    const res = await fetch(
      `${BACKEND}/organizer/events/${eventId}/submissions/${action}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(auth ? { Authorization: auth } : {}),
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: errText || 'Action failed' },
        { status: res.status }
      );
    }

    const data = await res.json().catch(() => ({ ok: true }));
    return NextResponse.json(data);
  } catch (e) {
    console.error('[submissions POST]', e);
    return NextResponse.json(
      { error: 'Backend unreachable' },
      { status: 503 }
    );
  }
}

/** Accept either our shape or a raw list from backend */
function normalizePayload(eventId: string, raw: any) {
  if (raw?.submissions && raw?.stats) {
    return {
      eventId: raw.eventId || eventId,
      deadlineAt: raw.deadlineAt ?? raw.deadline_at ?? null,
      stats: raw.stats,
      submissions: (raw.submissions as any[]).map(mapRow),
    };
  }

  // Backend returned a plain array of submissions + separate teams count
  const list = Array.isArray(raw) ? raw : raw?.items || raw?.data || [];
  const rows = list.map(mapRow);

  const submitted = rows.filter((r: any) => r.status === 'submitted').length;
  const drafts = rows.filter((r: any) => r.status === 'draft').length;
  const missing = rows.filter((r: any) => r.status === 'missing').length;

  return {
    eventId,
    deadlineAt: raw?.deadlineAt ?? raw?.deadline_at ?? null,
    stats: {
      totalTeams: raw?.totalTeams ?? rows.length,
      submitted,
      drafts,
      missing,
    },
    submissions: rows,
  };
}

function mapRow(s: any) {
  const statusRaw = String(s.status || s.submission_status || 'missing').toLowerCase();
  let status: 'submitted' | 'draft' | 'missing' = 'missing';
  if (['submitted', 'final', 'complete', 'locked'].includes(statusRaw)) {
    status = 'submitted';
  } else if (['draft', 'in_progress', 'saved'].includes(statusRaw)) {
    status = 'draft';
  }

  return {
    id: String(s.id || s.submission_id || s.team_id),
    teamId: String(s.teamId || s.team_id || ''),
    teamName: s.teamName || s.team_name || s.name || 'Untitled team',
    track: s.track || s.track_name || undefined,
    status,
    repoUrl: s.repoUrl || s.repo_url || s.github_url || null,
    demoUrl: s.demoUrl || s.demo_url || null,
    title: s.title || s.project_title || null,
    lastSavedAt: s.lastSavedAt || s.last_saved_at || s.updated_at || null,
    submittedAt: s.submittedAt || s.submitted_at || null,
  };
}