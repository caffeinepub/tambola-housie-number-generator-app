import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Mic, Square, Play, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { useHostVoiceRecorder } from '../voice/useHostVoiceRecorder';
import { listRecordedNumbers, deleteClip, loadClip } from '../voice/voiceClipsStore';
import { playAudioBlob } from '../voice/voiceAudio';

interface HostVoiceManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HostVoiceManagerDialog({ open, onOpenChange }: HostVoiceManagerDialogProps) {
  const [recordedNumbers, setRecordedNumbers] = useState<Set<number>>(new Set());
  const [recordingNumber, setRecordingNumber] = useState<number | null>(null);
  const [playingNumber, setPlayingNumber] = useState<number | null>(null);
  const { isRecording, error, startRecording, stopRecording } = useHostVoiceRecorder();

  const loadRecordedNumbers = async () => {
    const numbers = await listRecordedNumbers();
    setRecordedNumbers(new Set(numbers));
  };

  useEffect(() => {
    if (open) {
      loadRecordedNumbers();
    }
  }, [open]);

  const handleRecord = async (number: number) => {
    setRecordingNumber(number);
    await startRecording(number);
  };

  const handleStopRecording = async () => {
    await stopRecording();
    setRecordingNumber(null);
    await loadRecordedNumbers();
  };

  const handlePlay = async (number: number) => {
    setPlayingNumber(number);
    const blob = await loadClip(number);
    if (blob) {
      try {
        await playAudioBlob(blob);
      } catch (err) {
        console.error('Playback failed:', err);
      }
    }
    setPlayingNumber(null);
  };

  const handleDelete = async (number: number) => {
    await deleteClip(number);
    await loadRecordedNumbers();
  };

  const isRecorded = (number: number) => recordedNumbers.has(number);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Host Voice Recordings</DialogTitle>
          <DialogDescription>
            Record your voice for numbers 1-90. Click the microphone to start recording, click stop when done.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </div>
        )}

        <ScrollArea className="h-[500px] pr-4">
          <div className="grid grid-cols-5 gap-3">
            {Array.from({ length: 90 }, (_, i) => i + 1).map((number) => {
              const recorded = isRecorded(number);
              const isCurrentlyRecording = recordingNumber === number && isRecording;
              const isCurrentlyPlaying = playingNumber === number;

              return (
                <div
                  key={number}
                  className="flex flex-col items-center gap-2 p-3 border rounded-lg bg-card"
                >
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-semibold">{number}</span>
                    {recorded ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex gap-1">
                    {!recorded && !isCurrentlyRecording && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRecord(number)}
                        disabled={isRecording}
                      >
                        <Mic className="h-3 w-3" />
                      </Button>
                    )}

                    {isCurrentlyRecording && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={handleStopRecording}
                      >
                        <Square className="h-3 w-3" />
                      </Button>
                    )}

                    {recorded && !isCurrentlyRecording && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePlay(number)}
                          disabled={isCurrentlyPlaying}
                        >
                          <Play className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(number)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between pt-4 border-t">
          <Badge variant="secondary">
            {recordedNumbers.size} / 90 recorded
          </Badge>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
