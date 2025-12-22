export interface KanjiExample {
  j: string;
  e: string;
  m: string;
}

export interface KanjiData {
  kanji: string;
  kunyomi: string;
  onyomi: string;
  examples: KanjiExample[];
}

export type KanjiGroup = KanjiData[];
