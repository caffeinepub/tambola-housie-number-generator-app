import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { RotateCcw } from 'lucide-react';

interface NewGameControlProps {
  onNewGame: () => void;
  onQuickReset: () => void;
  calledNumbersCount: number;
  remainingPoolCount: number;
  isComplete: boolean;
}

export function NewGameControl({
  onNewGame,
  onQuickReset,
  calledNumbersCount,
  remainingPoolCount,
  isComplete,
}: NewGameControlProps) {
  const [incompleteDialogOpen, setIncompleteDialogOpen] = useState(false);
  const [newGameDialogOpen, setNewGameDialogOpen] = useState(false);

  const handleClick = () => {
    const isBoardIncomplete = calledNumbersCount > 0 && remainingPoolCount > 0 && !isComplete;
    
    if (isBoardIncomplete) {
      setIncompleteDialogOpen(true);
    } else {
      setNewGameDialogOpen(true);
    }
  };

  const handleIncompleteYes = () => {
    setIncompleteDialogOpen(false);
    onQuickReset();
    setNewGameDialogOpen(true);
  };

  const handleIncompleteNo = () => {
    setIncompleteDialogOpen(false);
  };

  const handleNewGameConfirm = () => {
    setNewGameDialogOpen(false);
    onNewGame();
  };

  const handleNewGameCancel = () => {
    setNewGameDialogOpen(false);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        variant="destructive"
        size="lg"
        className="w-full sm:w-auto"
      >
        <RotateCcw className="mr-2 h-5 w-5" />
        New Game
      </Button>

      {/* Board Incomplete Warning Dialog */}
      <AlertDialog open={incompleteDialogOpen} onOpenChange={setIncompleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Board Incomplete</AlertDialogTitle>
            <AlertDialogDescription>
              The board is incomplete. Do you want to reset the game first?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleIncompleteNo}>No</AlertDialogCancel>
            <AlertDialogAction onClick={handleIncompleteYes}>Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* New Game Confirmation Dialog */}
      <AlertDialog open={newGameDialogOpen} onOpenChange={setNewGameDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>New Game</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to start a new game?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleNewGameCancel}>No</AlertDialogCancel>
            <AlertDialogAction onClick={handleNewGameConfirm}>Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
