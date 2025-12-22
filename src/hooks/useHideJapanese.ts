import { useState, useEffect } from 'react';

const HIDE_JAPANESE_KEY = 'hide-japanese';

export const useHideJapanese = () => {
  const [hideJapanese, setHideJapanese] = useState<boolean>(() => {
    const stored = localStorage.getItem(HIDE_JAPANESE_KEY);
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    localStorage.setItem(HIDE_JAPANESE_KEY, JSON.stringify(hideJapanese));
  }, [hideJapanese]);

  const toggleHideJapanese = () => {
    setHideJapanese(prev => !prev);
  };

  return { hideJapanese, toggleHideJapanese, setHideJapanese };
};
