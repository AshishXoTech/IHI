# IHI Project Context

## What IHI is

IHI is an event and hackathon operating system. It helps organizers run an event from setup through published results, while participants register, form teams, submit projects, and judges evaluate submissions.

The main product workflow is:

1. An organizer creates and publishes an event.
2. Participants visit the public event page and register.
3. Participants create or join teams, or enter the "looking for team" pool.
4. Teams submit a project before the deadline.
5. Organizers configure judging rubrics and invite or assign judges.
6. Judges review submissions and create scores.
7. Scores are append-only; correction requests are reviewed by organizers.
8. Organizers publish results.
9. The AI service creates a repository briefing with detected technology and duplicate-risk heuristics.

## Repository structure

```text
IHI/
├── frontend/                         # Main Next.js web application
│   ├── src/
│   │   ├── app/                      # App Router pages and API route handlers
│   │   │   ├── (auth)/               # Login, signup, judge login
│   │   │   ├── (organizer)/          # Organizer dashboard and event management
│   │   │   ├── (participant)/        # Team, submission, and participant results
│   │   │   ├── api/                  # Server-side REST-style route handlers
│   │   │   ├── events/[id]/          # Public event detail and registration pages
│   │   │   ├── judge/                 # Judge queue and score workspace
│   │   │   ├── auth/callback/         # Auth callback route
│   │   │   ├── page.tsx               # Public landing page
│   │   │   ├── layout.tsx             # Root layout/providers
│   │   │   └── globals.css            # Global design tokens and Tailwind styles
│   │   ├── components/                # Reusable UI and feature components
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── judging/
│   │   │   ├── landing/
│   │   │   ├── layout/
│   │   │   ├── motion/
│   │   │   ├── providers/
│   │   │   ├── submissions/
│   │   │   ├── teams/
│   │   │   └── ui/
│   │   ├── lib/
│   │   │   ├── auth/                  # JWT, cookies, password, roles, magic links
│   │   │   ├── supabase/              # Browser and server Supabase clients
│   │   │   ├── landing/               # Landing-page content
│   │   │   └── mocks/                 # Temporary local/mock data
│   │   ├── types/shared.ts            # Shared TypeScript types
│   │   └── middleware.ts              # Edge auth and role-based route protection
│   ├── public/                        # Static assets
│   ├── package.json                   # Frontend scripts and dependencies
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env.local                     # Local secrets; never commit
├── backend-ai/                        # Separate Python AI briefing service
│   ├── app/main.py                   # FastAPI application
│   ├── requirements.txt
│   └── .env                           # AI provider keys; never commit
├── supabase/
│   └── migrations/                    # PostgreSQL schema, RLS, RPCs
│       ├── 20260101000000_dev1_initial_schema.sql
│       └── 20260101000001_team_rpc_and_ai_briefing.sql
├── .vscode/settings.json              # Editor lint settings
├── .gitignore
└── IHI_CONTEXT.md                     # This document
```

Generated or local-only directories such as `frontend/node_modules`, `frontend/.next`, `backend-ai/.venv`, and Supabase `.temp` files are not application source code.

## Technology stack

- **Frontend:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS.
- **UI:** Reusable components in `src/components/ui`, motion components, GSAP, Framer Motion, Lenis, and Lucide icons.
- **Data/auth platform:** Supabase PostgreSQL and Supabase server/browser clients.
- **Application auth:** Application-issued JWT sessions stored in an HTTP-only cookie named `ihi_session` by default. Passwords use `bcryptjs`; JWT signing/verification uses `jose`.
- **Edge middleware:** `src/middleware.ts` must stay Edge-compatible. It may use `jose`, `NextRequest`, and `NextResponse`, but must not import `next/headers`, bcrypt, or the server Supabase client.
- **AI service:** FastAPI + `httpx`; reads public GitHub metadata, README, and `package.json`, then uses Gemini or Groq when configured, with a deterministic fallback.
- **Database:** Supabase PostgreSQL with Row Level Security, event/team/submission/judging tables, audit logs, and an atomic `join_team` RPC.

## Main user roles

- **Organizer:** Creates events, manages registrations and teams, configures rubrics, assigns judges, reviews audit data, and publishes results.
- **Participant:** Registers for events, creates or joins teams, chats with teammates, submits a project, and views results.
- **Judge:** Uses a magic link, receives event-scoped access, reviews the judging queue, and submits rubric scores.
- **Admin:** Exists in the database role model but is not yet a primary UI workflow.

## Important route behavior

Public routes include `/`, `/login`, `/signup`, `/judge-login`, `/events/[id]`, `/events/[id]/register`, auth callbacks, and auth API routes.

Protected route groups include:

- `/dashboard` and organizer event subroutes: organizer only.
- `/team`, `/submit`, and participant results: participant or organizer.
- `/judge`: judge only and requires an event-scoped judge session.

The middleware uses `AUTH_COOKIE_NAME` from the environment and falls back to `ihi_session`. `JWT_SECRET`, issuer, and audience must match the values used by `src/lib/auth/jwt.ts`.

## Important database concepts

- `events` controls the event lifecycle and deadlines.
- `registrations` connects users to events.
- `teams`, `team_members`, `team_messages`, and `looking_for_team` support collaboration.
- `submissions` stores team project submissions.
- `rubrics` and `rubric_criteria` define judging.
- `judge_invites` and `judge_assignments` control judge access and workload.
- `scores` are intended to be append-only/immutable.
- `correction_requests` support controlled score corrections.
- `audit_log` records important actions.
- `ai_briefings` stores AI-generated repository analysis.

## Local development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend normally runs at `http://localhost:3000`.

Useful checks:

```bash
npm run build
npx tsc --noEmit
```

### AI service

```bash
cd backend-ai
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The AI health endpoint is `http://localhost:8000/health`. The frontend calls `/analyze-repo` through `AI_BACKEND_URL`, defaulting to `http://127.0.0.1:8000`.

### Database

Supabase migrations live in `supabase/migrations`. Apply them through the Supabase CLI or the linked Supabase project. Do not put credentials or generated local connection data in source control.

## Development rules for future changes

1. Inspect the existing route, component, helper, and migration before editing.
2. Keep organizer, participant, and judge authorization checks consistent in both middleware and API handlers.
3. Keep middleware Edge-safe; server-only auth helpers belong in route handlers or server components.
4. Use existing Supabase clients and auth helpers instead of creating duplicate database/auth access patterns.
5. Validate request bodies with the existing Zod schemas where available.
6. Preserve the append-only score and audit-log design.
7. Make targeted changes, avoid touching unrelated dirty files, and run the smallest relevant TypeScript/build check.
8. Never commit `.env.local`, backend `.env`, secrets, `node_modules`, `.next`, or `.venv`.

## Current implementation notes

The project is actively being built. Some UI surfaces still contain mock data or development fallbacks when Supabase is unavailable. Treat those fallbacks as local-development behavior, not as the final production authorization model.
