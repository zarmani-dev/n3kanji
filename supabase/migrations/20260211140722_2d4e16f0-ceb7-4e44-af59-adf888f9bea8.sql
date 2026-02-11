
-- Create SRS review table for spaced repetition
CREATE TABLE public.srs_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kanji TEXT NOT NULL UNIQUE,
  ease_factor REAL NOT NULL DEFAULT 2.5,
  interval_days INTEGER NOT NULL DEFAULT 0,
  repetitions INTEGER NOT NULL DEFAULT 0,
  next_review TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_reviewed TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.srs_reviews ENABLE ROW LEVEL SECURITY;

-- Public access policies (same pattern as bookmarks for personal use)
CREATE POLICY "Allow public read" ON public.srs_reviews FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.srs_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.srs_reviews FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.srs_reviews FOR DELETE USING (true);
