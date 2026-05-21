import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CustomExample {
  j: string;
  e: string;
  m: string;
}

export interface CustomCard {
  id: string;
  kanji: string;
  kunyomi: string;
  onyomi: string;
  meaning: string;
  examples: CustomExample[];
  created_at: string;
}

export const useCustomCards = () => {
  const [cards, setCards] = useState<CustomCard[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCards = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('n3_custom_cards')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setCards(data.map(d => ({ ...d, examples: (d.examples as unknown as CustomExample[]) || [] })));
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchCards(); }, [fetchCards]);

  const createCard = async (card: Omit<CustomCard, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('n3_custom_cards')
      .insert({ ...card, examples: card.examples as unknown as never })
      .select()
      .single();
    if (!error && data) {
      setCards(prev => [{ ...data, examples: (data.examples as unknown as CustomExample[]) || [] }, ...prev]);
    }
    return { error };
  };

  const updateCard = async (id: string, card: Omit<CustomCard, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('n3_custom_cards')
      .update({ ...card, examples: card.examples as unknown as never })
      .eq('id', id)
      .select()
      .single();
    if (!error && data) {
      setCards(prev => prev.map(c => c.id === id ? { ...data, examples: (data.examples as unknown as CustomExample[]) || [] } : c));
    }
    return { error };
  };

  const deleteCard = async (id: string) => {
    const { error } = await supabase.from('custom_cards').delete().eq('id', id);
    if (!error) {
      setCards(prev => prev.filter(c => c.id !== id));
    }
    return { error };
  };

  return { cards, loading, createCard, updateCard, deleteCard, refetch: fetchCards };
};
