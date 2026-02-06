import type { PersistedState, TambolaGameState, AutoDrawSettings } from './types';

const STORAGE_KEY = 'tambola-game-state';

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
    
    return parsed;
  } catch (error) {
    console.error('Failed to load persisted state:', error);
    return null;
  }
}

export function savePersistedState(state: PersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state:', error);
  }
}

export function createInitialGameState(): TambolaGameState {
  const pool = Array.from({ length: 90 }, (_, i) => i + 1);
  return {
    calledNumbers: [],
    remainingPool: pool,
    lastDrawn: null,
    isComplete: false,
  };
}

export function createInitialAutoDrawSettings(): AutoDrawSettings {
  return {
    enabled: false,
    intervalSeconds: 3,
  };
}
