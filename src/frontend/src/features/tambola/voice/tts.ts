// Browser SpeechSynthesis TTS helpers for fallback voice announcements

let voicesLoaded = false;
let availableVoices: SpeechSynthesisVoice[] = [];

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

// Select best matching Indian female voice with match status
function selectVoiceWithStatus(): { voice: SpeechSynthesisVoice | null; hasExactMatch: boolean } {
  if (availableVoices.length === 0) {
    return { voice: null, hasExactMatch: false };
  }

  // Step 1: Try to find Indian locale voices with female gender
  let indianCandidates = availableVoices.filter(v => 
    v.lang.startsWith('en-IN') || v.lang.startsWith('hi-IN') || v.lang.includes('-IN')
  );

  if (indianCandidates.length > 0) {
    // Try to match female gender within Indian voices
    const genderMatch = indianCandidates.find(v => {
      const nameLower = v.name.toLowerCase();
      return nameLower.includes('female') || 
             nameLower.includes('woman') || 
             nameLower.includes('nisha') || 
             nameLower.includes('priya') ||
             nameLower.includes('girl');
    });

    if (genderMatch) {
      return { voice: genderMatch, hasExactMatch: true };
    }
  }

  // Step 2: No Indian female voice - search ALL voices for female gender
  const allFemaleMatches = availableVoices.filter(v => {
    const nameLower = v.name.toLowerCase();
    return nameLower.includes('female') || 
           nameLower.includes('woman') || 
           nameLower.includes('girl') ||
           nameLower.includes('nisha') || 
           nameLower.includes('priya') ||
           nameLower.includes('samantha') ||
           nameLower.includes('victoria') ||
           nameLower.includes('karen');
  });

  if (allFemaleMatches.length > 0) {
    // Prefer English voices among female matches
    const englishFemaleMatch = allFemaleMatches.find(v => v.lang.startsWith('en'));
    return { 
      voice: englishFemaleMatch || allFemaleMatches[0], 
      hasExactMatch: false 
    };
  }

  // Step 3: No female match found - fallback to Indian voice or first available
  if (indianCandidates.length > 0) {
    return { voice: indianCandidates[0], hasExactMatch: false };
  }

  // Step 4: Final fallback - any English voice or first available
  const englishVoice = availableVoices.find(v => v.lang.startsWith('en'));
  return { voice: englishVoice || availableVoices[0], hasExactMatch: false };
}

// Get voice match status for UI display
export async function getVoiceMatchStatus(): Promise<{ hasExactMatch: boolean; selectedVoice: SpeechSynthesisVoice | null }> {
  if (!isTTSAvailable()) {
    return { hasExactMatch: false, selectedVoice: null };
  }

  await ensureVoicesLoaded();
  const { voice, hasExactMatch } = selectVoiceWithStatus();
  return { hasExactMatch, selectedVoice: voice };
}

// Select best matching Indian female voice
function selectVoice(): SpeechSynthesisVoice | null {
  const { voice } = selectVoiceWithStatus();
  return voice;
}

// Speak text using SpeechSynthesis
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
    
    // Select voice
    const voice = selectVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      // Fallback to default with Indian locale hint
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
