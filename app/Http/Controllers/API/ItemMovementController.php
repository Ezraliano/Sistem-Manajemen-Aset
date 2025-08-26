<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\ItemMovementResource;
use App\Http\Resources\ItemResource;
use App\Models\Item;
use App\Models\ItemMovement;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ItemMovementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): AnonymousResourceCollection
    {
        $movements = ItemMovement::with(['item', 'fromLocation', 'toLocation', 'movedBy'])->get();
        return ItemMovementResource::collection($movements);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): Response
    {
        $validator = Validator::make($request->all(), [
            'item_id' => 'required|exists:items,id',
            'from_location_id' => 'nullable|exists:locations,id',
            'to_location_id' => 'required|exists:locations,id',
            'moved_at' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        
        // Get current location if from_location_id is not provided
        if (empty($data['from_location_id'])) {
            $item = Item::findOrFail($data['item_id']);
            $data['from_location_id'] = $item->location_id;
        }
        
        // Set moved_by to current authenticated user
        $data['moved_by'] = Auth::id();
        
        // Create movement record
        $movement = ItemMovement::create($data);
        
        // Update item location
        $item = Item::findOrFail($data['item_id']);
        $item->location_id = $data['to_location_id'];
        $item->save();

        return response([
            'message' => 'Item movement recorded successfully', 
            'data' => new ItemMovementResource($movement->load(['item', 'fromLocation', 'toLocation', 'movedBy']))
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(ItemMovement $itemMovement): ItemMovementResource
    {
        return new ItemMovementResource($itemMovement->load(['item', 'fromLocation', 'toLocation', 'movedBy']));
    }

    /**
     * Get movement history for an item.
     */
    public function getItemHistory(Item $item): AnonymousResourceCollection
    {
        $movements = ItemMovement::where('item_id', $item->id)
            ->with(['fromLocation', 'toLocation', 'movedBy'])
            ->orderBy('moved_at', 'desc')
            ->get();
            
        return ItemMovementResource::collection($movements);
    }
    
    /**
     * Get items in a location.
     */
    public function getItemsByLocation(Location $location): Response
    {
        $items = Item::where('location_id', $location->id)
            ->with(['category', 'supplier'])
            ->get();
            
        return response(['data' => ItemResource::collection($items)]);
    }
}