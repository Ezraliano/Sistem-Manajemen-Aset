import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRScanner } from '@/components/qr/QRScanner';
import { useAssetByTag } from '@/hooks/useAssets';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Package, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { QRCodeData } from '@/types';
import toast from 'react-hot-toast';

export const QRScannerPage = () => {
  const navigate = useNavigate();
  const [scannedData, setScannedData] = useState<QRCodeData | null>(null);
  const [isScanning, setIsScanning] = useState(true);

  const {
    data: asset,
    isLoading,
    error,
  } = useAssetByTag(scannedData?.asset_tag || '');

  const handleScan = (decodedText: string) => {
    try {
      const data = JSON.parse(decodedText) as QRCodeData;
      setScannedData(data);
      setIsScanning(false);
      toast.success('QR Code scanned successfully!');
    } catch (error) {
      toast.error('Invalid QR code format');
    }
  };

  const handleScanError = (error: string) => {
    // Only show errors that aren't common scanning issues
    if (!error.includes('QR code parse error')) {
      toast.error(`Scanner error: ${error}`);
    }
  };

  const handleViewAsset = () => {
    if (asset) {
      navigate(`/assets/${asset.id}`);
    }
  };

  const handleScanAgain = () => {
    setScannedData(null);
    setIsScanning(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <QrCode className="mr-3 h-8 w-8 text-primary" />
            QR Code Scanner
          </h1>
          <p className="text-muted-foreground mt-1">
            Scan asset QR codes to view details and manage assets
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Scanner */}
        <div className="space-y-4">
          {isScanning ? (
            <QRScanner
              onScan={handleScan}
              onError={handleScanError}
              isActive={isScanning}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">QR Code Scanned!</CardTitle>
                <CardDescription>
                  QR code decoded successfully
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <p><strong>Asset Tag:</strong> {scannedData?.asset_tag}</p>
                  <p><strong>Asset Name:</strong> {scannedData?.name}</p>
                  {scannedData?.location && (
                    <p><strong>Location:</strong> {scannedData.location}</p>
                  )}
                </div>
                <Button onClick={handleScanAgain} variant="outline" className="w-full">
                  Scan Another Code
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Asset Details */}
        <div className="space-y-4">
          {scannedData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5 text-primary" />
                  Asset Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading && (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2">Loading asset details...</span>
                  </div>
                )}

                {error && (
                  <div className="flex items-center p-4 bg-destructive-light text-destructive rounded-lg">
                    <AlertCircle className="mr-2 h-5 w-5" />
                    <div>
                      <p className="font-medium">Asset Not Found</p>
                      <p className="text-sm">
                        No asset found with tag: {scannedData.asset_tag}
                      </p>
                    </div>
                  </div>
                )}

                {asset && (
                  <div className="space-y-4">
                    <div className="grid gap-4">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">
                          {asset.name}
                        </h3>
                        <p className="text-muted-foreground">{asset.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-muted-foreground">Asset Tag</p>
                          <p className="font-mono text-foreground">{asset.asset_tag}</p>
                        </div>
                        
                        <div>
                          <p className="font-medium text-muted-foreground">Status</p>
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            asset.status === 'active' ? 'status-active' :
                            asset.status === 'maintenance' ? 'status-warning' :
                            'status-inactive'
                          }`}>
                            {asset.status}
                          </span>
                        </div>

                        {asset.serial_number && (
                          <div>
                            <p className="font-medium text-muted-foreground">Serial Number</p>
                            <p className="font-mono text-foreground">{asset.serial_number}</p>
                          </div>
                        )}

                        <div>
                          <p className="font-medium text-muted-foreground">Condition</p>
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            asset.condition === 'excellent' ? 'status-active' :
                            asset.condition === 'good' ? 'bg-blue-100 text-blue-800' :
                            asset.condition === 'fair' ? 'status-warning' :
                            'status-error'
                          }`}>
                            {asset.condition}
                          </span>
                        </div>
                      </div>

                      {asset.location && (
                        <div className="flex items-center p-3 bg-muted rounded-lg">
                          <MapPin className="mr-2 h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium text-foreground">{asset.location.name}</p>
                            {asset.location.description && (
                              <p className="text-sm text-muted-foreground">
                                {asset.location.description}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        Last updated: {new Date(asset.updated_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleViewAsset} className="flex-1">
                        View Full Details
                      </Button>
                      <Button variant="outline" onClick={handleScanAgain}>
                        Scan Another
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {!scannedData && (
            <Card>
              <CardContent className="p-8 text-center">
                <QrCode className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-foreground mb-2">Ready to Scan</h3>
                <p className="text-muted-foreground">
                  Point your camera at an asset QR code to view its details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};