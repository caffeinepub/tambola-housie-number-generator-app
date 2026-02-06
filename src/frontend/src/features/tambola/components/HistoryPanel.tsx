import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HistoryPanelProps {
  calledNumbers: number[];
}

export function HistoryPanel({ calledNumbers }: HistoryPanelProps) {
  // Create a reversed copy for display (most recent first) without mutating the original
  const displayNumbers = [...calledNumbers].reverse();

  return (
    <Card className="p-4 sm:p-6 flex flex-col">
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-foreground">
        Call History ({calledNumbers.length}/90)
      </h3>
      <ScrollArea className="h-[300px] sm:h-[400px] pr-2 sm:pr-4">
        {displayNumbers.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No numbers called yet</p>
        ) : (
          <div className="grid grid-cols-9 gap-1 sm:gap-1.5 w-full">
            {displayNumbers.map((num, index) => (
              <div
                key={`${num}-${index}`}
                className={`aspect-square rounded-md text-white flex items-center justify-center font-semibold text-xs sm:text-sm shadow-sm min-w-0 ${
                  index === 0
                    ? 'bg-gradient-to-br from-red-500 to-red-600'
                    : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                }`}
              >
                {num}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
}
