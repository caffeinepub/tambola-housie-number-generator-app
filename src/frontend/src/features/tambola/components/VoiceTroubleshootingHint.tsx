import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface VoiceTroubleshootingHintProps {
  show: boolean;
}

export function VoiceTroubleshootingHint({ show }: VoiceTroubleshootingHintProps) {
  if (!show) return null;

  return (
    <Alert variant="default" className="mt-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Voice Not Working?</AlertTitle>
      <AlertDescription className="text-sm space-y-2 mt-2">
        <p>If you're using this app inside an Android wrapper:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Ensure media/audio permissions are enabled in the wrapper settings</li>
          <li>Check that device volume is turned up</li>
          <li>Disable battery optimization for the app</li>
          <li>Try tapping "Enable Voice" again after adjusting settings</li>
        </ul>
      </AlertDescription>
    </Alert>
  );
}
