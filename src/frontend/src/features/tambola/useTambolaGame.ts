import { useState, useEffect, useCallback, useRef } from 'react';
import type { TambolaGameState, AutoDrawSettings, GameAction } from './types';
import {
  loadPersistedState,
  savePersistedState,
  createInitialGameState,
  createInitialAutoDrawSettings,
} from './storage';

export function useTambolaGame() {
  const [gameState, setGameState] = useState<TambolaGameState>(() => {
    const persisted = loadPersistedState();
    return persisted?.gameState || createInitialGameState();
  });

  const [autoDrawSettings, setAutoDrawSettings] = useState<AutoDrawSettings>(() => {
    const persisted = loadPersistedState();
    return persisted?.autoDrawSettings || createInitialAutoDrawSettings();
  });

  const [lastAction, setLastAction] = useState<GameAction>('idle');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Persist state changes
  useEffect(() => {
    savePersistedState({ gameState, autoDrawSettings });
  }, [gameState, autoDrawSettings]);

  // Draw next random number
  const drawNext = useCallback(() => {
    if (gameState.remainingPool.length === 0) return;

    const randomIndex = Math.floor(Math.random() * gameState.remainingPool.length);
    const drawnNumber = gameState.remainingPool[randomIndex];

    const newRemainingPool = gameState.remainingPool.filter((_, idx) => idx !== randomIndex);
    const newCalledNumbers = [...gameState.calledNumbers, drawnNumber];

    setGameState({
      calledNumbers: newCalledNumbers,
      remainingPool: newRemainingPool,
      lastDrawn: drawnNumber,
      isComplete: newRemainingPool.length === 0,
    });
    setLastAction('draw');
  }, [gameState.remainingPool, gameState.calledNumbers]);

  // Undo last draw
  const undoLastDraw = useCallback(() => {
    if (gameState.calledNumbers.length === 0) return;

    const lastNumber = gameState.calledNumbers[gameState.calledNumbers.length - 1];
    const newCalledNumbers = gameState.calledNumbers.slice(0, -1);
    const newRemainingPool = [...gameState.remainingPool, lastNumber].sort((a, b) => a - b);

    setGameState({
      calledNumbers: newCalledNumbers,
      remainingPool: newRemainingPool,
      lastDrawn: newCalledNumbers.length > 0 ? newCalledNumbers[newCalledNumbers.length - 1] : null,
      isComplete: false,
    });
    setLastAction('undo');
  }, [gameState.calledNumbers, gameState.remainingPool]);

  // Stop any running auto-draw timer
  const stopAutoDrawTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Quick Reset - clears board only, disables Auto Draw, and does not draw any numbers
  const quickReset = useCallback(() => {
    stopAutoDrawTimer();
    setGameState(createInitialGameState());
    setAutoDrawSettings((prev) => ({
      ...prev,
      enabled: false, // Disable Auto Draw on reset
      paused: false,
    }));
    setLastAction('reset');
  }, [stopAutoDrawTimer]);

  // New Game - resets everything and draws the first number
  const newGame = useCallback(() => {
    // Stop any active auto-draw timer
    stopAutoDrawTimer();
    
    // Create fresh initial state
    const freshGameState = createInitialGameState();
    const freshAutoDrawSettings = createInitialAutoDrawSettings();
    
    // Draw the first number from the fresh pool
    const randomIndex = Math.floor(Math.random() * freshGameState.remainingPool.length);
    const drawnNumber = freshGameState.remainingPool[randomIndex];
    
    const newRemainingPool = freshGameState.remainingPool.filter((_, idx) => idx !== randomIndex);
    const newCalledNumbers = [drawnNumber];
    
    const newGameState: TambolaGameState = {
      calledNumbers: newCalledNumbers,
      remainingPool: newRemainingPool,
      lastDrawn: drawnNumber,
      isComplete: newRemainingPool.length === 0,
    };
    
    // Update state
    setGameState(newGameState);
    setAutoDrawSettings(freshAutoDrawSettings);
    setLastAction('draw'); // Set to 'draw' so voice announcement triggers
  }, [stopAutoDrawTimer]);

  // Update auto-draw settings
  const setAutoDrawEnabled = useCallback((enabled: boolean) => {
    // Immediately stop timer if disabling
    if (!enabled) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    // Reset paused state when disabling Auto Draw
    setAutoDrawSettings((prev) => ({ ...prev, enabled, paused: false }));
  }, []);

  const setAutoDrawInterval = useCallback((intervalSeconds: number) => {
    setAutoDrawSettings((prev) => ({ ...prev, intervalSeconds }));
  }, []);

  // Toggle pause/resume for Auto Draw
  const toggleAutoDrawPause = useCallback(() => {
    setAutoDrawSettings((prev) => ({ ...prev, paused: !prev.paused }));
  }, []);

  // Auto-draw timer management
  useEffect(() => {
    // Only run timer if Auto Draw is enabled, not paused, and game is not complete
    if (autoDrawSettings.enabled && !autoDrawSettings.paused && !gameState.isComplete) {
      timerRef.current = setInterval(() => {
        drawNext();
      }, autoDrawSettings.intervalSeconds * 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    } else {
      // Clear timer if paused, disabled, or game complete
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [autoDrawSettings.enabled, autoDrawSettings.paused, autoDrawSettings.intervalSeconds, gameState.isComplete, drawNext]);

  // Stop auto-draw when game completes
  useEffect(() => {
    if (gameState.isComplete && autoDrawSettings.enabled) {
      setAutoDrawEnabled(false);
    }
  }, [gameState.isComplete, autoDrawSettings.enabled, setAutoDrawEnabled]);

  return {
    gameState,
    autoDrawSettings,
    lastAction,
    drawNext,
    undoLastDraw,
    quickReset,
    newGame,
    setAutoDrawEnabled,
    setAutoDrawInterval,
    toggleAutoDrawPause,
    canDraw: gameState.remainingPool.length > 0,
    canUndo: gameState.calledNumbers.length > 0,
  };
}
