import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import KanjiGrid from "@/components/KanjiGrid";
import { KanjiData } from "@/types/kanji";
import kanjiData from "@/data/n4kanji.json";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useHideJapanese } from "@/hooks/useHideJapanese";

const LABEL_START = 111;
const kanjiList: KanjiData[] = kanjiData as KanjiData[];

const Index = () => {
  const navigate = useNavigate();
  const { bookmarks, isBookmarked } = useBookmarks();
  const { hideJapanese, toggleHideJapanese } = useHideJapanese();
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const { displayedKanji, labelNumbers, indexMap } = useMemo(() => {
    if (showBookmarksOnly) {
      // Bookmarks in chronological order with their original labels
      const bookmarkedKanji: KanjiData[] = [];
      const labels: number[] = [];
      const idxMap: number[] = [];

      bookmarks.forEach((bookmarkedChar) => {
        const originalIndex = kanjiList.findIndex((k) => k.kanji === bookmarkedChar);
        if (originalIndex !== -1) {
          bookmarkedKanji.push(kanjiList[originalIndex]);
          labels.push(LABEL_START + originalIndex);
          idxMap.push(originalIndex);
        }
      });

      return { displayedKanji: bookmarkedKanji, labelNumbers: labels, indexMap: idxMap };
    }

    // All kanji with sequential labels starting from 101
    let filtered = kanjiList.map((k, i) => ({ kanji: k, originalIndex: i }));

    // Filter by search
    if (searchValue) {
      const searchNum = parseInt(searchValue, 10);
      if (!isNaN(searchNum)) {
        filtered = filtered.filter(({ originalIndex }) => {
          const label = LABEL_START + originalIndex;
          return label.toString().includes(searchValue);
        });
      }
    }

    return {
      displayedKanji: filtered.map((f) => f.kanji),
      labelNumbers: filtered.map((f) => LABEL_START + f.originalIndex),
      indexMap: filtered.map((f) => f.originalIndex),
    };
  }, [showBookmarksOnly, bookmarks, searchValue]);

  const handleKanjiClick = (displayIndex: number) => {
    const actualIndex = indexMap[displayIndex];
    navigate(`/kanji/${actualIndex}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        hideJapanese={hideJapanese}
        onToggleHideJapanese={toggleHideJapanese}
        showBookmarksOnly={showBookmarksOnly}
        onToggleBookmarksOnly={() => setShowBookmarksOnly(!showBookmarksOnly)}
        bookmarkCount={bookmarks.length}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />

      <main className="container py-4 sm:py-6">
        {displayedKanji.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-muted-foreground text-lg mb-2">
              {showBookmarksOnly ? "No bookmarks yet" : "No kanji found"}
            </p>
            <p className="text-muted-foreground text-sm">
              {showBookmarksOnly ? "Tap any kanji to view details and bookmark it" : "Try a different search number"}
            </p>
          </div>
        ) : (
          <KanjiGrid
            kanjiList={displayedKanji}
            labelNumbers={labelNumbers}
            isBookmarked={isBookmarked}
            onKanjiClick={handleKanjiClick}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
