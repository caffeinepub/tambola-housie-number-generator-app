import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Settings, AlertCircle, Loader2, Info } from 'lucide-react';
import type { ReadingMode, VoiceSourcePriority } from '../voice/types';
import type { VoiceUnlockStatus } from '../voice/useWebViewVoiceUnlock';
import type { AnnouncementStatus } from '../voice/useVoiceAnnouncements';
import { VoiceTroubleshootingHint } from './VoiceTroubleshootingHint';
import { isTTSAvailable } from '../voice/tts';

interface VoiceAnnouncementsPanelProps {
  voiceEnabled: boolean;
  readingMode: ReadingMode;
  voiceSourcePriority: VoiceSourcePriority;
  voiceUnlockStatus: VoiceUnlockStatus;
  announcementStatus: AnnouncementStatus;
  onReadingModeChange: (mode: ReadingMode) => void;
  onVoiceSourcePriorityChange: (priority: VoiceSourcePriority) => void;
  onOpenVoiceManager: () => void;
  onInitializeVoice: () => void;
}

export function VoiceAnnouncementsPanel({
  voiceEnabled,
  readingMode,
  voiceSourcePriority,
  voiceUnlockStatus,
  announcementStatus,
  onReadingModeChange,
  onVoiceSourcePriorityChange,
  onOpenVoiceManager,
  onInitializeVoice,
}: VoiceAnnouncementsPanelProps) {
  const ttsAvailable = isTTSAvailable();
  const showTroubleshooting = voiceEnabled && voiceUnlockStatus === 'ready' && announcementStatus === 'tts-failing';

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">Voice Announcements</h3>
        </div>

        {!ttsAvailable && voiceEnabled && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>Text-to-speech is not supported in this browser or environment.</span>
            </p>
          </div>
        )}

        {ttsAvailable && voiceEnabled && voiceUnlockStatus === 'not-initialized' && (
          <div className="p-3 bg-muted rounded-md space-y-3">
            <p className="text-sm text-muted-foreground">
              Voice needs to be initialized with a user gesture to work in this environment.
            </p>
            <Button onClick={onInitializeVoice} size="sm" className="w-full">
              Enable Voice
            </Button>
          </div>
        )}

        {ttsAvailable && voiceEnabled && voiceUnlockStatus === 'initializing' && (
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
              <span>Initializing voice...</span>
            </p>
          </div>
        )}

        {ttsAvailable && voiceEnabled && voiceUnlockStatus === 'failed' && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md space-y-3">
            <p className="text-sm text-destructive flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>Voice initialization failed. Try again.</span>
            </p>
            <Button onClick={onInitializeVoice} size="sm" variant="outline" className="w-full">
              Retry
            </Button>
          </div>
        )}

        <VoiceTroubleshootingHint show={showTroubleshooting} />

        {voiceEnabled && (
          <>
            <div className="space-y-2">
              <Label htmlFor="reading-mode" className="text-sm text-muted-foreground">
                Reading Mode
              </Label>
              <Select value={readingMode} onValueChange={onReadingModeChange}>
                <SelectTrigger id="reading-mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Number</SelectItem>
                  <SelectItem value="digits-then-number">Digits then Number</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="voice-source" className="text-sm text-muted-foreground">
                Voice Source Priority
              </Label>
              <Select value={voiceSourcePriority} onValueChange={onVoiceSourcePriorityChange}>
                <SelectTrigger id="voice-source">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tts-first">Text-to-Speech</SelectItem>
                  <SelectItem value="recording-first">Host Recording</SelectItem>
                </SelectContent>
              </Select>
              {voiceSourcePriority === 'recording-first' && (
                <div className="p-2 bg-muted/50 rounded-md">
                  <p className="text-xs text-muted-foreground flex items-start gap-2">
                    <Info className="h-3 w-3 flex-shrink-0 mt-0.5" />
                    <span>When a recording exists for a number, TTS is disabled and only the recording plays.</span>
                  </p>
                </div>
              )}
            </div>

            <Button
              onClick={onOpenVoiceManager}
              variant="outline"
              className="w-full"
            >
              <Settings className="mr-2 h-4 w-4" />
              Manage Host Voice Recordings
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}
