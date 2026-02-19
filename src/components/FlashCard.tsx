import { useState } from 'react';
import { Volume2, Bookmark, Copy, Check } from 'lucide-react';
import { KanjiData } from '@/types/kanji';
import { cn } from '@/lib/utils';
import RevealText from './RevealText';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { generateAnkiHTML } from '@/utils/ankiExport';

interface FlashCardProps {
  kanji: KanjiData;
  labelNumber: number;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  hideJapanese: boolean;
}

const FlashCard = ({ kanji, labelNumber, isBookmarked, onToggleBookmark, hideJapanese }: FlashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState<'front' | 'back' | null>(null);

  const ankiHTML = generateAnkiHTML(kanji);

  const copyToClipboard = async (text: string, side: 'front' | 'back') => {
    await navigator.clipboard.writeText(text);
    setCopied(side);
    setTimeout(() => setCopied(null), 2000);
  };

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

      {/* Anki Export Button */}
      <div className="flex justify-center mb-8">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              Copy for Anki
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Anki Card HTML — {kanji.kanji}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Front</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 h-7"
                    onClick={() => copyToClipboard(ankiHTML.front, 'front')}
                  >
                    {copied === 'front' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied === 'front' ? 'Copied' : 'Copy'}
                  </Button>
                </div>
                <pre className="bg-muted rounded-lg p-3 text-xs overflow-x-auto whitespace-pre-wrap break-all font-mono text-foreground">
                  {ankiHTML.front}
                </pre>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Back</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 h-7"
                    onClick={() => copyToClipboard(ankiHTML.back, 'back')}
                  >
                    {copied === 'back' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied === 'back' ? 'Copied' : 'Copy'}
                  </Button>
                </div>
                <pre className="bg-muted rounded-lg p-3 text-xs overflow-x-auto whitespace-pre-wrap break-all font-mono text-foreground">
                  {ankiHTML.back}
                </pre>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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
