// Browser SpeechSynthesis TTS helpers for fallback voice announcements - English only

let voicesLoaded = false;
let availableVoices: SpeechSynthesisVoice[] = [];
let cachedEnglishVoice: SpeechSynthesisVoice | null = null;

// Wait for voices to load (some browsers load them asynchronously)
function ensureVoicesLoaded(): Promise<void> {
  return new Promise((resolve) => {
    if (voicesLoaded && availableVoices.length > 0) {
      resolve();
      return;
    }

    const loadVoices = () => {
      availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        voicesLoaded = true;
        resolve();
      }
    };

    loadVoices();

    if (!voicesLoaded) {
      window.speechSynthesis.addEventListener('voiceschanged', () => {
        loadVoices();
      }, { once: true });

      // Fallback timeout
      setTimeout(() => {
        if (!voicesLoaded) {
          availableVoices = window.speechSynthesis.getVoices();
          voicesLoaded = true;
          resolve();
        }
      }, 1000);
    }
  });
}

// Check if TTS is available
export function isTTSAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

// Select best English voice (prefer en-IN, then en-US, then any en-*)
function selectEnglishVoice(): SpeechSynthesisVoice | null {
  // Return cached voice if available
  if (cachedEnglishVoice) {
    return cachedEnglishVoice;
  }

  if (availableVoices.length === 0) {
    return null;
  }

  // Filter for English voices only
  const englishVoices = availableVoices.filter(v => v.lang.startsWith('en'));

  if (englishVoices.length === 0) {
    // No English voices available, return null (will use lang hint)
    return null;
  }

  // Priority 1: Indian English (en-IN)
  const indianEnglish = englishVoices.find(v => v.lang.startsWith('en-IN'));
  if (indianEnglish) {
    cachedEnglishVoice = indianEnglish;
    return indianEnglish;
  }

  // Priority 2: US English (en-US)
  const usEnglish = englishVoices.find(v => v.lang.startsWith('en-US'));
  if (usEnglish) {
    cachedEnglishVoice = usEnglish;
    return usEnglish;
  }

  // Priority 3: Any English voice
  cachedEnglishVoice = englishVoices[0];
  return englishVoices[0];
}

// Get voice match status for UI display
export async function getVoiceMatchStatus(): Promise<{ hasExactMatch: boolean; selectedVoice: SpeechSynthesisVoice | null }> {
  if (!isTTSAvailable()) {
    return { hasExactMatch: false, selectedVoice: null };
  }

  await ensureVoicesLoaded();
  const voice = selectEnglishVoice();
  
  // Consider it an exact match if we found an Indian English voice
  const hasExactMatch = voice !== null && voice.lang.startsWith('en-IN');
  
  return { hasExactMatch, selectedVoice: voice };
}

// Speak text using SpeechSynthesis with English-only voice
export async function speakText(text: string): Promise<void> {
  if (!isTTSAvailable()) {
    console.warn('SpeechSynthesis not supported');
    return;
  }

  // Ensure voices are loaded
  await ensureVoicesLoaded();

  return new Promise((resolve) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Select English voice
    const voice = selectEnglishVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      // No English voice available - set English lang hint anyway
      // Prefer en-IN, fallback to en-US
      utterance.lang = 'en-IN';
    }

    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onend = () => {
      resolve();
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      // Don't reject - resolve to continue sequence
      resolve();
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Failed to speak:', error);
      resolve();
    }
  });
}

// Speak a number
export async function speakNumber(number: number): Promise<void> {
  return speakText(number.toString());
}

// Cancel any ongoing speech
export function cancelSpeech(): void {
  if (isTTSAvailable()) {
    window.speechSynthesis.cancel();
  }
}
