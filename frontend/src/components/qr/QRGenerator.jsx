import { useRef } from 'react';
import QRCode from 'qrcode';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

const QRGenerator = ({ value, filename = 'qr-code' }) => {
  const canvasRef = useRef(null);

  const generateQR = async () => {
    try {
      const canvas = canvasRef.current;
      await QRCode.toCanvas(canvas, value, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    }
  };

  const downloadQR = () => {
    const canvas = canvasRef.current;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = url;
    link.click();
    toast.success('QR code downloaded!');
  };

  const downloadPDF = async () => {
    try {
      // For PDF generation, you might want to use jsPDF
      // This is a simplified version
      const canvas = canvasRef.current;
      const imgData = canvas.toDataURL('image/png');
      
      // Create a simple PDF with the QR code
      const link = document.createElement('a');
      link.download = `${filename}.png`; // For now, just download as PNG
      link.href = imgData;
      link.click();
      
      toast.success('QR code downloaded!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          className="border border-gray-200 rounded-lg"
        />
      </div>
      
      <div className="flex space-x-3 justify-center">
        <Button onClick={generateQR} variant="secondary">
          Generate QR
        </Button>
        <Button onClick={downloadQR}>
          Download PNG
        </Button>
        <Button onClick={downloadPDF} variant="outline">
          Download PDF
        </Button>
      </div>
      
      {value && (
        <div className="text-xs text-gray-500 break-all max-w-xs mx-auto">
          {value}
        </div>
      )}
    </div>
  );
};

export default QRGenerator;