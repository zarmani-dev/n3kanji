import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SRSCard {
  kanji: string;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review: string;
  last_reviewed: string | null;
}

export type ReviewRating = 'again' | 'hard' | 'good' | 'easy';

// SM-2 algorithm implementation
const calculateSM2 = (card: SRSCard, rating: ReviewRating) => {
  const ratingMap: Record<ReviewRating, number> = { again: 0, hard: 1, good: 2, easy: 3 };
  const quality = ratingMap[rating];

  let { ease_factor, interval_days, repetitions } = card;

  if (quality < 1) {
    // Failed - reset
    repetitions = 0;
    interval_days = 0;
  } else {
    if (repetitions === 0) {
      interval_days = 1;
    } else if (repetitions === 1) {
      interval_days = quality === 1 ? 1 : quality === 2 ? 3 : 4;
    } else {
      const multiplier = quality === 1 ? 1.2 : quality === 2 ? ease_factor : ease_factor * 1.3;
      interval_days = Math.ceil(interval_days * multiplier);
    }
    repetitions += 1;
  }

  // Adjust ease factor
  ease_factor = Math.max(1.3, ease_factor + (0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02)));

  const next_review = new Date();
  if (interval_days === 0) {
    // Show again in 1 minute (for "again" rating)
    next_review.setMinutes(next_review.getMinutes() + 1);
  } else {
    next_review.setDate(next_review.getDate() + interval_days);
  }

  return {
    ease_factor,
    interval_days,
    repetitions,
    next_review: next_review.toISOString(),
    last_reviewed: new Date().toISOString(),
  };
};

export const useSRS = () => {
  const [reviews, setReviews] = useState<SRSCard[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('srs_reviews')
      .select('kanji, ease_factor, interval_days, repetitions, next_review, last_reviewed')
      .order('next_review', { ascending: true });

    if (!error && data) {
      setReviews(data as SRSCard[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const getDueCards = useCallback((bookmarkedKanji: string[]) => {
    const now = new Date().toISOString();
    const reviewedSet = new Set(reviews.map(r => r.kanji));
    
    // Cards that have never been reviewed (new cards from bookmarks)
    const newCards: SRSCard[] = bookmarkedKanji
      .filter(k => !reviewedSet.has(k))
      .map(k => ({
        kanji: k,
        ease_factor: 2.5,
        interval_days: 0,
        repetitions: 0,
        next_review: new Date().toISOString(),
        last_reviewed: null,
      }));

    // Cards that are due for review
    const dueCards = reviews.filter(
      r => bookmarkedKanji.includes(r.kanji) && r.next_review <= now
    );

    return [...dueCards, ...newCards];
  }, [reviews]);

  const getDueCount = useCallback((bookmarkedKanji: string[]) => {
    return getDueCards(bookmarkedKanji).length;
  }, [getDueCards]);

  const submitReview = useCallback(async (kanji: string, rating: ReviewRating) => {
    const existing = reviews.find(r => r.kanji === kanji);
    const card: SRSCard = existing || {
      kanji,
      ease_factor: 2.5,
      interval_days: 0,
      repetitions: 0,
      next_review: new Date().toISOString(),
      last_reviewed: null,
    };

    const updated = calculateSM2(card, rating);

    // Upsert to database
    await supabase
      .from('srs_reviews')
      .upsert({
        kanji,
        ...updated,
      }, { onConflict: 'kanji' });

    // Update local state
    setReviews(prev => {
      const idx = prev.findIndex(r => r.kanji === kanji);
      const newCard = { kanji, ...updated };
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newCard;
        return copy;
      }
      return [...prev, newCard];
    });
  }, [reviews]);

  return { reviews, loading, getDueCards, getDueCount, submitReview, refetch: fetchReviews };
};
