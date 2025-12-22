import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FlashCard from '@/components/FlashCard';
import { KanjiData } from '@/types/kanji';
import kanjiData from '@/data/n4kanji.json';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useHideJapanese } from '@/hooks/useHideJapanese';

// Flatten the nested array structure
const flatKanjiList: KanjiData[] = (kanjiData as KanjiData[][]).flat();

const KanjiDetail = () => {
  const { index } = useParams<{ index: string }>();
  const navigate = useNavigate();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { hideJapanese } = useHideJapanese();
  
  const currentIndex = parseInt(index || '0', 10);
  const kanji = flatKanjiList[currentIndex];

  if (!kanji) {
    navigate('/');
    return null;
  }

  const goToPrevious = () => {
    if (currentIndex > 0) {
      navigate(`/kanji/${currentIndex - 1}`);
    }
  };

  const goToNext = () => {
    if (currentIndex < flatKanjiList.length - 1) {
      navigate(`/kanji/${currentIndex + 1}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Back button */}
      <div className="container py-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/')}
          className="gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      {/* Main content */}
      <main className="container pb-24">
        <FlashCard
          kanji={kanji}
          isBookmarked={isBookmarked(kanji.kanji)}
          onToggleBookmark={() => toggleBookmark(kanji.kanji)}
          hideJapanese={hideJapanese}
        />
      </main>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border/50 py-4">
        <div className="container flex items-center justify-between">
          <Button
            variant="default"
            size="icon"
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="rounded-full w-12 h-12"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {flatKanjiList.length}
          </span>
          
          <Button
            variant="default"
            size="icon"
            onClick={goToNext}
            disabled={currentIndex === flatKanjiList.length - 1}
            className="rounded-full w-12 h-12"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default KanjiDetail;
