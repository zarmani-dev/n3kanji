import { KanjiData } from '@/types/kanji';

/**
 * Generate HTML strings for Anki card front and back for a single kanji.
 * Styled to match the app's dark navy theme.
 */
export const generateAnkiHTML = (kanji: KanjiData): { front: string; back: string } => {
  const front = `<div style="
  display:flex;
  align-items:center;
  justify-content:center;
  min-height:100vh;
  background:#0f172a;
  margin:0;
  padding:0;
">
  <span style="
    font-size:128px;
    font-family:'Noto Sans JP',sans-serif;
    color:#f1f5f9;
  ">${kanji.kanji}</span>
</div>`;

  const backParts: string[] = [
    `<div style="
  min-height:100vh;
  background:#0f172a;
  color:#e2e8f0;
  font-family:'Noto Sans JP','Inter',sans-serif;
  padding:32px;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
">`,
    `<div style="max-width:480px;width:100%;text-align:center;">`,
    `<div style="font-size:64px;margin-bottom:24px;color:#f1f5f9;">${kanji.kanji}</div>`,
    `<div style="display:flex;justify-content:center;gap:32px;margin-bottom:24px;">`,
    `<div><span style="color:#94a3b8;font-size:13px;display:block;margin-bottom:4px;">訓読み (Kun)</span><span style="font-size:22px;color:#f1f5f9;">${kanji.kunyomi || '—'}</span></div>`,
    `<div><span style="color:#94a3b8;font-size:13px;display:block;margin-bottom:4px;">音読み (On)</span><span style="font-size:22px;color:#f1f5f9;">${kanji.onyomi || '—'}</span></div>`,
    `</div>`,
  ];

  if (kanji.examples.length > 0) {
    backParts.push(`<div style="border-top:1px solid #1e293b;padding-top:20px;width:100%;">`);
    backParts.push(`<div style="color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">Vocabulary</div>`);
    kanji.examples.forEach((ex) => {
      backParts.push(`<div style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #1e293b30;">
  <div style="font-size:18px;color:#f1f5f9;">${ex.j}</div>
  <div style="font-size:14px;color:#cbd5e1;margin-top:4px;">${ex.e}</div>
  <div style="font-size:12px;color:#64748b;margin-top:2px;">${ex.m}</div>
</div>`);
    });
    backParts.push(`</div>`);
  }

  backParts.push(`</div></div>`);

  return { front, back: backParts.join('\n') };
};
