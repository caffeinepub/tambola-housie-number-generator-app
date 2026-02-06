import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Play, Pause, SkipForward, RotateCcw, Undo2, RefreshCw } from 'lucide-react';

interface GameControlsProps {
  canDraw: boolean;
  canUndo: boolean;
  isComplete: boolean;
  autoDrawEnabled: boolean;
  autoDrawInterval: number;
  onDrawNext: () => void;
  onUndo: () => void;
  onQuickReset: () => void;
  onNewGame: () => void;
  onAutoDrawToggle: (enabled: boolean) => void;
  onIntervalChange: (interval: number) => void;
}

export function GameControls({
  canDraw,
  canUndo,
  isComplete,
  autoDrawEnabled,
  autoDrawInterval,
  onDrawNext,
  onUndo,
  onQuickReset,
  onNewGame,
  onAutoDrawToggle,
  onIntervalChange,
}: GameControlsProps) {
  const [quickResetDialogOpen, setQuickResetDialogOpen] = useState(false);
  const [newGameDialogOpen, setNewGameDialogOpen] = useState(false);

  const handleQuickResetClick = () => {
    setQuickResetDialogOpen(true);
  };

  const handleNewGameClick = () => {
    setNewGameDialogOpen(true);
  };

  const handleQuickResetConfirm = () => {
    onQuickReset();
    setQuickResetDialogOpen(false);
  };

  const handleNewGameConfirm = () => {
    onNewGame();
    setNewGameDialogOpen(false);
  };

  return (
    <>
      <Card className="p-6">
        <div className="space-y-6">
          {/* Main action buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={onDrawNext}
              disabled={!canDraw || autoDrawEnabled}
              size="lg"
              className="flex-1 min-w-[140px] bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold shadow-lg"
            >
              <SkipForward className="mr-2 h-5 w-5" />
              Draw Next
            </Button>
            <Button
              onClick={onUndo}
              disabled={!canUndo || autoDrawEnabled}
              variant="outline"
              size="lg"
              className="flex-1 min-w-[140px]"
            >
              <Undo2 className="mr-2 h-5 w-5" />
              Undo
            </Button>
          </div>

          {/* Reset buttons row */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleQuickResetClick}
              variant="outline"
              size="lg"
              className="flex-1 min-w-[140px]"
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Quick Reset
            </Button>
            <Button
              onClick={handleNewGameClick}
              variant="destructive"
              size="lg"
              className="flex-1 min-w-[140px]"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              New Game
            </Button>
          </div>

          {/* Auto-draw controls */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-draw" className="text-base font-semibold">
                Auto Draw
              </Label>
              <div className="flex items-center gap-2">
                {autoDrawEnabled ? (
                  <Pause className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Play className="h-4 w-4 text-muted-foreground" />
                )}
                <Switch
                  id="auto-draw"
                  checked={autoDrawEnabled}
                  onCheckedChange={onAutoDrawToggle}
                  disabled={isComplete}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="interval" className="text-sm text-muted-foreground">
                  Interval
                </Label>
                <span className="text-sm font-semibold">{autoDrawInterval}s</span>
              </div>
              <Slider
                id="interval"
                min={1}
                max={10}
                step={1}
                value={[autoDrawInterval]}
                onValueChange={(values) => onIntervalChange(values[0])}
                disabled={autoDrawEnabled}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Reset Confirmation Dialog */}
      <AlertDialog open={quickResetDialogOpen} onOpenChange={setQuickResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Quick Reset</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to reset?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction onClick={handleQuickResetConfirm}>Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* New Game Confirmation Dialog */}
      <AlertDialog open={newGameDialogOpen} onOpenChange={setNewGameDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>New Game</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to start a new game?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction onClick={handleNewGameConfirm}>Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
