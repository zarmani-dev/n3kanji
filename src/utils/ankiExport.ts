import { KanjiData } from '@/types/kanji';

/**
 * Generate HTML strings for Anki card front and back for a single kanji.
 * Styled to match the app's dark navy theme. Uses single-line inline styles for Anki compatibility.
 */
export const generateAnkiHTML = (kanji: KanjiData): { front: string; back: string } => {
  const front = `<div style="display:flex;align-items:center;justify-content:center;height:100vh;background-color:#0f172a;margin:0;padding:0;"><span style="font-size:160px;font-family:'Noto Sans JP',sans-serif;color:#f1f5f9;">${kanji.kanji}</span></div>`;

  const exampleRows = kanji.examples.map((ex) =>
    `<div style="margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid rgba(30,41,59,0.4);"><div style="font-size:18px;color:#f1f5f9;font-family:'Noto Sans JP',sans-serif;">${ex.j}</div><div style="font-size:14px;color:#cbd5e1;margin-top:4px;">${ex.e}</div><div style="font-size:12px;color:#64748b;margin-top:2px;">${ex.m}</div></div>`
  ).join('');

  const vocabSection = kanji.examples.length > 0
    ? `<div style="border-top:1px solid #1e293b;padding-top:20px;width:100%;margin-top:8px;"><div style="color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:14px;">Vocabulary</div>${exampleRows}</div>`
    : '';

  const back = `<div style="min-height:100vh;background-color:#0f172a;color:#e2e8f0;font-family:'Noto Sans JP','Inter',sans-serif;padding:32px;display:flex;flex-direction:column;justify-content:center;align-items:center;"><div style="max-width:480px;width:100%;text-align:center;"><div style="font-size:72px;margin-bottom:28px;color:#f1f5f9;">${kanji.kanji}</div><div style="display:flex;justify-content:center;gap:40px;margin-bottom:24px;"><div><span style="color:#94a3b8;font-size:12px;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;">訓読み Kun</span><span style="font-size:24px;color:#f1f5f9;">${kanji.kunyomi || '—'}</span></div><div><span style="color:#94a3b8;font-size:12px;display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;">音読み On</span><span style="font-size:24px;color:#f1f5f9;">${kanji.onyomi || '—'}</span></div></div>${vocabSection}</div></div>`;

  return { front, back };
};
