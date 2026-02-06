import { useState, useEffect, useCallback, useRef } from 'react';
import type { TambolaGameState, AutoDrawSettings } from './types';
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
  }, [gameState.calledNumbers, gameState.remainingPool]);

  // Stop any running auto-draw timer
  const stopAutoDrawTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Quick Reset - resets game state only, preserves interval setting
  const quickReset = useCallback(() => {
    setGameState(createInitialGameState());
    setAutoDrawSettings((prev) => ({
      ...prev,
      enabled: false,
    }));
    stopAutoDrawTimer();
    // Persist the new state
    savePersistedState({
      gameState: createInitialGameState(),
      autoDrawSettings: {
        enabled: false,
        intervalSeconds: autoDrawSettings.intervalSeconds,
      },
    });
  }, [autoDrawSettings.intervalSeconds, stopAutoDrawTimer]);

  // New Game - resets everything to initial defaults
  const newGame = useCallback(() => {
    setGameState(createInitialGameState());
    setAutoDrawSettings(createInitialAutoDrawSettings());
    stopAutoDrawTimer();
    // Persist the new state
    savePersistedState({
      gameState: createInitialGameState(),
      autoDrawSettings: createInitialAutoDrawSettings(),
    });
  }, [stopAutoDrawTimer]);

  // Update auto-draw settings
  const setAutoDrawEnabled = useCallback((enabled: boolean) => {
    setAutoDrawSettings((prev) => ({ ...prev, enabled }));
  }, []);

  const setAutoDrawInterval = useCallback((intervalSeconds: number) => {
    setAutoDrawSettings((prev) => ({ ...prev, intervalSeconds }));
  }, []);

  // Auto-draw timer management
  useEffect(() => {
    if (autoDrawSettings.enabled && !gameState.isComplete) {
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
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [autoDrawSettings.enabled, autoDrawSettings.intervalSeconds, gameState.isComplete, drawNext]);

  // Stop auto-draw when game completes
  useEffect(() => {
    if (gameState.isComplete && autoDrawSettings.enabled) {
      setAutoDrawEnabled(false);
    }
  }, [gameState.isComplete, autoDrawSettings.enabled, setAutoDrawEnabled]);

  return {
    gameState,
    autoDrawSettings,
    drawNext,
    undoLastDraw,
    quickReset,
    newGame,
    setAutoDrawEnabled,
    setAutoDrawInterval,
    canDraw: gameState.remainingPool.length > 0,
    canUndo: gameState.calledNumbers.length > 0,
  };
}
