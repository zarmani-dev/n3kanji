import { useState } from 'react';
import { Volume2, Bookmark } from 'lucide-react';
import { KanjiData } from '@/types/kanji';
import { cn } from '@/lib/utils';
import RevealText from './RevealText';
import { Button } from './ui/button';

interface FlashCardProps {
  kanji: KanjiData;
  labelNumber: number;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  hideJapanese: boolean;
}

const FlashCard = ({ kanji, labelNumber, isBookmarked, onToggleBookmark, hideJapanese }: FlashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Card container with perspective */}
      <div 
        className="perspective-1000 cursor-pointer mb-6"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={cn(
            "relative w-full aspect-[4/3] preserve-3d transition-transform duration-500",
            isFlipped && "rotate-y-180"
          )}
        >
          {/* Front of card - Kanji only */}
          <div className={cn(
            "absolute inset-0 backface-hidden",
            "bg-card rounded-2xl flex items-center justify-center",
            "shadow-xl border border-border/50"
          )}>
            <span className="text-8xl md:text-9xl font-japanese text-foreground">
              {kanji.kanji}
            </span>
            
            {/* Bookmark button on front */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4"
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark();
              }}
            >
              <Bookmark 
                className={cn(
                  "w-6 h-6 transition-colors",
                  isBookmarked ? "text-primary fill-primary" : "text-muted-foreground"
                )} 
              />
            </Button>
          </div>

          {/* Back of card - Readings */}
          <div 
            className={cn(
              "absolute inset-0 backface-hidden rotate-y-180",
              "bg-card rounded-2xl p-6 md:p-8",
              "shadow-xl border border-border/50",
              "flex flex-col justify-center"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground text-sm w-12">Kun:</span>
                <RevealText hidden={hideJapanese} className="text-2xl md:text-3xl font-japanese text-foreground">
                  {kanji.kunyomi}
                </RevealText>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground text-sm w-12">On:</span>
                <RevealText hidden={hideJapanese} className="text-2xl md:text-3xl font-japanese text-foreground">
                  {kanji.onyomi}
                </RevealText>
              </div>
            </div>
            
            {/* Bookmark button on back */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4"
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark();
              }}
            >
              <Bookmark 
                className={cn(
                  "w-6 h-6 transition-colors",
                  isBookmarked ? "text-primary fill-primary" : "text-muted-foreground"
                )} 
              />
            </Button>
          </div>
        </div>
      </div>

      {/* Tap instruction */}
      <p className="text-center text-muted-foreground text-sm mb-8">
        Tap the card to flip
      </p>

      {/* Vocabulary section */}
      <div className="space-y-4">
        <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
          Vocabulary
        </h3>
        
        <div className="space-y-4">
          {kanji.examples.map((example, idx) => (
            <div 
              key={idx} 
              className="flex items-start justify-between gap-4 py-3 border-b border-border/30 last:border-0"
            >
              <div className="space-y-1 flex-1">
                <RevealText 
                  hidden={hideJapanese} 
                  className="text-lg font-japanese text-japanese-text"
                >
                  {example.j}
                </RevealText>
                <p className="text-sm text-foreground">{example.e}</p>
                <p className="text-xs text-muted-foreground">{example.m}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-muted-foreground hover:text-foreground"
                onClick={() => speak(example.j.split(' ')[0])}
              >
                <Volume2 className="w-5 h-5" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlashCard;
