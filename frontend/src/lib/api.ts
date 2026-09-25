// Base API configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Generic fetch wrapper that automatically handles Auth tokens and JSON parsing.
 */
export async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // Grab token from localStorage (or cookies if you use HTTP-only cookies)
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    cache: 'no-store',
  });

  if (!response.ok) {
    let detail = `${response.status} ${response.statusText}`;
    try {
      const body = await response.json();
      if (body?.error || body?.detail || body?.message) {
        detail = body.error || body.detail || body.message;
      }
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(`API Error: ${detail}`);
  }

  // Empty responses (204)
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

/**
 * Dashboard specific API calls (existing — do not remove)
 */
export const dashboardAPI = {
  // Fetch main dashboard metrics
  getMetrics: () => fetchAPI('/organizer/dashboard-metrics'),

  // Trigger AI judge assignment
  assignJudges: (trackId: string, count: number) =>
    fetchAPI('/organizer/assign-judges', {
      method: 'POST',
      body: JSON.stringify({ trackId, count }),
    }),

  // Export data
  exportData: () => fetchAPI('/organizer/export', { method: 'POST' }),
};

/* =========================================================================
 * Submissions — real participant data
 * ========================================================================= */

export type SubmissionStatus = 'submitted' | 'draft' | 'missing';

export interface SubmissionRow {
  id: string;
  teamId: string;
  teamName: string;
  track?: string;
  status: SubmissionStatus;
  repoUrl?: string | null;
  demoUrl?: string | null;
  title?: string | null;
  lastSavedAt?: string | null;
  submittedAt?: string | null;
}

export interface SubmissionsPayload {
  eventId: string;
  deadlineAt: string | null; // ISO string from backend
  stats: {
    totalTeams: number;
    submitted: number;
    drafts: number;
    missing: number;
  };
  submissions: SubmissionRow[];
}

/**
 * Normalize backend shapes (camelCase or snake_case) into SubmissionsPayload
 */
function normalizeSubmissionsPayload(eventId: string, raw: any): SubmissionsPayload {
  // Already in preferred shape
  if (raw?.submissions && raw?.stats) {
    return {
      eventId: String(raw.eventId || raw.event_id || eventId),
      deadlineAt: raw.deadlineAt ?? raw.deadline_at ?? null,
      stats: {
        totalTeams: Number(raw.stats.totalTeams ?? raw.stats.total_teams ?? 0),
        submitted: Number(raw.stats.submitted ?? 0),
        drafts: Number(raw.stats.drafts ?? 0),
        missing: Number(raw.stats.missing ?? 0),
      },
      submissions: (raw.submissions as any[]).map(mapSubmissionRow),
    };
  }

  // Plain array or { items / data }
  const list: any[] = Array.isArray(raw)
    ? raw
    : raw?.items || raw?.data || raw?.results || [];

  const submissions = list.map(mapSubmissionRow);
  const submitted = submissions.filter((r) => r.status === 'submitted').length;
  const drafts = submissions.filter((r) => r.status === 'draft').length;
  const missing = submissions.filter((r) => r.status === 'missing').length;

  return {
    eventId: String(raw?.eventId || raw?.event_id || eventId),
    deadlineAt: raw?.deadlineAt ?? raw?.deadline_at ?? null,
    stats: {
      totalTeams: Number(raw?.totalTeams ?? raw?.total_teams ?? submissions.length),
      submitted,
      drafts,
      missing,
    },
    submissions,
  };
}

function mapSubmissionRow(s: any): SubmissionRow {
  const statusRaw = String(
    s.status || s.submission_status || s.state || 'missing'
  ).toLowerCase();

  let status: SubmissionStatus = 'missing';
  if (['submitted', 'final', 'complete', 'locked', 'done'].includes(statusRaw)) {
    status = 'submitted';
  } else if (['draft', 'in_progress', 'saved', 'pending'].includes(statusRaw)) {
    status = 'draft';
  }

  return {
    id: String(s.id || s.submission_id || s.team_id || cryptoRandom()),
    teamId: String(s.teamId || s.team_id || ''),
    teamName: s.teamName || s.team_name || s.name || 'Untitled team',
    track: s.track || s.track_name || undefined,
    status,
    repoUrl: s.repoUrl || s.repo_url || s.github_url || s.repository || null,
    demoUrl: s.demoUrl || s.demo_url || s.live_url || null,
    title: s.title || s.project_title || s.projectName || null,
    lastSavedAt: s.lastSavedAt || s.last_saved_at || s.updated_at || null,
    submittedAt: s.submittedAt || s.submitted_at || null,
  };
}

function cryptoRandom() {
  return `tmp_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Submissions API — used by SubmissionsClient
 * Tries same-origin BFF first, then direct backend.
 */
export const submissionsAPI = {
  /**
   * GET live submissions for an event (real participant data only)
   */
  get: async (eventId: string): Promise<SubmissionsPayload> => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    // 1) Prefer Next.js BFF (no CORS): /api/organizer/events/:id/submissions
    try {
      const bff = await fetch(`/api/organizer/events/${eventId}/submissions`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: 'no-store',
      });

      if (bff.ok) {
        const raw = await bff.json();
        return normalizeSubmissionsPayload(eventId, raw);
      }
    } catch {
      // BFF missing — fall through to direct backend
    }

    // 2) Direct backend
    const raw = await fetchAPI<any>(`/organizer/events/${eventId}/submissions`);
    return normalizeSubmissionsPayload(eventId, raw);
  },

  /**
   * Lock submissions for an event (participants can no longer edit)
   */
  lock: async (eventId: string): Promise<{ ok?: boolean }> => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    // 1) BFF
    try {
      const bff = await fetch(`/api/organizer/events/${eventId}/submissions/lock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ action: 'lock' }),
      });

      if (bff.ok) {
        return bff.json().catch(() => ({ ok: true }));
      }
    } catch {
      // fall through
    }

    // 2) Direct backend
    return fetchAPI(`/organizer/events/${eventId}/submissions/lock`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  },
};
