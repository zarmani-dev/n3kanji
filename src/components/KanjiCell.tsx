import { Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KanjiCellProps {
  kanji: string;
  labelNumber: number;
  isBookmarked: boolean;
  onClick: () => void;
}

const KanjiCell = ({ kanji, labelNumber, isBookmarked, onClick }: KanjiCellProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative aspect-square flex items-center justify-center",
        "bg-kanji-card hover:bg-kanji-card-hover rounded-lg",
        "text-2xl sm:text-3xl font-japanese text-foreground",
        "transition-all duration-200 active:scale-95 hover:shadow-lg",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
      )}
    >
      {/* Number label */}
      <span className="absolute top-1 right-1.5 text-[10px] sm:text-xs text-muted-foreground font-medium">
        {labelNumber}
      </span>
      
      {/* Bookmark indicator */}
      {isBookmarked && (
        <Bookmark 
          className="absolute top-1 left-1 w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary fill-primary" 
        />
      )}
      
      {kanji}
    </button>
  );
};

export default KanjiCell;
