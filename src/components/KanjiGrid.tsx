import { KanjiData } from '@/types/kanji';
import KanjiCell from './KanjiCell';

interface KanjiGridProps {
  kanjiList: KanjiData[];
  isBookmarked: (kanji: string) => boolean;
  onKanjiClick: (index: number) => void;
}

const KanjiGrid = ({ kanjiList, isBookmarked, onKanjiClick }: KanjiGridProps) => {
  return (
    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 md:gap-3">
      {kanjiList.map((item, index) => (
        <KanjiCell
          key={`${item.kanji}-${index}`}
          kanji={item.kanji}
          index={index}
          isBookmarked={isBookmarked(item.kanji)}
          onClick={() => onKanjiClick(index)}
        />
      ))}
    </div>
  );
};

export default KanjiGrid;
