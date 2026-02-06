import { useTambolaGame } from './features/tambola/useTambolaGame';
import { NewGameControl } from './features/tambola/components/NewGameControl';
import { LastNumberDisplay } from './features/tambola/components/LastNumberDisplay';
import { NumberBoard } from './features/tambola/components/NumberBoard';
import { HistoryPanel } from './features/tambola/components/HistoryPanel';
import { GameControls } from './features/tambola/components/GameControls';
import { Button } from '@/components/ui/button';
import { Heart, Undo2 } from 'lucide-react';

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
  } = useTambolaGame();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/tambola-icon.dim_512x512.png"
              alt="Tambola"
              className="w-12 h-12 rounded-lg shadow-md"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Tambola Number Generator
              </h1>
              <p className="text-sm text-muted-foreground">
                Classic Housie game for your next game night
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - New Game, Last number and controls */}
          <div className="space-y-4">
            <NewGameControl onNewGame={newGame} />
            <LastNumberDisplay
              lastDrawn={gameState.lastDrawn}
              isComplete={gameState.isComplete}
            />
            <GameControls
              canDraw={canDraw}
              isComplete={gameState.isComplete}
              autoDrawEnabled={autoDrawSettings.enabled}
              autoDrawInterval={autoDrawSettings.intervalSeconds}
              onDrawNext={drawNext}
              onQuickReset={quickReset}
              onAutoDrawToggle={setAutoDrawEnabled}
              onIntervalChange={setAutoDrawInterval}
            />
          </div>

          {/* Middle column - Call History */}
          <div className="lg:col-span-2">
            <HistoryPanel calledNumbers={gameState.calledNumbers} />
          </div>
        </div>

        {/* Number board - below grid */}
        <div className="mt-6">
          <NumberBoard calledNumbers={gameState.calledNumbers} />
        </div>

        {/* Undo button - below number board */}
        <div className="mt-4 flex justify-center">
          <Button
            onClick={undoLastDraw}
            disabled={!canUndo || autoDrawSettings.enabled}
            variant="outline"
            size="lg"
            className="min-w-[200px]"
          >
            <Undo2 className="mr-2 h-5 w-5" />
            Undo
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © 2026. Built with <Heart className="inline h-4 w-4 text-red-500 fill-red-500" /> using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
