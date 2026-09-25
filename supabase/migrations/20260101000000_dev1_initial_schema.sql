-- ============================================================================
-- IHI OPERATING SYSTEM — COMPLETE FAIL-SAFE SCHEMA
-- Creates public.users + all system tables first, then updates RLS policies.
-- ============================================================================

-- 0. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Core Tables (Tables MUST exist before policies can be dropped/created)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT NOT NULL CHECK (role IN ('organizer', 'judge', 'participant', 'admin')),
  password_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS users_email_idx ON public.users (email);

CREATE TABLE IF NOT EXISTS public.role_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('organizer', 'judge', 'participant', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' 
    CHECK (status IN ('draft', 'published', 'registration_open', 'team_formation', 'live', 'submission_open', 'submission_closed', 'judging', 'results_published')),
  max_team_size INT NOT NULL DEFAULT 4,
  max_participants INT,
  submission_deadline TIMESTAMPTZ,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  registration_fields JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'waitlisted', 'withdrawn')),
  display_name TEXT NOT NULL,
  skills TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  skills_needed TEXT[] DEFAULT '{}',
  max_size INT NOT NULL DEFAULT 4,
  member_count INT NOT NULL DEFAULT 0,
  lead_user_id UUID REFERENCES public.users(id),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'full', 'locked', 'forming')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (event_id, name)
);

CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  fields JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'locked', 'final')),
  submitted_at TIMESTAMPTZ,
  locked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.rubrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE UNIQUE,
  title TEXT NOT NULL DEFAULT 'Main Evaluation Rubric',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.rubric_criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rubric_id UUID NOT NULL REFERENCES public.rubrics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  max_score INT NOT NULL DEFAULT 10 CHECK (max_score > 0),
  weight NUMERIC(5,2) NOT NULL CHECK (weight > 0 AND weight <= 100),
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.judge_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  invited_by UUID REFERENCES public.users(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'revoked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (event_id, email)
);

CREATE TABLE IF NOT EXISTS public.judge_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  judge_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (event_id, judge_user_id, submission_id)
);

CREATE TABLE IF NOT EXISTS public.scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  judge_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  criteria_scores JSONB NOT NULL,
  total_score NUMERIC(5,2) NOT NULL,
  corrects_score_id UUID REFERENCES public.scores(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (submission_id, judge_user_id)
);

CREATE TABLE IF NOT EXISTS public.correction_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  judge_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  original_score_id UUID NOT NULL REFERENCES public.scores(id) ON DELETE CASCADE,
  proposed_criteria_scores JSONB NOT NULL,
  proposed_total_score NUMERIC(5,2) NOT NULL,
  reason TEXT NOT NULL CHECK (char_length(reason) >= 20),
  status TEXT NOT NULL DEFAULT 'pending_organizer_review'
    CHECK (status IN ('pending_organizer_review', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES public.users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Safely Drop Old Policies (Tables are guaranteed to exist now)
DROP POLICY IF EXISTS "Public read events" ON public.events;
DROP POLICY IF EXISTS "Auth manage events" ON public.events;
DROP POLICY IF EXISTS "Public manage events" ON public.events;
DROP POLICY IF EXISTS "Auth manage registrations" ON public.registrations;
DROP POLICY IF EXISTS "Public manage registrations" ON public.registrations;
DROP POLICY IF EXISTS "Auth manage teams" ON public.teams;
DROP POLICY IF EXISTS "Public manage teams" ON public.teams;
DROP POLICY IF EXISTS "Auth manage submissions" ON public.submissions;
DROP POLICY IF EXISTS "Public manage submissions" ON public.submissions;
DROP POLICY IF EXISTS "Auth manage rubrics" ON public.rubrics;
DROP POLICY IF EXISTS "Public manage rubrics" ON public.rubrics;
DROP POLICY IF EXISTS "Auth manage criteria" ON public.rubric_criteria;
DROP POLICY IF EXISTS "Public manage criteria" ON public.rubric_criteria;
DROP POLICY IF EXISTS "Auth manage invites" ON public.judge_invites;
DROP POLICY IF EXISTS "Public manage invites" ON public.judge_invites;
DROP POLICY IF EXISTS "Auth manage assignments" ON public.judge_assignments;
DROP POLICY IF EXISTS "Public manage assignments" ON public.judge_assignments;
DROP POLICY IF EXISTS "Judges read scores" ON public.scores;
DROP POLICY IF EXISTS "Judges insert scores" ON public.scores;
DROP POLICY IF EXISTS "Public manage scores" ON public.scores;
DROP POLICY IF EXISTS "Judges manage corrections" ON public.correction_requests;
DROP POLICY IF EXISTS "Public manage corrections" ON public.correction_requests;
DROP POLICY IF EXISTS "Auth read audit" ON public.audit_log;
DROP POLICY IF EXISTS "Auth insert audit" ON public.audit_log;
DROP POLICY IF EXISTS "Public manage audit" ON public.audit_log;
DROP POLICY IF EXISTS "Public manage users" ON public.users;

-- 3. Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rubrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rubric_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.judge_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.judge_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.correction_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- 4. Create fresh policies
CREATE POLICY "Public manage users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public manage events" ON public.events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public manage registrations" ON public.registrations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public manage teams" ON public.teams FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public manage submissions" ON public.submissions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public manage rubrics" ON public.rubrics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public manage criteria" ON public.rubric_criteria FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public manage invites" ON public.judge_invites FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public manage assignments" ON public.judge_assignments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public manage scores" ON public.scores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public manage corrections" ON public.correction_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public manage audit" ON public.audit_log FOR ALL USING (true) WITH CHECK (true);