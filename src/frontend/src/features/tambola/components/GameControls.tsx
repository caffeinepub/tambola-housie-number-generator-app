import { useState, useEffect } from 'react';
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
import { Play, Pause, SkipForward, RefreshCw, Volume2 } from 'lucide-react';

interface GameControlsProps {
  canDraw: boolean;
  isComplete: boolean;
  autoDrawEnabled: boolean;
  autoDrawInterval: number;
  voiceEnabled: boolean;
  onDrawNext: () => void;
  onQuickReset: () => void;
  onAutoDrawToggle: (enabled: boolean) => void;
  onIntervalChange: (interval: number) => void;
  onVoiceToggle: (enabled: boolean) => void;
}

export function GameControls({
  canDraw,
  isComplete,
  autoDrawEnabled,
  autoDrawInterval,
  voiceEnabled,
  onDrawNext,
  onQuickReset,
  onAutoDrawToggle,
  onIntervalChange,
  onVoiceToggle,
}: GameControlsProps) {
  const [quickResetDialogOpen, setQuickResetDialogOpen] = useState(false);
  const [drawCooldown, setDrawCooldown] = useState(0);

  // Handle draw button click with cooldown
  const handleDrawClick = () => {
    if (drawCooldown > 0) return;
    onDrawNext();
    setDrawCooldown(4); // 4 second cooldown
  };

  // Countdown timer for draw button cooldown
  useEffect(() => {
    if (drawCooldown > 0) {
      const timer = setTimeout(() => {
        setDrawCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [drawCooldown]);

  // Reset cooldown when game is reset or completed
  useEffect(() => {
    if (isComplete || !canDraw) {
      setDrawCooldown(0);
    }
  }, [isComplete, canDraw]);

  const handleQuickResetClick = () => {
    setQuickResetDialogOpen(true);
  };

  const handleQuickResetConfirm = () => {
    setQuickResetDialogOpen(false);
    onQuickReset();
    setDrawCooldown(0);
  };

  const handleQuickResetCancel = () => {
    setQuickResetDialogOpen(false);
  };

  const isDrawDisabled = !canDraw || drawCooldown > 0 || isComplete;

  return (
    <>
      <Card className="p-6">
        <div className="space-y-6">
          {/* Main action buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleDrawClick}
              disabled={isDrawDisabled}
              size="lg"
              className="flex-1 min-w-[140px] bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold shadow-lg"
            >
              <SkipForward className="mr-2 h-5 w-5" />
              {drawCooldown > 0 ? `Wait ${drawCooldown}s` : 'Draw Number'}
            </Button>
            <Button
              onClick={handleQuickResetClick}
              variant="outline"
              size="lg"
              className="flex-1 min-w-[140px]"
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Quick Reset
            </Button>
          </div>

          {/* Voice Announcements and Auto-draw controls */}
          <div className="space-y-4 pt-4 border-t">
            {/* Voice Announcements toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="voice-enabled" className="text-base font-semibold">
                Voice Announcements
              </Label>
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <Switch
                  id="voice-enabled"
                  checked={voiceEnabled}
                  onCheckedChange={onVoiceToggle}
                />
              </div>
            </div>

            {/* Auto Draw toggle */}
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

            {/* Interval slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="interval" className="text-sm text-muted-foreground">
                  Interval
                </Label>
                <span className="text-sm font-semibold">{autoDrawInterval}s</span>
              </div>
              <Slider
                id="interval"
                min={4}
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
            <AlertDialogCancel onClick={handleQuickResetCancel}>No</AlertDialogCancel>
            <AlertDialogAction onClick={handleQuickResetConfirm}>Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
