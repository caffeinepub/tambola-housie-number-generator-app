// Browser audio helpers for playing recorded voice clips with error handling

let audioContext: AudioContext | null = null;
let currentAudio: HTMLAudioElement | null = null;
let isUnlocked = false;

export function initAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

export async function unlockAudio(): Promise<void> {
  const ctx = initAudioContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
  isUnlocked = true;
}

export function isAudioUnlocked(): boolean {
  return isUnlocked;
}

export function playAudioBlob(blob: Blob): Promise<void> {
  return new Promise((resolve, reject) => {
    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = '';
    }

    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    currentAudio = audio;

    audio.onended = () => {
      URL.revokeObjectURL(url);
      currentAudio = null;
      resolve();
    };

    audio.onerror = (error) => {
      URL.revokeObjectURL(url);
      currentAudio = null;
      reject(new Error('Audio playback failed'));
    };

    audio.play().catch((error) => {
      URL.revokeObjectURL(url);
      currentAudio = null;
      reject(error);
    });
  });
}

export function stopCurrentAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = '';
    currentAudio = null;
  }
}
