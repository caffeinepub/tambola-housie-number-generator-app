import { Card } from '@/components/ui/card';

interface NumberBoardProps {
  calledNumbers: number[];
}

export function NumberBoard({ calledNumbers }: NumberBoardProps) {
  const calledSet = new Set(calledNumbers);
  const numbers = Array.from({ length: 90 }, (_, i) => i + 1);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Number Board</h3>
      <div className="grid grid-cols-9 gap-2 sm:gap-3">
        {numbers.map((num) => {
          const isCalled = calledSet.has(num);
          return (
            <div
              key={num}
              className={`
                aspect-square rounded-lg flex items-center justify-center text-sm sm:text-base font-semibold
                transition-all duration-300 shadow-sm
                ${
                  isCalled
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white scale-105 shadow-md'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }
              `}
            >
              {num}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
