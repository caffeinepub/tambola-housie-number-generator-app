// Voice announcement types

export type ReadingMode = 'single' | 'digits-then-number';

export type VoiceSourcePriority = 'recording-first' | 'tts-first';

export interface VoiceSettings {
  enabled: boolean;
  readingMode: ReadingMode;
  voiceSourcePriority: VoiceSourcePriority;
}

// Playback step types to distinguish digit-only steps from full-number steps
export type PlaybackStep = 
  | { type: 'text'; text: string }           // TTS-only text phrase
  | { type: 'digit'; value: number }         // TTS-only digit (0-9)
  | { type: 'full-number'; value: number };  // Full number (1-90), eligible for recordings
