-- ============================================================================
-- SPONSORS SCHEMA & SECURITY POLICIES
-- File: supabase/migrations/20260101000003_sponsors_schema.sql
-- ============================================================================

-- 1. Create the Sponsors Table
CREATE TABLE IF NOT EXISTS public.sponsors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    industry TEXT NOT NULL,
    website TEXT NOT NULL,
    linkedin_company_page TEXT,
    technologies TEXT[] DEFAULT '{}',
    sponsorship_type TEXT NOT NULL DEFAULT 'Platinum',
    sponsorship_criteria TEXT,
    contact_email TEXT NOT NULL,
    logo_url TEXT,
    status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create Indices for Performance
CREATE INDEX IF NOT EXISTS idx_sponsors_event_id ON public.sponsors(event_id);
CREATE INDEX IF NOT EXISTS idx_sponsors_status ON public.sponsors(status);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

-- 4. Define Security Policies

-- Policy A: Public visitors can only view sponsors that are 'approved'.
-- Authenticated organizers can view all sponsors (pending, approved, rejected).
DROP POLICY IF EXISTS "Public can view approved sponsors" ON public.sponsors;
CREATE POLICY "Public can view approved sponsors"
ON public.sponsors FOR SELECT
USING (status = 'approved' OR auth.role() = 'authenticated');

-- Policy B: Anyone (even unauthenticated visitors) can submit a new sponsor registration.
DROP POLICY IF EXISTS "Anyone can register as a sponsor" ON public.sponsors;
CREATE POLICY "Anyone can register as a sponsor"
ON public.sponsors FOR INSERT
WITH CHECK (true);

-- Policy C: Only authenticated users (organizers) can update sponsor details or status.
DROP POLICY IF EXISTS "Authenticated users can update sponsors" ON public.sponsors;
CREATE POLICY "Authenticated users can update sponsors"
ON public.sponsors FOR UPDATE
TO authenticated
USING (true);

-- Policy D: Only authenticated users (organizers) can delete a sponsor.
DROP POLICY IF EXISTS "Authenticated users can delete sponsors" ON public.sponsors;
CREATE POLICY "Authenticated users can delete sponsors"
ON public.sponsors FOR DELETE
TO authenticated
USING (true);

-- 5. Reload Schema Cache
NOTIFY pgrst, 'reload schema';