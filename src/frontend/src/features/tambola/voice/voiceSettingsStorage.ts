// localStorage persistence for voice settings

import type { VoiceSettings } from './types';

const VOICE_SETTINGS_KEY = 'tambola-voice-settings';

const DEFAULT_SETTINGS: VoiceSettings = {
  enabled: true,
  readingMode: 'single',
  voiceSourcePriority: 'tts-first',
};

export function loadVoiceSettings(): VoiceSettings {
  try {
    const stored = localStorage.getItem(VOICE_SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to handle new settings
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (error) {
    console.error('Failed to load voice settings:', error);
  }
  return DEFAULT_SETTINGS;
}

export function saveVoiceSettings(settings: VoiceSettings): void {
  try {
    localStorage.setItem(VOICE_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save voice settings:', error);
  }
}
