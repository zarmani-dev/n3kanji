import { useState } from 'react';
import { cn } from '@/lib/utils';

interface RevealTextProps {
  children: React.ReactNode;
  hidden: boolean;
  className?: string;
}

const RevealText = ({ children, hidden, className }: RevealTextProps) => {
  const [revealed, setRevealed] = useState(false);

  if (!hidden) {
    return <span className={className}>{children}</span>;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRevealed(!revealed);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "relative inline-block transition-all duration-300",
        className
      )}
    >
      {revealed ? (
        <span className="animate-fade-in">{children}</span>
      ) : (
        <span className="flex items-center gap-2 px-3 py-1 rounded-md bg-muted/50 text-muted-foreground text-sm">
          Tap to reveal
        </span>
      )}
    </button>
  );
};

export default RevealText;
