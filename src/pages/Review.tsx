import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, RotateCcw, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { KanjiData } from '@/types/kanji';
import kanjiData from '@/data/n4kanji.json';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useSRS, ReviewRating, SRSCard } from '@/hooks/useSRS';
import { useHideJapanese } from '@/hooks/useHideJapanese';
import RevealText from '@/components/RevealText';
import { cn } from '@/lib/utils';

const kanjiList: KanjiData[] = kanjiData as KanjiData[];

const RATING_CONFIG: { rating: ReviewRating; label: string; sublabel: string; className: string }[] = [
  { rating: 'again', label: 'Again', sublabel: '<1m', className: 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' },
  { rating: 'hard', label: 'Hard', sublabel: '1d', className: 'bg-orange-600 hover:bg-orange-700 text-foreground' },
  { rating: 'good', label: 'Good', sublabel: '3d', className: 'bg-primary hover:bg-primary/90 text-primary-foreground' },
  { rating: 'easy', label: 'Easy', sublabel: '4d+', className: 'bg-emerald-600 hover:bg-emerald-700 text-foreground' },
];

const Review = () => {
  const navigate = useNavigate();
  const { bookmarks } = useBookmarks();
  const { getDueCards, submitReview, loading } = useSRS();
  const { hideJapanese } = useHideJapanese();
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [sessionCards, setSessionCards] = useState<SRSCard[]>([]);
  const [reviewed, setReviewed] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);

  // Initialize session
  useEffect(() => {
    if (!loading && bookmarks.length > 0 && !sessionStarted) {
      const due = getDueCards(bookmarks);
      setSessionCards(due);
      setSessionStarted(true);
    }
  }, [loading, bookmarks, getDueCards, sessionStarted]);

  const currentCard = sessionCards[currentIdx];
  const kanjiInfo = currentCard ? kanjiList.find(k => k.kanji === currentCard.kanji) : null;
  const totalCards = sessionCards.length;
  const progress = totalCards > 0 ? (reviewed / totalCards) * 100 : 0;

  const handleRating = async (rating: ReviewRating) => {
    if (!currentCard) return;
    
    await submitReview(currentCard.kanji, rating);
    
    if (rating === 'again') {
      // Move card to the end
      setSessionCards(prev => {
        const copy = [...prev];
        const card = copy.splice(currentIdx, 1)[0];
        copy.push(card);
        return copy;
      });
      setReviewed(r => r + 1);
    } else {
      // Remove card from session
      setSessionCards(prev => prev.filter((_, i) => i !== currentIdx));
      setReviewed(r => r + 1);
      if (currentIdx >= sessionCards.length - 1) {
        setCurrentIdx(Math.max(0, currentIdx - 1));
      }
    }
    
    setIsFlipped(false);
  };

  const restartSession = () => {
    setSessionStarted(false);
    setCurrentIdx(0);
    setReviewed(0);
    setIsFlipped(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Session complete
  if (sessionStarted && sessionCards.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-3 sm:py-4">
          <Button variant="secondary" size="sm" onClick={() => navigate('/')} className="gap-1">
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
        </div>
        <div className="container flex flex-col items-center justify-center py-20 text-center">
          <Brain className="w-16 h-16 text-primary mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">All done! 🎉</h2>
          <p className="text-muted-foreground mb-2">You reviewed {reviewed} card{reviewed !== 1 ? 's' : ''}.</p>
          <p className="text-muted-foreground text-sm mb-6">Come back later when more cards are due.</p>
          <Button onClick={() => navigate('/')} variant="default">Back to Home</Button>
        </div>
      </div>
    );
  }

  // No cards to review
  if (sessionStarted && !currentCard) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-3 sm:py-4">
          <Button variant="secondary" size="sm" onClick={() => navigate('/')} className="gap-1">
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
        </div>
        <div className="container flex flex-col items-center justify-center py-20 text-center">
          <Brain className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No cards due</h2>
          <p className="text-muted-foreground text-sm mb-6">
            {bookmarks.length === 0 
              ? "Bookmark some kanji first to start reviewing!" 
              : "All caught up! Come back later."}
          </p>
          <Button onClick={() => navigate('/')} variant="default">Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="container py-3 sm:py-4 space-y-3">
        <div className="flex items-center justify-between">
          <Button variant="secondary" size="sm" onClick={() => navigate('/')} className="gap-1">
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
          <span className="text-sm text-muted-foreground">
            {sessionCards.length} remaining
          </span>
          <Button variant="ghost" size="sm" onClick={restartSession} className="gap-1">
            <RotateCcw className="w-4 h-4" /> Reset
          </Button>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      {/* Flashcard */}
      <main className="container pb-32">
        {kanjiInfo && (
          <div className="w-full max-w-2xl mx-auto">
            <div 
              className="perspective-1000 cursor-pointer mb-6"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className={cn(
                "relative w-full aspect-[4/3] preserve-3d transition-transform duration-500",
                isFlipped && "rotate-y-180"
              )}>
                {/* Front */}
                <div className={cn(
                  "absolute inset-0 backface-hidden",
                  "bg-card rounded-2xl flex items-center justify-center",
                  "shadow-xl border border-border/50"
                )}>
                  <span className="text-8xl md:text-9xl font-japanese text-foreground">
                    {kanjiInfo.kanji}
                  </span>
                </div>

                {/* Back */}
                <div className={cn(
                  "absolute inset-0 backface-hidden rotate-y-180",
                  "bg-card rounded-2xl p-6 md:p-8",
                  "shadow-xl border border-border/50",
                  "flex flex-col justify-center"
                )}>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground text-sm w-12">Kun:</span>
                      <RevealText hidden={hideJapanese} className="text-2xl md:text-3xl font-japanese text-foreground">
                        {kanjiInfo.kunyomi}
                      </RevealText>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground text-sm w-12">On:</span>
                      <RevealText hidden={hideJapanese} className="text-2xl md:text-3xl font-japanese text-foreground">
                        {kanjiInfo.onyomi}
                      </RevealText>
                    </div>
                    {kanjiInfo.examples.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border/30">
                        <RevealText hidden={hideJapanese} className="text-lg font-japanese text-japanese-text">
                          {kanjiInfo.examples[0].j}
                        </RevealText>
                        <p className="text-sm text-foreground mt-1">{kanjiInfo.examples[0].e}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-muted-foreground text-sm mb-6">
              {isFlipped ? "Rate your recall" : "Tap to reveal answer"}
            </p>

            {/* Rating buttons - only visible when flipped */}
            {isFlipped && (
              <div className="grid grid-cols-4 gap-2">
                {RATING_CONFIG.map(({ rating, label, sublabel, className }) => (
                  <button
                    key={rating}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRating(rating);
                    }}
                    className={cn(
                      "flex flex-col items-center py-3 px-2 rounded-xl transition-colors text-sm font-medium",
                      className
                    )}
                  >
                    <span>{label}</span>
                    <span className="text-xs opacity-75">{sublabel}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Review;
