// Voice announcement controller with mixed playback step support (numeric and text)

import { useCallback, useRef } from 'react';
import type { ReadingMode, VoiceSourcePriority, PlaybackStep } from './types';
import { speakText } from './tts';
import { loadClip } from './voiceClipsStore';
import { playAudioBlob } from './voiceAudio';

export function useVoiceAnnouncements() {
  const isPlayingRef = useRef(false);

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

      try {
        // Build playback sequence based on reading mode
        const steps: PlaybackStep[] = [];

        if (number >= 1 && number <= 9) {
          // For single digits: always announce as "single number <N>"
          steps.push({ text: `single number ${number}` });
        } else if (readingMode === 'digits-then-number') {
          // For multi-digit numbers in digits-then-number mode:
          // Split into individual digits, then say the full number
          const digits = number.toString().split('');
          digits.forEach((digit) => steps.push(parseInt(digit, 10)));
          steps.push(number);
        } else {
          // For multi-digit numbers in single mode: just say the number
          steps.push(number);
        }

        // Play each step in sequence with per-step fallback
        for (const step of steps) {
          if (typeof step === 'number') {
            // Numeric step: try recording first or TTS first based on priority
            if (voiceSourcePriority === 'recording-first') {
              try {
                const blob = await loadClip(step);
                if (blob) {
                  await playAudioBlob(blob);
                } else {
                  // No recording, use TTS
                  await speakText(step.toString());
                }
              } catch (error) {
                // Recording playback failed, fallback to TTS
                console.log(`Recording for ${step} failed, using TTS fallback`);
                await speakText(step.toString());
              }
            } else {
              // TTS first
              await speakText(step.toString());
            }
          } else {
            // Text phrase step: always use TTS
            await speakText(step.text);
          }
        }
      } catch (error) {
        console.error('Voice announcement error:', error);
      } finally {
        isPlayingRef.current = false;
      }
    },
    []
  );

  return { announceNumber };
}
