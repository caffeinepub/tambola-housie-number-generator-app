import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HistoryPanelProps {
  calledNumbers: number[];
}

export function HistoryPanel({ calledNumbers }: HistoryPanelProps) {
  // Create a reversed copy for display (most recent first) without mutating the original
  const displayNumbers = [...calledNumbers].reverse();

  return (
    <Card className="p-6 h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-4 text-foreground">
        Call History ({calledNumbers.length}/90)
      </h3>
      <ScrollArea className="flex-1 pr-4">
        {displayNumbers.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No numbers called yet</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {displayNumbers.map((num, index) => (
              <div
                key={`${num}-${index}`}
                className={`w-12 h-12 rounded-lg text-white flex items-center justify-center font-semibold shadow-sm ${
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
