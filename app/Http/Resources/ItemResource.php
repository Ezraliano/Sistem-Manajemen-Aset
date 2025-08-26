<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'description' => $this->description,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'location' => new LocationResource($this->whenLoaded('location')),
            'supplier' => new SupplierResource($this->whenLoaded('supplier')),
            'purchase_date' => $this->purchase_date,
            'condition' => $this->condition,
            'qr_code' => $this->qr_code,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}