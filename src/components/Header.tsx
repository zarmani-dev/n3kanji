import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  hideJapanese: boolean;
  onToggleHideJapanese: () => void;
  showBookmarksOnly: boolean;
  onToggleBookmarksOnly: () => void;
  bookmarkCount: number;
}

const Header = ({ 
  hideJapanese, 
  onToggleHideJapanese, 
  showBookmarksOnly, 
  onToggleBookmarksOnly,
  bookmarkCount 
}: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-xl font-semibold text-foreground">
            N4 Kanji Flashcards
          </h1>
          
          <div className="flex items-center gap-6">
            {/* Bookmarks filter */}
            <button
              onClick={onToggleBookmarksOnly}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors",
                showBookmarksOnly 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              <Bookmark className={cn("w-4 h-4", showBookmarksOnly && "fill-current")} />
              <span>{bookmarkCount}</span>
            </button>
            
            {/* Hide Japanese toggle */}
            <div className="flex items-center gap-2">
              <Label htmlFor="hide-japanese" className="text-sm text-muted-foreground cursor-pointer">
                Hide Japanese
              </Label>
              <Switch
                id="hide-japanese"
                checked={hideJapanese}
                onCheckedChange={onToggleHideJapanese}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
