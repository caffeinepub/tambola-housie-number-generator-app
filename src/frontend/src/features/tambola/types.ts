// Tambola game state types for 1-90 gameplay
export interface TambolaGameState {
  calledNumbers: number[];
  remainingPool: number[];
  lastDrawn: number | null;
  isComplete: boolean;
}

export interface AutoDrawSettings {
  enabled: boolean;
  intervalSeconds: number;
}

export interface PersistedState {
  gameState: TambolaGameState;
  autoDrawSettings: AutoDrawSettings;
}

export type GameAction = 'draw' | 'undo' | 'reset' | 'new-game' | 'idle';
