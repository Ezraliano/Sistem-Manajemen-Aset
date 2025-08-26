import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { useItemByCode } from '../../hooks/useItems';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import toast from 'react-hot-toast';

const QRScanner = ({ onScan, onClose }) => {
  const scannerRef = useRef(null);
  const [scannedCode, setScannedCode] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const navigate = useNavigate();

  const { data: item, isLoading, error } = useItemByCode(scannedCode);

  useEffect(() => {
    if (!isScanning) return;

    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      },
      false
    );

    const onScanSuccess = (decodedText) => {
      setScannedCode(decodedText);
      setIsScanning(false);
      scanner.clear();
      
      if (onScan) {
        onScan(decodedText);
      }
    };

    const onScanFailure = (error) => {
      // Handle scan failure silently
      console.warn('QR scan failed:', error);
    };

    scanner.render(onScanSuccess, onScanFailure);
    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, [isScanning, onScan]);

  useEffect(() => {
    if (item && !isLoading) {
      toast.success('Asset found!');
      navigate(`/assets/${item.id}`);
    } else if (error && scannedCode) {
      toast.error('Asset not found');
    }
  }, [item, isLoading, error, scannedCode, navigate]);

  const handleRescan = () => {
    setScannedCode(null);
    setIsScanning(true);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Scan QR Code
          </h3>
          <p className="text-sm text-gray-600">
            Point your camera at the QR code to scan
          </p>
        </div>

        {isScanning && (
          <div id="qr-reader" className="mb-4"></div>
        )}

        {scannedCode && (
          <div className="mb-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Scanned Code:</p>
              <p className="font-mono text-sm break-all">{scannedCode}</p>
            </div>

            {isLoading && (
              <div className="flex items-center justify-center mt-4">
                <LoadingSpinner />
                <span className="ml-2 text-sm text-gray-600">
                  Looking up asset...
                </span>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">
                  Asset not found with this code
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex space-x-3">
          {scannedCode && (
            <Button onClick={handleRescan} variant="secondary" className="flex-1">
              Scan Again
            </Button>
          )}
          {onClose && (
            <Button onClick={onClose} variant="outline" className="flex-1">
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScanner;