import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

const BOOKMARKS_KEY = 'kanji-bookmarks';

export const useBookmarks = () => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [loading, setLoading] = useState(false);

  // Fetch bookmarks from database when user logs in
  useEffect(() => {
    if (user) {
      fetchBookmarks();
    } else {
      // Load from localStorage when not logged in
      const stored = localStorage.getItem(BOOKMARKS_KEY);
      setBookmarks(stored ? JSON.parse(stored) : []);
    }
  }, [user]);

  // Sync to localStorage when bookmarks change (for offline/guest use)
  useEffect(() => {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const fetchBookmarks = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('bookmarks')
      .select('kanji, created_at')
      .eq('user_id', user.id)
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

    // Sync with database if logged in
    if (user) {
      if (isCurrentlyBookmarked) {
        await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('kanji', kanji);
      } else {
        await supabase
          .from('bookmarks')
          .insert({ user_id: user.id, kanji });
      }
    }
  }, [bookmarks, user]);

  const isBookmarked = useCallback((kanji: string) => bookmarks.includes(kanji), [bookmarks]);

  // Sync local bookmarks to database when user logs in
  const syncLocalBookmarks = useCallback(async () => {
    if (!user) return;
    
    const localBookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]');
    if (localBookmarks.length === 0) return;

    // Insert local bookmarks that don't exist in DB
    for (const kanji of localBookmarks) {
      await supabase
        .from('bookmarks')
        .upsert({ user_id: user.id, kanji }, { onConflict: 'user_id,kanji' });
    }
    
    // Refresh from DB
    await fetchBookmarks();
  }, [user]);

  useEffect(() => {
    if (user) {
      syncLocalBookmarks();
    }
  }, [user, syncLocalBookmarks]);

  return { bookmarks, toggleBookmark, isBookmarked, loading };
};
