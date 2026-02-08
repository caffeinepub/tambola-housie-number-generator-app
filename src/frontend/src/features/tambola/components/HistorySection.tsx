import { LastNumberDisplay } from './LastNumberDisplay';
import { HistoryPanel } from './HistoryPanel';
import { Button } from '@/components/ui/button';
import { Pause, Play } from 'lucide-react';

interface HistorySectionProps {
  calledNumbers: number[];
  lastDrawn: number | null;
  isComplete: boolean;
  autoDrawEnabled: boolean;
  autoDrawPaused: boolean;
  onTogglePause: () => void;
}

export function HistorySection({ 
  calledNumbers, 
  lastDrawn, 
  isComplete,
  autoDrawEnabled,
  autoDrawPaused,
  onTogglePause,
}: HistorySectionProps) {
  return (
    <div className="space-y-4">
      {/* Recent/Last Drawn Number Display */}
      <LastNumberDisplay lastDrawn={lastDrawn} isComplete={isComplete} />
      
      {/* Pause/Resume Control - Only visible when Auto Draw is enabled */}
      {autoDrawEnabled && (
        <div className="flex justify-center">
          <Button
            onClick={onTogglePause}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            {autoDrawPaused ? (
              <>
                <Play className="h-4 w-4" />
                Resume
              </>
            ) : (
              <>
                <Pause className="h-4 w-4" />
                Pause
              </>
            )}
          </Button>
        </div>
      )}
      
      {/* Call History Panel */}
      <HistoryPanel calledNumbers={calledNumbers} />
    </div>
  );
}
