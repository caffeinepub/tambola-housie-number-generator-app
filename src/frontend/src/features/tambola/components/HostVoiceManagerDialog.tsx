// Host recording/management UI for numbers 1-90

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
    stopRecording();
    setRecordingNumber(null);
    // Refresh the list after a short delay to ensure the clip is saved
    setTimeout(() => {
      loadRecordedNumbers();
    }, 100);
  };

  const handlePreview = async (number: number) => {
    try {
      setPlayingNumber(number);
      const clip = await loadClip(number);
      if (clip) {
        await playAudioBlob(clip);
      }
    } catch (error) {
      console.error('Preview error:', error);
    } finally {
      setPlayingNumber(null);
    }
  };

  const handleDelete = async (number: number) => {
    await deleteClip(number);
    await loadRecordedNumbers();
  };

  const allNumbers = Array.from({ length: 90 }, (_, i) => i + 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Manage Host Voice Recordings</DialogTitle>
          <DialogDescription>
            Record your voice for each number (1-90). These recordings will be played when numbers are drawn.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md text-sm">
            {error}
          </div>
        )}

        <ScrollArea className="h-[500px] pr-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {allNumbers.map((number) => {
              const hasRecording = recordedNumbers.has(number);
              const isCurrentlyRecording = recordingNumber === number && isRecording;
              const isCurrentlyPlaying = playingNumber === number;

              return (
                <div
                  key={number}
                  className="border rounded-lg p-4 space-y-3 bg-card"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">{number}</span>
                      {hasRecording ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <Badge variant={hasRecording ? 'default' : 'outline'}>
                      {hasRecording ? 'Recorded' : 'Missing'}
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    {!isCurrentlyRecording ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRecord(number)}
                        disabled={isRecording || isCurrentlyPlaying}
                        className="flex-1"
                      >
                        <Mic className="h-4 w-4 mr-1" />
                        Record
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={handleStopRecording}
                        className="flex-1"
                      >
                        <Square className="h-4 w-4 mr-1" />
                        Stop
                      </Button>
                    )}

                    {hasRecording && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePreview(number)}
                          disabled={isRecording || isCurrentlyPlaying}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(number)}
                          disabled={isRecording || isCurrentlyPlaying}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {recordedNumbers.size} of 90 numbers recorded
          </div>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
