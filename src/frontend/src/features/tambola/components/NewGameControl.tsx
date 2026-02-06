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
}

export function NewGameControl({ onNewGame }: NewGameControlProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClick = () => {
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    onNewGame();
    setDialogOpen(false);
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

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>New Game</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to start a new game?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
