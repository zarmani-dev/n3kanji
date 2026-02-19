import { KanjiData } from '@/types/kanji';

/**
 * Generate a tab-separated text file for Anki import.
 * Front: Kanji character
 * Back: Kunyomi, Onyomi, all examples with Japanese + English
 */
export const generateAnkiTSV = (kanjiList: KanjiData[]): string => {
  const header = '#separator:tab\n#html:true\n#tags column:3\n';

  const rows = kanjiList.map((k) => {
    const front = `<div style="font-size:72px;text-align:center;">${k.kanji}</div>`;

    const backParts: string[] = [
      `<div style="text-align:center;">`,
      `<p><b>訓読み (Kun):</b> ${k.kunyomi || '—'}</p>`,
      `<p><b>音読み (On):</b> ${k.onyomi || '—'}</p>`,
    ];

    if (k.examples.length > 0) {
      backParts.push(`<hr><p><b>Examples:</b></p>`);
      k.examples.forEach((ex) => {
        backParts.push(`<p>${ex.j}<br><span style="color:#666;">${ex.e}</span></p>`);
      });
    }

    backParts.push(`</div>`);
    const back = backParts.join('');
    const tag = 'N4-Kanji';

    // Escape tabs/newlines in content
    const escapedFront = front.replace(/\t/g, ' ').replace(/\n/g, ' ');
    const escapedBack = back.replace(/\t/g, ' ').replace(/\n/g, ' ');

    return `${escapedFront}\t${escapedBack}\t${tag}`;
  });

  return header + rows.join('\n');
};

export const downloadAnkiFile = (kanjiList: KanjiData[]) => {
  const content = generateAnkiTSV(kanjiList);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'n4-kanji-bookmarks.txt';
  a.click();
  URL.revokeObjectURL(url);
};
