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
        // When recording-first is selected, check if a recording exists for this number
        // If it does, play ONLY the recording and skip all TTS steps
        if (voiceSourcePriority === 'recording-first') {
          try {
            const blob = await loadClip(number);
            if (blob) {
              // Recording exists - play it and exit (no TTS at all)
              await playAudioBlob(blob);
              failureCountRef.current = 0;
              setStatus('idle');
              return;
            }
            // No recording found, continue with TTS flow below
          } catch (error) {
            // Recording playback failed - exit without TTS fallback
            console.error(`Recording for ${number} failed, no TTS fallback in recording-first mode:`, error);
            setStatus('idle');
            return;
          }
        }

        // Build playback sequence based on reading mode (TTS flow)
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
            // Full-number step: always use TTS in this flow
            // (recording-first with existing clip already returned above)
            const result = await speakText(step.value.toString());
            if (result !== 'success') {
              hadTTSFailure = true;
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
