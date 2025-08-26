import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Image as ImageIcon } from 'lucide-react';
import { Asset } from '@/types';

interface QRGeneratorProps {
  asset: Asset;
  size?: number;
  includeText?: boolean;
}

export const QRGenerator = ({ asset, size = 256, includeText = true }: QRGeneratorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const qrData = JSON.stringify({
    asset_id: asset.id,
    asset_tag: asset.asset_tag,
    name: asset.name,
    location: asset.location?.name,
  });

  useEffect(() => {
    generateQR();
  }, [asset, size]);

  const generateQR = async () => {
    if (!canvasRef.current) return;

    setIsGenerating(true);
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Set canvas size
      canvas.width = size;
      canvas.height = includeText ? size + 60 : size;
      
      // Clear canvas
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Generate QR code
      await QRCode.toCanvas(canvas, qrData, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });

      // Add text if requested
      if (includeText && ctx) {
        ctx.fillStyle = '#000000';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(asset.name, size / 2, size + 20);
        ctx.fillText(`Tag: ${asset.asset_tag}`, size / 2, size + 40);
      }

      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/png');
      setQrDataUrl(dataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPNG = () => {
    if (!qrDataUrl) return;

    const link = document.createElement('a');
    link.download = `${asset.asset_tag}-qr-code.png`;
    link.href = qrDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    if (!qrDataUrl || !canvasRef.current) return;

    const pdf = new jsPDF();
    const canvas = canvasRef.current;
    const imgWidth = 100;
    const imgHeight = includeText ? (imgWidth * canvas.height) / canvas.width : imgWidth;
    
    // Add title
    pdf.setFontSize(16);
    pdf.text(`Asset: ${asset.name}`, 20, 20);
    
    // Add asset details
    pdf.setFontSize(12);
    pdf.text(`Asset Tag: ${asset.asset_tag}`, 20, 35);
    pdf.text(`Serial Number: ${asset.serial_number || 'N/A'}`, 20, 45);
    pdf.text(`Location: ${asset.location?.name || 'N/A'}`, 20, 55);
    pdf.text(`Status: ${asset.status}`, 20, 65);
    
    // Add QR code
    if (canvasRef.current) {
      pdf.addImage(qrDataUrl, 'PNG', 20, 80, imgWidth, imgHeight);
    }
    
    pdf.save(`${asset.asset_tag}-qr-code.pdf`);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-center">QR Code</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            className="border border-border rounded-lg"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>

        {includeText && (
          <div className="text-center text-sm text-muted-foreground">
            <p className="font-medium">{asset.name}</p>
            <p>Tag: {asset.asset_tag}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={downloadPNG}
            disabled={isGenerating || !qrDataUrl}
            className="w-full"
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            PNG
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={downloadPDF}
            disabled={isGenerating || !qrDataUrl}
            className="w-full"
          >
            <FileText className="mr-2 h-4 w-4" />
            PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};