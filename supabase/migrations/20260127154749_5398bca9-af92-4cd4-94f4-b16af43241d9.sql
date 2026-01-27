-- Drop existing RLS policies
DROP POLICY IF EXISTS "Users can view their own bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Users can insert their own bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Users can delete their own bookmarks" ON public.bookmarks;

-- Make user_id nullable and remove the constraint
ALTER TABLE public.bookmarks DROP CONSTRAINT IF EXISTS bookmarks_user_id_fkey;
ALTER TABLE public.bookmarks ALTER COLUMN user_id DROP NOT NULL;

-- Drop the unique constraint and recreate without user_id
ALTER TABLE public.bookmarks DROP CONSTRAINT IF EXISTS bookmarks_user_id_kanji_key;
ALTER TABLE public.bookmarks ADD CONSTRAINT bookmarks_kanji_key UNIQUE (kanji);

-- Create simple public access policies for personal use
CREATE POLICY "Allow public read" ON public.bookmarks FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.bookmarks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete" ON public.bookmarks FOR DELETE USING (true);