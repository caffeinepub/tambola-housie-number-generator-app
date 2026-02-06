import { Card } from '@/components/ui/card';

interface LastNumberDisplayProps {
  lastDrawn: number | null;
  isComplete: boolean;
}

export function LastNumberDisplay({ lastDrawn, isComplete }: LastNumberDisplayProps) {
  return (
    <Card className="p-8 text-center bg-gradient-to-br from-amber-500 to-orange-600 border-none shadow-2xl">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-white/90 uppercase tracking-wider">
          {isComplete ? 'Game Complete!' : 'Last Number'}
        </h2>
        <div className="flex items-center justify-center">
          {lastDrawn !== null ? (
            <div className="w-32 h-32 rounded-full bg-white shadow-xl flex items-center justify-center border-4 border-amber-200">
              <span className="text-6xl font-bold text-orange-600">{lastDrawn}</span>
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-white/20 shadow-xl flex items-center justify-center border-4 border-white/30">
              <span className="text-2xl font-semibold text-white/70">--</span>
            </div>
          )}
        </div>
        {isComplete && (
          <p className="text-white/90 font-medium mt-4">All 90 numbers have been called!</p>
        )}
      </div>
    </Card>
  );
}
