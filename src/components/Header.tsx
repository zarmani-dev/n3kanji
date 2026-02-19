import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bookmark, Search, X, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  hideJapanese: boolean;
  onToggleHideJapanese: () => void;
  showBookmarksOnly: boolean;
  onToggleBookmarksOnly: () => void;
  bookmarkCount: number;
  searchValue: string;
  onSearchChange: (value: string) => void;
  dueReviewCount?: number;
}

const Header = ({ 
  hideJapanese, 
  onToggleHideJapanese, 
  showBookmarksOnly, 
  onToggleBookmarksOnly,
  bookmarkCount,
  searchValue,
  onSearchChange,
  dueReviewCount = 0
}: HeaderProps) => {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container py-3 sm:py-4">
        <div className="flex flex-col gap-3">
          {/* Top row */}
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-lg sm:text-xl font-semibold text-foreground truncate">
              N4 Kanji
            </h1>
            
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search toggle (mobile) */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="sm:hidden p-2 rounded-full bg-secondary text-secondary-foreground"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Desktop search */}
              <div className="hidden sm:flex items-center gap-2 bg-secondary rounded-full px-3 py-1.5">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="number"
                  placeholder="No."
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-16 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                {searchValue && (
                  <button onClick={() => onSearchChange('')}>
                    <X className="w-3 h-3 text-muted-foreground" />
                  </button>
                )}
              </div>

              {/* Review button */}
              <button
                onClick={() => navigate('/review')}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm transition-colors",
                  dueReviewCount > 0
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                <Brain className="w-4 h-4" />
                <span>{dueReviewCount}</span>
              </button>

              {/* Bookmarks filter */}
              <button
                onClick={onToggleBookmarksOnly}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm transition-colors",
                  showBookmarksOnly 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                <Bookmark className={cn("w-4 h-4", showBookmarksOnly && "fill-current")} />
                <span>{bookmarkCount}</span>
              </button>
              
              {/* Hide Japanese toggle */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Label htmlFor="hide-japanese" className="text-xs sm:text-sm text-muted-foreground cursor-pointer hidden sm:block">
                  Hide JP
                </Label>
                <Switch
                  id="hide-japanese"
                  checked={hideJapanese}
                  onCheckedChange={onToggleHideJapanese}
                />
              </div>
            </div>
          </div>

          {/* Mobile search bar */}
          {showSearch && (
            <div className="sm:hidden flex items-center gap-2 bg-secondary rounded-full px-3 py-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="number"
                placeholder="Search by number (101-...)"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                autoFocus
              />
              {searchValue && (
                <button onClick={() => onSearchChange('')}>
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
