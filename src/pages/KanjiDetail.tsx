import { useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FlashCard from '@/components/FlashCard';
import { KanjiData } from '@/types/kanji';
import kanjiData from '@/data/n4kanji.json';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useHideJapanese } from '@/hooks/useHideJapanese';

const LABEL_START = 101;
const kanjiList: KanjiData[] = kanjiData as KanjiData[];

const KanjiDetail = () => {
  const { index } = useParams<{ index: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { bookmarks, isBookmarked, toggleBookmark } = useBookmarks();
  const { hideJapanese } = useHideJapanese();
  
  const isBookmarkMode = searchParams.get('bookmarks') === 'true';
  const currentIndex = parseInt(index || '0', 10);
  const kanji = kanjiList[currentIndex];
  const labelNumber = LABEL_START + currentIndex;

  // Get list of bookmark indices for navigation
  const bookmarkIndices = useMemo(() => {
    return bookmarks
      .map(char => kanjiList.findIndex(k => k.kanji === char))
      .filter(idx => idx !== -1);
  }, [bookmarks]);

  const currentPositionInBookmarks = bookmarkIndices.indexOf(currentIndex);

  if (!kanji) {
    navigate('/');
    return null;
  }

  const goToPrevious = () => {
    if (isBookmarkMode) {
      if (currentPositionInBookmarks > 0) {
        navigate(`/kanji/${bookmarkIndices[currentPositionInBookmarks - 1]}?bookmarks=true`);
      }
    } else {
      if (currentIndex > 0) {
        navigate(`/kanji/${currentIndex - 1}`);
      }
    }
  };

  const goToNext = () => {
    if (isBookmarkMode) {
      if (currentPositionInBookmarks < bookmarkIndices.length - 1) {
        navigate(`/kanji/${bookmarkIndices[currentPositionInBookmarks + 1]}?bookmarks=true`);
      }
    } else {
      if (currentIndex < kanjiList.length - 1) {
        navigate(`/kanji/${currentIndex + 1}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Back button */}
      <div className="container py-3 sm:py-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate(isBookmarkMode ? '/?bookmarks=true' : '/')}
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
          labelNumber={labelNumber}
          isBookmarked={isBookmarked(kanji.kanji)}
          onToggleBookmark={() => toggleBookmark(kanji.kanji)}
          hideJapanese={hideJapanese}
        />
      </main>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border/50 py-3 sm:py-4">
        <div className="container flex items-center justify-between">
          <Button
            variant="default"
            size="icon"
            onClick={goToPrevious}
            disabled={isBookmarkMode ? currentPositionInBookmarks <= 0 : currentIndex === 0}
            className="rounded-full w-10 h-10 sm:w-12 sm:h-12"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
          
          <span className="text-sm text-muted-foreground">
            #{labelNumber} ({isBookmarkMode ? `${currentPositionInBookmarks + 1} / ${bookmarkIndices.length}` : `${currentIndex + 1} / ${kanjiList.length}`})
          </span>
          
          <Button
            variant="default"
            size="icon"
            onClick={goToNext}
            disabled={isBookmarkMode ? currentPositionInBookmarks >= bookmarkIndices.length - 1 : currentIndex === kanjiList.length - 1}
            className="rounded-full w-10 h-10 sm:w-12 sm:h-12"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default KanjiDetail;
