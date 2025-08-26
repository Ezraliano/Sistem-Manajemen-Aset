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
       Schema::create('items', function (Blueprint $table) {
    $table->id();
    $table->string('code', 100)->unique();
    $table->string('name', 150);
    $table->text('description')->nullable();
    $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
    $table->foreignId('location_id')->constrained('locations')->onDelete('cascade');
    $table->foreignId('supplier_id')->nullable()->constrained('suppliers')->onDelete('set null');
    $table->date('purchase_date')->nullable();
    $table->enum('condition', ['baik', 'rusak ringan', 'rusak berat'])->default('baik');
    $table->string('qr_code')->nullable(); // Path atau URL QR code
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
