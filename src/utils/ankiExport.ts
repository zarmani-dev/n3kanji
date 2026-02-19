import { KanjiData } from '@/types/kanji';

/**
 * Generate HTML strings for Anki card front and back for a single kanji.
 */
export const generateAnkiHTML = (kanji: KanjiData): { front: string; back: string } => {
  const front = `<div style="font-size:72px;text-align:center;font-family:'Noto Sans JP',sans-serif;">${kanji.kanji}</div>`;

  const backParts: string[] = [
    `<div style="text-align:center;font-family:'Noto Sans JP',sans-serif;">`,
    `<p><b>訓読み (Kun):</b> ${kanji.kunyomi || '—'}</p>`,
    `<p><b>音読み (On):</b> ${kanji.onyomi || '—'}</p>`,
  ];

  if (kanji.examples.length > 0) {
    backParts.push(`<hr><p><b>Examples:</b></p>`);
    kanji.examples.forEach((ex) => {
      backParts.push(`<p>${ex.j}<br><span style="color:#888;">${ex.e}</span><br><span style="color:#aaa;font-size:0.85em;">${ex.m}</span></p>`);
    });
  }

  backParts.push(`</div>`);

  return { front, back: backParts.join('\n') };
};
