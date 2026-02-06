import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Search } from 'lucide-react';

interface VerifyCalledNumbersProps {
  calledNumbers: number[];
}

type VerificationResult = 
  | { status: 'idle' }
  | { status: 'success'; verifiedCount: number }
  | { status: 'error'; message: string; notCalled?: number[] };

export function VerifyCalledNumbers({ calledNumbers }: VerifyCalledNumbersProps) {
  const [inputs, setInputs] = useState<string[]>(Array(15).fill(''));
  const [result, setResult] = useState<VerificationResult>({ status: 'idle' });
  const isVerifyingRef = useRef(false);

  // Clear result when calledNumbers changes
  useEffect(() => {
    setResult({ status: 'idle' });
  }, [calledNumbers]);

  const handleInputChange = (index: number, value: string) => {
    // Only allow numbers
    const sanitized = value.replace(/[^0-9]/g, '');
    const newInputs = [...inputs];
    newInputs[index] = sanitized;
    setInputs(newInputs);
    
    // Reset result on manual input change
    if (!isVerifyingRef.current) {
      setResult({ status: 'idle' });
    }
  };

  const handleVerify = () => {
    isVerifyingRef.current = true;
    
    // Snapshot current inputs before clearing
    const snapshotInputs = [...inputs];
    
    // Clear all inputs immediately
    setInputs(Array(15).fill(''));
    
    // Parse snapshotted inputs into valid numbers
    const enteredNumbers: number[] = [];
    const seen = new Set<number>();
    
    for (const input of snapshotInputs) {
      const trimmed = input.trim();
      if (!trimmed) continue;
      
      const num = parseInt(trimmed, 10);
      if (!isNaN(num) && num >= 1 && num <= 90 && !seen.has(num)) {
        enteredNumbers.push(num);
        seen.add(num);
      }
    }

    // Validate count
    if (enteredNumbers.length === 0) {
      setResult({ status: 'error', message: 'Please enter at least 1 number.' });
      isVerifyingRef.current = false;
      return;
    }

    // Check if all numbers have been called
    const calledSet = new Set(calledNumbers);
    const notCalled = enteredNumbers.filter(num => !calledSet.has(num));

    if (notCalled.length > 0) {
      setResult({ 
        status: 'error', 
        message: `Not called: ${notCalled.sort((a, b) => a - b).join(', ')}`,
        notCalled 
      });
    } else {
      setResult({ status: 'success', verifiedCount: enteredNumbers.length });
    }
    
    isVerifyingRef.current = false;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Verify Called Numbers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Label className="text-sm text-muted-foreground">
            Enter 1-15 numbers (positions 1-15)
          </Label>

          {/* 15 Input Grid */}
          <div className="grid grid-cols-5 gap-2">
            {inputs.map((value, index) => (
              <div key={index} className="space-y-1">
                <Label htmlFor={`input-${index}`} className="text-xs text-muted-foreground">
                  {index + 1}
                </Label>
                <Input
                  id={`input-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={2}
                  value={value}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className="text-center h-10"
                  placeholder="—"
                />
              </div>
            ))}
          </div>

          {/* Verify Button */}
          <Button onClick={handleVerify} size="default" className="w-full">
            <Search className="h-4 w-4 mr-2" />
            Verify
          </Button>
        </div>

        {/* Verification Result */}
        {result.status === 'success' && (
          <Alert className="border-green-500/50 bg-green-500/10">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700 dark:text-green-400">
              All {result.verifiedCount} number{result.verifiedCount !== 1 ? 's' : ''} have been called
            </AlertDescription>
          </Alert>
        )}

        {result.status === 'error' && (
          <Alert className="border-red-500/50 bg-red-500/10">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700 dark:text-red-400">
              {result.message}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
