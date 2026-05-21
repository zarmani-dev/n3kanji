-- ============================================================
-- N3 Kanji App — Fresh tables (separate from N4 app data)
-- ============================================================

-- n3_bookmarks: bookmarked kanji for N3 app
CREATE TABLE public.n3_bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kanji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (kanji)
);

ALTER TABLE public.n3_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON public.n3_bookmarks FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.n3_bookmarks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete" ON public.n3_bookmarks FOR DELETE USING (true);

-- ============================================================

-- n3_srs_reviews: spaced repetition schedule for N3 kanji
CREATE TABLE public.n3_srs_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kanji TEXT NOT NULL UNIQUE,
  ease_factor REAL NOT NULL DEFAULT 2.5,
  interval_days INTEGER NOT NULL DEFAULT 0,
  repetitions INTEGER NOT NULL DEFAULT 0,
  next_review TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_reviewed TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.n3_srs_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON public.n3_srs_reviews FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.n3_srs_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.n3_srs_reviews FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.n3_srs_reviews FOR DELETE USING (true);

-- ============================================================

-- n3_custom_cards: user-created custom kanji cards for N3 app
CREATE TABLE public.n3_custom_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kanji TEXT NOT NULL,
  kunyomi TEXT NOT NULL DEFAULT '',
  onyomi TEXT NOT NULL DEFAULT '',
  meaning TEXT NOT NULL DEFAULT '',
  examples JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.n3_custom_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON public.n3_custom_cards FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.n3_custom_cards FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.n3_custom_cards FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.n3_custom_cards FOR DELETE USING (true);
