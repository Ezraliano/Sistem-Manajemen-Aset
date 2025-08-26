<?php

namespace App\Services;

use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\Storage;

class QrCodeService
{
    /**
     * Generate QR code for an item
     *
     * @param string $itemCode
     * @param int $itemId
     * @return string QR code image path
     */
    public function generateQrCode(string $itemCode, int $itemId): string
    {
        // Create directory if it doesn't exist
        if (!Storage::exists('public/qrcodes')) {
            Storage::makeDirectory('public/qrcodes');
        }

        // Generate QR code with item information
        $qrCodePath = 'qrcodes/' . $itemCode . '.svg';
        $qrCodeContent = json_encode([
            'item_id' => $itemId,
            'code' => $itemCode,
            'url' => url('/api/items/' . $itemId)
        ]);

        // Generate and save QR code as SVG
        $qrCode = QrCode::size(200)
            ->errorCorrection('H')
            ->margin(1)
            ->generate($qrCodeContent);
        
        Storage::put('public/' . $qrCodePath, $qrCode);

        return $qrCodePath;
    }

    /**
     * Delete QR code for an item
     *
     * @param string $qrCodePath
     * @return bool
     */
    public function deleteQrCode(string $qrCodePath): bool
    {
        if (Storage::exists('public/' . $qrCodePath)) {
            return Storage::delete('public/' . $qrCodePath);
        }

        return false;
    }
}