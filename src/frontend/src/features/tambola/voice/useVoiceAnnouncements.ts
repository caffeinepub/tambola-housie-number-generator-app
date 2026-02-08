// Voice announcement controller with exact number-matched playback - English only

import { useCallback, useRef, useState } from 'react';
import type { ReadingMode, VoiceSourcePriority, PlaybackStep } from './types';
import { speakText, type TTSAttemptResult } from './tts';
import { loadClip } from './voiceClipsStore';
import { playAudioBlob } from './voiceAudio';

export type AnnouncementStatus = 'idle' | 'playing' | 'tts-failing';

export function useVoiceAnnouncements() {
  const isPlayingRef = useRef(false);
  const [status, setStatus] = useState<AnnouncementStatus>('idle');
  const failureCountRef = useRef(0);

  const announceNumber = useCallback(
    async (
      number: number,
      readingMode: ReadingMode,
      voiceSourcePriority: VoiceSourcePriority
    ) => {
      if (isPlayingRef.current) {
        console.log('Voice announcement already in progress, skipping');
        return;
      }

      isPlayingRef.current = true;
      setStatus('playing');

      try {
        // Build playback sequence based on reading mode
        const steps: PlaybackStep[] = [];

        if (number >= 1 && number <= 9) {
          // For single digits: announce "single number" phrase, then the digit as full-number
          steps.push({ type: 'text', text: 'single number' });
          steps.push({ type: 'full-number', value: number });
        } else if (readingMode === 'digits-then-number') {
          // For multi-digit numbers in digits-then-number mode:
          // 1. Speak each digit individually (TTS-only, no recordings)
          // 2. Then speak the full number (eligible for recordings)
          const digits = number.toString().split('');
          digits.forEach((digit) => {
            steps.push({ type: 'digit', value: parseInt(digit, 10) });
          });
          steps.push({ type: 'full-number', value: number });
        } else {
          // For multi-digit numbers in single mode: just the full number
          steps.push({ type: 'full-number', value: number });
        }

        let hadTTSFailure = false;

        // Play each step in sequence with per-step fallback
        for (const step of steps) {
          if (step.type === 'text') {
            // Text phrase: always use TTS
            const result = await speakText(step.text);
            if (result !== 'success') {
              hadTTSFailure = true;
            }
          } else if (step.type === 'digit') {
            // Digit step: always use TTS (never check recordings)
            const result = await speakText(step.value.toString());
            if (result !== 'success') {
              hadTTSFailure = true;
            }
          } else if (step.type === 'full-number') {
            // Full-number step: eligible for recordings based on priority
            if (voiceSourcePriority === 'recording-first') {
              try {
                const blob = await loadClip(step.value);
                if (blob) {
                  await playAudioBlob(blob);
                } else {
                  // No recording, use TTS
                  const result = await speakText(step.value.toString());
                  if (result !== 'success') {
                    hadTTSFailure = true;
                  }
                }
              } catch (error) {
                // Recording playback failed, fallback to TTS
                console.log(`Recording for ${step.value} failed, using TTS fallback`);
                const result = await speakText(step.value.toString());
                if (result !== 'success') {
                  hadTTSFailure = true;
                }
              }
            } else {
              // TTS first
              const result = await speakText(step.value.toString());
              if (result !== 'success') {
                hadTTSFailure = true;
              }
            }
          }
        }

        // Track TTS failures
        if (hadTTSFailure) {
          failureCountRef.current += 1;
          if (failureCountRef.current >= 2) {
            setStatus('tts-failing');
          }
        } else {
          failureCountRef.current = 0;
          setStatus('idle');
        }
      } catch (error) {
        console.error('Voice announcement error:', error);
        setStatus('idle');
      } finally {
        isPlayingRef.current = false;
      }
    },
    []
  );

  return { announceNumber, status };
}
