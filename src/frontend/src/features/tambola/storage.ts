import type { TambolaGameState, AutoDrawSettings } from './types';

const STORAGE_KEY = 'tambola-game-state';

interface PersistedState {
  gameState: TambolaGameState;
  autoDrawSettings: AutoDrawSettings;
}

export function createInitialGameState(): TambolaGameState {
  return {
    calledNumbers: [],
    remainingPool: Array.from({ length: 90 }, (_, i) => i + 1),
    lastDrawn: null,
    isComplete: false,
  };
}

export function createInitialAutoDrawSettings(): AutoDrawSettings {
  return {
    enabled: false,
    intervalSeconds: 4, // Changed from 5 to 4
  };
}

export function savePersistedState(state: PersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
}

export function loadPersistedState(): PersistedState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as PersistedState;

    // Validate the structure
    if (
      !parsed.gameState ||
      !Array.isArray(parsed.gameState.calledNumbers) ||
      !Array.isArray(parsed.gameState.remainingPool)
    ) {
      return null;
    }

    // Ensure interval is at least 4 seconds
    if (parsed.autoDrawSettings && parsed.autoDrawSettings.intervalSeconds < 4) {
      parsed.autoDrawSettings.intervalSeconds = 4;
    }

    return parsed;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
}
