<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\ItemResource;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Services\QrCodeService;

class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): AnonymousResourceCollection
    {
        $items = Item::with(['category', 'location', 'supplier'])->get();
        return ItemResource::collection($items);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): Response
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:100|unique:items',
            'name' => 'required|string|max:150',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'location_id' => 'required|exists:locations,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'purchase_date' => 'nullable|date',
            'condition' => 'required|in:baik,rusak ringan,rusak berat',
        ]);

        if ($validator->fails()) {
            return response(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        
        $item = Item::create($data);
        
        // Generate QR code
        $qrCodeService = new QrCodeService();
        $qrCodePath = $qrCodeService->generateQrCode($data['code'], $item->id);
        $item->qr_code = $qrCodePath;
        $item->save();

        return response([
            'message' => 'Item created successfully', 
            'data' => new ItemResource($item->load(['category', 'location', 'supplier']))
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Item $item): ItemResource
    {
        return new ItemResource($item->load(['category', 'location', 'supplier']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Item $item): Response
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:100|unique:items,code,' . $item->id,
            'name' => 'required|string|max:150',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'location_id' => 'required|exists:locations,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'purchase_date' => 'nullable|date',
            'condition' => 'required|in:baik,rusak ringan,rusak berat',
        ]);

        if ($validator->fails()) {
            return response(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        
        // If code changed, regenerate QR code
        if ($item->code !== $data['code']) {
            // Delete old QR code and generate new one
            $qrCodeService = new QrCodeService();
            if ($item->qr_code) {
                $qrCodeService->deleteQrCode($item->qr_code);
            }
            
            // Generate new QR code
            $qrCodePath = $qrCodeService->generateQrCode($data['code'], $item->id);
            $data['qr_code'] = $qrCodePath;
        }

        $item->update($data);

        return response([
            'message' => 'Item updated successfully', 
            'data' => new ItemResource($item->load(['category', 'location', 'supplier']))
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Item $item): Response
    {
        // Delete QR code if exists
        if ($item->qr_code) {
            $qrCodeService = new QrCodeService();
            $qrCodeService->deleteQrCode($item->qr_code);
        }
        
        $item->delete();

        return response(['message' => 'Item deleted successfully']);
    }
    
    /**
     * Get item by QR code.
     */
    public function getByQrCode(Request $request): Response
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response(['errors' => $validator->errors()], 422);
        }

        $item = Item::where('code', $request->code)
            ->with(['category', 'location', 'supplier'])
            ->first();

        if (!$item) {
            return response(['message' => 'Item not found'], 404);
        }

        return response(['data' => new ItemResource($item)]);
    }
    

}