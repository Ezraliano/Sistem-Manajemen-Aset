<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Location extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
    ];

    /**
     * Get the items for the location.
     */
    public function items(): HasMany
    {
        return $this->hasMany(Item::class);
    }

    /**
     * Get the item movements from this location.
     */
    public function fromMovements(): HasMany
    {
        return $this->hasMany(ItemMovement::class, 'from_location_id');
    }

    /**
     * Get the item movements to this location.
     */
    public function toMovements(): HasMany
    {
        return $this->hasMany(ItemMovement::class, 'to_location_id');
    }
}