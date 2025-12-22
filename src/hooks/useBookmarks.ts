import { useState, useEffect } from 'react';

const BOOKMARKS_KEY = 'kanji-bookmarks';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([...bookmarks]));
  }, [bookmarks]);

  const toggleBookmark = (kanji: string) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(kanji)) {
        next.delete(kanji);
      } else {
        next.add(kanji);
      }
      return next;
    });
  };

  const isBookmarked = (kanji: string) => bookmarks.has(kanji);

  return { bookmarks, toggleBookmark, isBookmarked };
};
