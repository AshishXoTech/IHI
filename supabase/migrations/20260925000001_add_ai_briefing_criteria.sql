-- Add rubric-aware AI briefing criteria
ALTER TABLE public.ai_briefings
ADD COLUMN IF NOT EXISTS criteria_briefs JSONB NOT NULL DEFAULT '[]'::jsonb;

NOTIFY pgrst, 'reload schema';
