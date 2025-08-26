import QRScanner from '../../components/qr/QRScanner';

const ScannerPage = () => {
  const handleScan = (code) => {
    console.log('Scanned code:', code);
    // Navigation will be handled by the QRScanner component
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">QR Code Scanner</h1>
        <p className="text-gray-600">
          Scan asset QR codes to quickly access asset information
        </p>
      </div>

      <div className="flex justify-center">
        <QRScanner onScan={handleScan} />
      </div>
    </div>
  );
};

export default ScannerPage;