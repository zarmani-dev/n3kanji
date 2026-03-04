
CREATE TABLE public.custom_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  kanji text NOT NULL,
  kunyomi text NOT NULL DEFAULT '',
  onyomi text NOT NULL DEFAULT '',
  meaning text NOT NULL DEFAULT '',
  examples jsonb NOT NULL DEFAULT '[]'::jsonb
);

ALTER TABLE public.custom_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON public.custom_cards FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.custom_cards FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.custom_cards FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.custom_cards FOR DELETE USING (true);
