import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Search, Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '../voice/useSpeechRecognition';
import { parseSpokenNumbers } from '../verify/parseSpokenNumbers';

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
  
  const {
    isListening,
    transcript,
    error: speechError,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  // Clear result when inputs change or calledNumbers changes
  useEffect(() => {
    setResult({ status: 'idle' });
  }, [inputs, calledNumbers]);

  // Process transcript when recording stops
  useEffect(() => {
    if (!isListening && transcript) {
      const spokenNumbers = parseSpokenNumbers(transcript);
      
      // Fill inputs with spoken numbers
      const newInputs = Array(15).fill('');
      spokenNumbers.forEach((num, idx) => {
        if (idx < 15) {
          newInputs[idx] = num.toString();
        }
      });
      
      setInputs(newInputs);
      resetTranscript();
    }
  }, [isListening, transcript, resetTranscript]);

  const handleInputChange = (index: number, value: string) => {
    // Only allow numbers
    const sanitized = value.replace(/[^0-9]/g, '');
    const newInputs = [...inputs];
    newInputs[index] = sanitized;
    setInputs(newInputs);
  };

  const handleVerify = () => {
    // Parse all inputs into valid numbers
    const enteredNumbers: number[] = [];
    const seen = new Set<number>();
    
    for (const input of inputs) {
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
  };

  const handleStartRecording = () => {
    if (!isSupported) {
      setResult({ 
        status: 'error', 
        message: 'Speech recognition is not supported in this browser. Please use manual entry.' 
      });
      return;
    }
    startListening();
  };

  const handleStopRecording = () => {
    stopListening();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Verify Called Numbers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-muted-foreground">
              Enter 1-15 numbers (positions 1-15)
            </Label>
            
            {/* Voice Recording Control */}
            {isSupported && (
              <div className="flex gap-2">
                {!isListening ? (
                  <Button 
                    onClick={handleStartRecording} 
                    size="sm" 
                    variant="outline"
                    className="gap-2"
                  >
                    <Mic className="h-4 w-4" />
                    Record
                  </Button>
                ) : (
                  <Button 
                    onClick={handleStopRecording} 
                    size="sm" 
                    variant="destructive"
                    className="gap-2"
                  >
                    <MicOff className="h-4 w-4" />
                    Stop
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Listening indicator */}
          {isListening && (
            <Alert className="border-blue-500/50 bg-blue-500/10">
              <Mic className="h-4 w-4 text-blue-600 animate-pulse" />
              <AlertDescription className="text-blue-700 dark:text-blue-400">
                Listening... Speak all numbers clearly.
              </AlertDescription>
            </Alert>
          )}

          {/* Speech recognition error */}
          {speechError && !isListening && (
            <Alert className="border-orange-500/50 bg-orange-500/10">
              <XCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-700 dark:text-orange-400">
                {speechError}
              </AlertDescription>
            </Alert>
          )}

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
