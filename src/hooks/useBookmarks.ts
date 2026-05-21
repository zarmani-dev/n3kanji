import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

const BOOKMARKS_KEY = 'n3-kanji-bookmarks';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('n3_bookmarks')
      .select('kanji, created_at')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Failed to fetch N3 bookmarks:', error.message);
      setBookmarks([]);
    } else {
      setBookmarks(data.map(b => b.kanji));
    }
    setLoading(false);
  }, []);

  // Clear legacy N4 localStorage keys & fetch from DB on mount
  useEffect(() => {
    localStorage.removeItem('kanji-bookmarks');
    localStorage.removeItem('n3-kanji-bookmarks');
    fetchBookmarks();
  }, [fetchBookmarks]);

  // Sync to localStorage whenever bookmarks change
  useEffect(() => {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = useCallback(async (kanji: string) => {
    const isCurrentlyBookmarked = bookmarks.includes(kanji);

    // Optimistic update
    if (isCurrentlyBookmarked) {
      setBookmarks(prev => prev.filter(k => k !== kanji));
    } else {
      setBookmarks(prev => [...prev, kanji]);
    }

    // Sync with database
    if (isCurrentlyBookmarked) {
      const { error } = await supabase
        .from('n3_bookmarks')
        .delete()
        .eq('kanji', kanji);
      if (error) console.error('Failed to remove bookmark:', error.message);
    } else {
      const { error } = await supabase
        .from('n3_bookmarks')
        .insert({ kanji });
      if (error) console.error('Failed to add bookmark:', error.message);
    }
  }, [bookmarks]);

  const isBookmarked = useCallback(
    (kanji: string) => bookmarks.includes(kanji),
    [bookmarks]
  );

  return { bookmarks, toggleBookmark, isBookmarked, loading, refetch: fetchBookmarks };
};
