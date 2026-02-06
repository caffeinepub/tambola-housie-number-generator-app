import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Volume2, Settings } from 'lucide-react';
import type { ReadingMode, VoiceSourcePriority } from '../voice/types';

interface VoiceAnnouncementsPanelProps {
  voiceEnabled: boolean;
  readingMode: ReadingMode;
  voiceSourcePriority: VoiceSourcePriority;
  onVoiceToggle: (enabled: boolean) => void;
  onReadingModeChange: (mode: ReadingMode) => void;
  onVoiceSourcePriorityChange: (priority: VoiceSourcePriority) => void;
  onOpenVoiceManager: () => void;
}

export function VoiceAnnouncementsPanel({
  voiceEnabled,
  readingMode,
  voiceSourcePriority,
  onVoiceToggle,
  onReadingModeChange,
  onVoiceSourcePriorityChange,
  onOpenVoiceManager,
}: VoiceAnnouncementsPanelProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
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

        <div className="space-y-2">
          <Label htmlFor="reading-mode" className="text-sm text-muted-foreground">
            Reading Mode
          </Label>
          <Select value={readingMode} onValueChange={onReadingModeChange}>
            <SelectTrigger id="reading-mode">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single Digit Number Reader</SelectItem>
              <SelectItem value="digits-then-number">
                Digit then Number Reader
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Numbers 1-9 are always announced as "single number" followed by the digit in both modes.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="voice-source-priority" className="text-sm text-muted-foreground">
            Voice Source Priority
          </Label>
          <Select value={voiceSourcePriority} onValueChange={onVoiceSourcePriorityChange}>
            <SelectTrigger id="voice-source-priority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recording-first">Recording First</SelectItem>
              <SelectItem value="tts-first">TTS First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={onOpenVoiceManager}
        >
          <Settings className="mr-2 h-4 w-4" />
          Manage Host Voice Recordings
        </Button>
      </div>
    </Card>
  );
}
