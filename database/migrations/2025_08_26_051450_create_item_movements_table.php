<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('item_movements', function (Blueprint $table) {
    $table->id();
    $table->foreignId('item_id')->constrained('items')->onDelete('cascade');
    $table->foreignId('from_location_id')->nullable()->constrained('locations')->onDelete('set null');
    $table->foreignId('to_location_id')->constrained('locations')->onDelete('cascade');
    $table->foreignId('moved_by')->constrained('users')->onDelete('cascade');
    $table->timestamp('moved_at')->useCurrent();
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_movements');
    }
};
