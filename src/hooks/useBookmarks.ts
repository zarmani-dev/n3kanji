import { useState, useEffect } from 'react';

const BOOKMARKS_KEY = 'kanji-bookmarks';

// Store as ordered array for chronological ordering
export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = (kanji: string) => {
    setBookmarks(prev => {
      if (prev.includes(kanji)) {
        return prev.filter(k => k !== kanji);
      } else {
        return [...prev, kanji]; // Add to end (chronological)
      }
    });
  };

  const isBookmarked = (kanji: string) => bookmarks.includes(kanji);

  return { bookmarks, toggleBookmark, isBookmarked };
};
