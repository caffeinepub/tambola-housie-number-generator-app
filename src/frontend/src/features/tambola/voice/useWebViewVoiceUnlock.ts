// WebView-compatible voice unlock hook for session-scoped TTS initialization

import { useState, useCallback, useRef } from 'react';
import { unlockAudio, isAudioUnlocked } from './voiceAudio';
import { primeVoices, warmUpSpeech } from './tts';

export type VoiceUnlockStatus = 'not-initialized' | 'initializing' | 'ready' | 'failed';

export function useWebViewVoiceUnlock() {
  const [status, setStatus] = useState<VoiceUnlockStatus>('not-initialized');
  const initAttemptedRef = useRef(false);

  const initialize = useCallback(async () => {
    // Allow re-initialization after reset
    initAttemptedRef.current = true;
    setStatus('initializing');

    try {
      // Step 1: Prime SpeechSynthesis voices
      await primeVoices();

      // Step 2: Unlock audio context for recorded clips
      await unlockAudio();

      // Step 3: Perform a warm-up speak to ensure TTS is ready
      await warmUpSpeech();

      setStatus('ready');
    } catch (error) {
      console.error('Voice initialization failed:', error);
      // If initialization fails due to user-gesture requirement,
      // reset to 'not-initialized' so the user can try again via the UI
      // (e.g., by pressing "Enable Voice" button)
      setStatus('not-initialized');
    }
  }, []);

  const reset = useCallback(() => {
    initAttemptedRef.current = false;
    setStatus('not-initialized');
  }, []);

  return {
    status,
    initialize,
    reset,
    isReady: status === 'ready',
    isInitializing: status === 'initializing',
    hasFailed: status === 'failed',
    audioUnlocked: isAudioUnlocked(),
  };
}
