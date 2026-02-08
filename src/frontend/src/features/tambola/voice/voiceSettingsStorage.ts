// Non-persistent voice settings defaults (session-only)

import type { VoiceSettings } from './types';

const VOICE_SETTINGS_KEY = 'tambola-voice-settings';

const DEFAULT_SETTINGS: VoiceSettings = {
  enabled: false, // Default to OFF (Draft 52 behavior)
  readingMode: 'digits-then-number',
  voiceSourcePriority: 'tts-first',
};

export function getDefaultVoiceSettings(): VoiceSettings {
  return { ...DEFAULT_SETTINGS };
}

// Clear any existing stored settings on startup to ensure clean state
export function clearStoredVoiceSettings(): void {
  try {
    localStorage.removeItem(VOICE_SETTINGS_KEY);
  } catch (error) {
    // Silently ignore errors
  }
}
