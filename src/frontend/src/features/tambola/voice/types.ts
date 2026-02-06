// Voice announcement types

export type ReadingMode = 'single' | 'digits-then-number';

export type VoiceSourcePriority = 'recording-first' | 'tts-first';

export interface VoiceSettings {
  enabled: boolean;
  readingMode: ReadingMode;
  voiceSourcePriority: VoiceSourcePriority;
}

// Playback step can be either a number (for recordings/TTS) or a text phrase (for TTS-only announcements)
export type PlaybackStep = number | { text: string };
