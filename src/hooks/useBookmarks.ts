import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

const BOOKMARKS_KEY = 'kanji-bookmarks';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [loading, setLoading] = useState(true);

  // Fetch bookmarks from database on mount
  useEffect(() => {
    fetchBookmarks();
  }, []);

  // Sync to localStorage when bookmarks change
  useEffect(() => {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const fetchBookmarks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookmarks')
      .select('kanji, created_at')
      .order('created_at', { ascending: true });

    if (!error && data) {
      const kanjiList = data.map(b => b.kanji);
      setBookmarks(kanjiList);
    }
    setLoading(false);
  };

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
      await supabase
        .from('bookmarks')
        .delete()
        .eq('kanji', kanji);
    } else {
      await supabase
        .from('bookmarks')
        .insert({ kanji });
    }
  }, [bookmarks]);

  const isBookmarked = useCallback((kanji: string) => bookmarks.includes(kanji), [bookmarks]);

  return { bookmarks, toggleBookmark, isBookmarked, loading };
};
