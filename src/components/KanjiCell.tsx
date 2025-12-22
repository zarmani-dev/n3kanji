import { Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KanjiCellProps {
  kanji: string;
  index: number;
  isBookmarked: boolean;
  onClick: () => void;
}

const KanjiCell = ({ kanji, index, isBookmarked, onClick }: KanjiCellProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative aspect-square flex items-center justify-center",
        "bg-kanji-card hover:bg-kanji-card-hover rounded-lg",
        "text-3xl md:text-4xl font-japanese text-foreground",
        "transition-all duration-200 hover:scale-105 hover:shadow-lg",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
      )}
    >
      {/* Number label */}
      <span className="absolute top-1.5 right-2 text-xs text-muted-foreground font-medium">
        {index + 1}
      </span>
      
      {/* Bookmark indicator */}
      {isBookmarked && (
        <Bookmark 
          className="absolute top-1.5 left-1.5 w-3.5 h-3.5 text-primary fill-primary" 
        />
      )}
      
      {kanji}
    </button>
  );
};

export default KanjiCell;
