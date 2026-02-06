import { useState } from 'react';
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
import { LIVE_VERSION } from './release/liveVersion';
import { Dices, Heart } from 'lucide-react';

function App() {
  const {
    gameState,
    autoDrawSettings,
    drawNext,
    undoLastDraw,
    quickReset,
    newGame,
    setAutoDrawEnabled,
    setAutoDrawInterval,
    canDraw,
    canUndo,
    lastAction,
  } = useTambolaGame();

  const {
    settings: voiceSettings,
    setEnabled: setVoiceEnabled,
    setReadingMode,
    setVoiceSourcePriority,
  } = useVoiceSettings();

  const { announceNumber } = useVoiceAnnouncements();
  const [isVoiceManagerOpen, setIsVoiceManagerOpen] = useState(false);

  const handleDraw = () => {
    drawNext();
  };

  const handleNewGame = () => {
    newGame();
  };

  // Trigger voice announcement when a number is drawn (manual or auto)
  // Only announce on 'draw' action, not on 'undo' or 'reset'
  const prevLastNumberRef = useState<number | null>(null);
  const prevLastActionRef = useState<string | null>(null);

  if (
    gameState.lastDrawn !== null &&
    gameState.lastDrawn !== prevLastNumberRef[0] &&
    lastAction === 'draw' &&
    lastAction !== prevLastActionRef[0] &&
    voiceSettings.enabled
  ) {
    announceNumber(gameState.lastDrawn, voiceSettings.readingMode, voiceSettings.voiceSourcePriority);
    prevLastNumberRef[0] = gameState.lastDrawn;
    prevLastActionRef[0] = lastAction;
  }

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
              <NewGameControl onNewGame={handleNewGame} />
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
            />
          </div>

          {/* Game Controls - order-2 on mobile (after history), lg:order-3 on desktop (right column, top) */}
          <div className="order-2 lg:order-3 lg:col-span-2">
            <GameControls
              canDraw={canDraw}
              isComplete={gameState.isComplete}
              autoDrawEnabled={autoDrawSettings.enabled}
              autoDrawInterval={autoDrawSettings.intervalSeconds}
              onDrawNext={handleDraw}
              onQuickReset={quickReset}
              onAutoDrawToggle={setAutoDrawEnabled}
              onIntervalChange={setAutoDrawInterval}
            />
          </div>

          {/* Number Board - order-3 on mobile (after controls), lg:order-4 on desktop (right column, bottom) */}
          <div className="order-3 lg:order-4 lg:col-span-2">
            <NumberBoard calledNumbers={gameState.calledNumbers} />
          </div>

          {/* Voice Announcements Panel - order-4 on mobile, lg:order-2 on desktop (left column, middle) */}
          <div className="order-4 lg:order-2">
            <VoiceAnnouncementsPanel
              voiceEnabled={voiceSettings.enabled}
              readingMode={voiceSettings.readingMode}
              voiceSourcePriority={voiceSettings.voiceSourcePriority}
              onVoiceToggle={setVoiceEnabled}
              onReadingModeChange={setReadingMode}
              onVoiceSourcePriorityChange={setVoiceSourcePriority}
              onOpenVoiceManager={() => setIsVoiceManagerOpen(true)}
            />
          </div>

          {/* Verify Called Numbers - order-5 on mobile (last), lg:order-5 on desktop (left column, bottom) */}
          <div className="order-5 lg:order-5">
            <VerifyCalledNumbers calledNumbers={gameState.calledNumbers} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/30 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-2 sm:px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 text-sm text-muted-foreground">
            <span>© 2026. Built with</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            <span>using</span>
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline"
            >
              caffeine.ai
            </a>
            <span className="hidden sm:inline">•</span>
            <span className="text-xs opacity-70">{LIVE_VERSION}</span>
          </div>
        </div>
      </footer>

      {/* Voice Manager Dialog */}
      <HostVoiceManagerDialog
        open={isVoiceManagerOpen}
        onOpenChange={setIsVoiceManagerOpen}
      />
    </div>
  );
}

export default App;
