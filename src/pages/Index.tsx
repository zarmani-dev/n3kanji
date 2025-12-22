import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import KanjiGrid from '@/components/KanjiGrid';
import { KanjiData } from '@/types/kanji';
import kanjiData from '@/data/n4kanji.json';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useHideJapanese } from '@/hooks/useHideJapanese';

// Flatten the nested array structure
const flatKanjiList: KanjiData[] = (kanjiData as KanjiData[][]).flat();

const Index = () => {
  const navigate = useNavigate();
  const { bookmarks, isBookmarked } = useBookmarks();
  const { hideJapanese, toggleHideJapanese } = useHideJapanese();
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  const displayedKanji = useMemo(() => {
    if (showBookmarksOnly) {
      return flatKanjiList.filter(k => bookmarks.has(k.kanji));
    }
    return flatKanjiList;
  }, [showBookmarksOnly, bookmarks]);

  const handleKanjiClick = (displayIndex: number) => {
    // Find the actual index in the full list
    const kanji = displayedKanji[displayIndex];
    const actualIndex = flatKanjiList.findIndex(k => k.kanji === kanji.kanji);
    navigate(`/kanji/${actualIndex}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        hideJapanese={hideJapanese}
        onToggleHideJapanese={toggleHideJapanese}
        showBookmarksOnly={showBookmarksOnly}
        onToggleBookmarksOnly={() => setShowBookmarksOnly(!showBookmarksOnly)}
        bookmarkCount={bookmarks.size}
      />
      
      <main className="container py-6">
        {displayedKanji.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-muted-foreground text-lg mb-2">No bookmarks yet</p>
            <p className="text-muted-foreground text-sm">
              Tap any kanji to view details and bookmark it
            </p>
          </div>
        ) : (
          <KanjiGrid
            kanjiList={displayedKanji}
            isBookmarked={isBookmarked}
            onKanjiClick={handleKanjiClick}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
