import { LastNumberDisplay } from './LastNumberDisplay';
import { HistoryPanel } from './HistoryPanel';

interface HistorySectionProps {
  calledNumbers: number[];
  lastDrawn: number | null;
  isComplete: boolean;
}

export function HistorySection({ calledNumbers, lastDrawn, isComplete }: HistorySectionProps) {
  return (
    <div className="space-y-4">
      {/* Recent/Last Drawn Number Display */}
      <LastNumberDisplay lastDrawn={lastDrawn} isComplete={isComplete} />
      
      {/* Call History Panel */}
      <HistoryPanel calledNumbers={calledNumbers} />
    </div>
  );
}
