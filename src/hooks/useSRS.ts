import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SRSCard {
  id: string;
  kanji: string;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review: string;
  last_reviewed: string | null;
  created_at: string;
}

/**
 * SM-2 spaced repetition algorithm.
 * quality: 0–5 (0=blackout, 3=correct, 5=perfect)
 */
function sm2(card: SRSCard, quality: number) {
  let { ease_factor, interval_days, repetitions } = card;

  if (quality >= 3) {
    if (repetitions === 0) interval_days = 1;
    else if (repetitions === 1) interval_days = 6;
    else interval_days = Math.round(interval_days * ease_factor);

    repetitions += 1;
    ease_factor = ease_factor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
    if (ease_factor < 1.3) ease_factor = 1.3;
  } else {
    repetitions = 0;
    interval_days = 1;
  }

  const next_review = new Date(Date.now() + interval_days * 86400_000).toISOString();

  return { ease_factor, interval_days, repetitions, next_review };
}

export const useSRS = () => {
  const [cards, setCards] = useState<SRSCard[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCards = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('n3_srs_reviews')
      .select('*')
      .order('next_review', { ascending: true });

    if (!error && data) {
      setCards(data as SRSCard[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  /** Cards that are due for review right now */
  const dueCards = cards.filter(c => new Date(c.next_review) <= new Date());

  /** Get or create an SRS record for a kanji */
  const getOrCreate = useCallback(async (kanji: string): Promise<SRSCard | null> => {
    const existing = cards.find(c => c.kanji === kanji);
    if (existing) return existing;

    const { data, error } = await supabase
      .from('n3_srs_reviews')
      .insert({ kanji })
      .select()
      .single();

    if (!error && data) {
      const newCard = data as SRSCard;
      setCards(prev => [...prev, newCard]);
      return newCard;
    }
    return null;
  }, [cards]);

  /**
   * Record a review result using SM-2.
   * quality: 0 = forgot, 3 = remembered, 5 = perfect
   */
  const review = useCallback(async (kanji: string, quality: number) => {
    const card = cards.find(c => c.kanji === kanji);
    if (!card) return;

    const updates = sm2(card, quality);
    const { data, error } = await supabase
      .from('n3_srs_reviews')
      .update({ ...updates, last_reviewed: new Date().toISOString() })
      .eq('kanji', kanji)
      .select()
      .single();

    if (!error && data) {
      setCards(prev => prev.map(c => c.kanji === kanji ? data as SRSCard : c));
    }
  }, [cards]);

  /** Reset SRS data for a kanji */
  const resetCard = useCallback(async (kanji: string) => {
    const { error } = await supabase
      .from('n3_srs_reviews')
      .delete()
      .eq('kanji', kanji);

    if (!error) {
      setCards(prev => prev.filter(c => c.kanji !== kanji));
    }
  }, []);

  return {
    cards,
    dueCards,
    loading,
    getOrCreate,
    review,
    resetCard,
    refetch: fetchCards,
  };
};
