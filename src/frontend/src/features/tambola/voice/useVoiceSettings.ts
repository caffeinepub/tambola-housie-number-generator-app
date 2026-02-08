// Hook for managing voice settings (enabled toggle + reading mode + voice source priority)
// Settings are session-only and reset on page reload

import { useState } from 'react';
import type { VoiceSettings, ReadingMode, VoiceSourcePriority } from './types';
import { getDefaultVoiceSettings, clearStoredVoiceSettings } from './voiceSettingsStorage';

export function useVoiceSettings() {
  const [settings, setSettings] = useState<VoiceSettings>(() => {
    // Clear any existing stored settings to ensure clean state
    clearStoredVoiceSettings();
    // Always start with defaults (enabled: false)
    return getDefaultVoiceSettings();
  });

  const setEnabled = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, enabled }));
  };

  const setReadingMode = (readingMode: ReadingMode) => {
    setSettings((prev) => ({ ...prev, readingMode }));
  };

  const setVoiceSourcePriority = (voiceSourcePriority: VoiceSourcePriority) => {
    setSettings((prev) => ({ ...prev, voiceSourcePriority }));
  };

  return {
    settings,
    setEnabled,
    setReadingMode,
    setVoiceSourcePriority,
  };
}
