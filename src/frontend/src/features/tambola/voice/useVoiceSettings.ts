// Hook for managing voice settings (enabled toggle + reading mode + voice source priority)

import { useState, useEffect } from 'react';
import type { VoiceSettings, ReadingMode, VoiceSourcePriority } from './types';
import { loadVoiceSettings, saveVoiceSettings } from './voiceSettingsStorage';

export function useVoiceSettings() {
  const [settings, setSettings] = useState<VoiceSettings>(() => loadVoiceSettings());

  useEffect(() => {
    saveVoiceSettings(settings);
  }, [settings]);

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
