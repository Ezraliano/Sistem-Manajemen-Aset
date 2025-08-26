import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Camera, X } from 'lucide-react';

interface QRScannerProps {
  onScan: (decodedText: string, decodedResult: any) => void;
  onError?: (error: string) => void;
  isActive?: boolean;
  onClose?: () => void;
}

export const QRScanner = ({ onScan, onError, isActive = true, onClose }: QRScannerProps) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const config = {
      fps: 10,
      qrbox: {
        width: 250,
        height: 250,
      },
      aspectRatio: 1.0,
      disableFlip: false,
      supportedScanTypes: [],
    };

    const scanner = new Html5QrcodeScanner('qr-scanner', config, false);
    scannerRef.current = scanner;

    const handleScanSuccess = (decodedText: string, decodedResult: any) => {
      setError(null);
      onScan(decodedText, decodedResult);
    };

    const handleScanError = (err: string) => {
      // Ignore frequent scan errors - they're normal when no QR code is detected
      if (!err.includes('QR code parse error')) {
        setError(err);
        onError?.(err);
      }
    };

    try {
      scanner.render(handleScanSuccess, handleScanError);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to initialize camera');
      setIsLoading(false);
      onError?.('Failed to initialize camera');
    }

    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (err) {
          console.warn('Error clearing QR scanner:', err);
        }
      }
    };
  }, [isActive, onScan, onError]);

  if (!isActive) return null;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Camera className="mr-2 h-5 w-5" />
          QR Code Scanner
        </CardTitle>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Initializing camera...</span>
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-destructive-light text-destructive rounded-lg">
            <p className="text-sm font-medium">Camera Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div id="qr-scanner" className="w-full" />
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Position the QR code within the frame to scan
          </p>
        </div>
      </CardContent>
    </Card>
  );
};