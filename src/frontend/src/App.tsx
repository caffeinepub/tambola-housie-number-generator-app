import { useState, useEffect, useRef } from 'react';
import { NumberBoard } from './features/tambola/components/NumberBoard';
import { HistorySection } from './features/tambola/components/HistorySection';
import { GameControls } from './features/tambola/components/GameControls';
import { NewGameControl } from './features/tambola/components/NewGameControl';
import { VoiceAnnouncementsPanel } from './features/tambola/components/VoiceAnnouncementsPanel';
import { HostVoiceManagerDialog } from './features/tambola/components/HostVoiceManagerDialog';
import { VerifyCalledNumbers } from './features/tambola/components/VerifyCalledNumbers';
import { useTambolaGame } from './features/tambola/useTambolaGame';
import { useVoiceSettings } from './features/tambola/voice/useVoiceSettings';
import { useVoiceAnnouncements } from './features/tambola/voice/useVoiceAnnouncements';
import { useWebViewVoiceUnlock } from './features/tambola/voice/useWebViewVoiceUnlock';
import { Dices, Heart } from 'lucide-react';

function App() {
  const {
    gameState,
    autoDrawSettings,
    drawNext,
    quickReset,
    newGame,
    setAutoDrawEnabled,
    setAutoDrawInterval,
    toggleAutoDrawPause,
    canDraw,
    lastAction,
  } = useTambolaGame();

  const {
    settings: voiceSettings,
    setEnabled: setVoiceEnabled,
    setReadingMode,
    setVoiceSourcePriority,
  } = useVoiceSettings();

  const { announceNumber, status: announcementStatus } = useVoiceAnnouncements();
  const { status: voiceUnlockStatus, initialize: initializeVoice, reset: resetVoiceUnlock } = useWebViewVoiceUnlock();
  const [isVoiceManagerOpen, setIsVoiceManagerOpen] = useState(false);

  // Refs to track last announced state
  const lastAnnouncedNumberRef = useRef<number | null>(null);
  const lastAnnouncedActionRef = useRef<string | null>(null);

  const handleDraw = () => {
    // If Auto Draw is ON, perform one draw and then turn it OFF
    if (autoDrawSettings.enabled) {
      drawNext();
      setAutoDrawEnabled(false);
    } else {
      drawNext();
    }
  };

  const handleNewGame = () => {
    newGame();
  };

  const handleQuickReset = () => {
    quickReset();
  };

  // Handle voice toggle with auto-initialization
  const handleVoiceToggle = async (enabled: boolean) => {
    setVoiceEnabled(enabled);
    
    if (enabled) {
      // When turning ON, immediately trigger initialization
      await initializeVoice();
    } else {
      // When turning OFF, reset the unlock state so it can be re-initialized later
      resetVoiceUnlock();
    }
  };

  // Effect to trigger voice announcement when a number is drawn
  useEffect(() => {
    // Only announce if:
    // 1. Voice is enabled
    // 2. Voice is ready (initialized)
    // 3. There's a newly drawn number
    // 4. The action is 'draw' (not 'undo' or 'reset')
    // 5. We haven't already announced this number+action combination
    if (
      voiceSettings.enabled &&
      voiceUnlockStatus === 'ready' &&
      gameState.lastDrawn !== null &&
      lastAction === 'draw' &&
      (gameState.lastDrawn !== lastAnnouncedNumberRef.current || lastAction !== lastAnnouncedActionRef.current)
    ) {
      announceNumber(gameState.lastDrawn, voiceSettings.readingMode, voiceSettings.voiceSourcePriority);
      lastAnnouncedNumberRef.current = gameState.lastDrawn;
      lastAnnouncedActionRef.current = lastAction;
    }
  }, [
    voiceSettings.enabled,
    voiceSettings.readingMode,
    voiceSettings.voiceSourcePriority,
    voiceUnlockStatus,
    gameState.lastDrawn,
    lastAction,
    announceNumber,
  ]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header - Not sticky on mobile, sticky on sm+ */}
      <header className="border-b bg-card/50 backdrop-blur-sm sm:sticky sm:top-0 z-10">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink">
              <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                <Dices className="h-6 w-6 text-primary" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl font-bold tracking-tight truncate">Tambola</h1>
                <p className="text-sm text-muted-foreground">Number Caller</p>
              </div>
            </div>
            <div className="w-full sm:w-auto flex-shrink-0">
              <NewGameControl
                onNewGame={handleNewGame}
                onQuickReset={handleQuickReset}
                calledNumbersCount={gameState.calledNumbers.length}
                remainingPoolCount={gameState.remainingPool.length}
                isComplete={gameState.isComplete}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-2 sm:px-4 py-6 sm:py-8 app-main-content flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* History Section (Last Number + Call History) - order-1 on mobile, lg:order-1 on desktop (left column, top) */}
          <div className="order-1 lg:order-1">
            <HistorySection
              calledNumbers={gameState.calledNumbers}
              lastDrawn={gameState.lastDrawn}
              isComplete={gameState.isComplete}
              autoDrawEnabled={autoDrawSettings.enabled}
              autoDrawPaused={autoDrawSettings.paused}
              onTogglePause={toggleAutoDrawPause}
            />
          </div>

          {/* Game Controls - order-2 on mobile (after history), lg:order-3 on desktop (right column, top) */}
          <div className="order-2 lg:order-3 lg:col-span-2">
            <GameControls
              canDraw={canDraw}
              isComplete={gameState.isComplete}
              autoDrawEnabled={autoDrawSettings.enabled}
              autoDrawInterval={autoDrawSettings.intervalSeconds}
              voiceEnabled={voiceSettings.enabled}
              onDrawNext={handleDraw}
              onQuickReset={quickReset}
              onAutoDrawToggle={setAutoDrawEnabled}
              onIntervalChange={setAutoDrawInterval}
              onVoiceToggle={handleVoiceToggle}
            />
          </div>

          {/* Number Board - order-3 on mobile (after controls), lg:order-4 on desktop (right column, bottom) */}
          <div className="order-3 lg:order-4 lg:col-span-2">
            <NumberBoard calledNumbers={gameState.calledNumbers} />
          </div>

          {/* Verify Called Numbers - order-4 on mobile, lg:order-2 on desktop (left column, middle) */}
          <div className="order-4 lg:order-2">
            <VerifyCalledNumbers calledNumbers={gameState.calledNumbers} />
          </div>

          {/* Voice Announcements Panel - order-5 on mobile, lg:order-5 on desktop (left column, bottom) */}
          <div className="order-5 lg:order-5">
            <VoiceAnnouncementsPanel
              voiceEnabled={voiceSettings.enabled}
              readingMode={voiceSettings.readingMode}
              voiceSourcePriority={voiceSettings.voiceSourcePriority}
              voiceUnlockStatus={voiceUnlockStatus}
              announcementStatus={announcementStatus}
              onReadingModeChange={setReadingMode}
              onVoiceSourcePriorityChange={setVoiceSourcePriority}
              onOpenVoiceManager={() => setIsVoiceManagerOpen(true)}
              onInitializeVoice={initializeVoice}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/30 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>© 2026. Built with</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            <span>
              using{' '}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </span>
          </div>
        </div>
      </footer>

      {/* Host Voice Manager Dialog */}
      <HostVoiceManagerDialog open={isVoiceManagerOpen} onOpenChange={setIsVoiceManagerOpen} />
    </div>
  );
}

export default App;
