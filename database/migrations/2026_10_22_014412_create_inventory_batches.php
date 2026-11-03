<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_batches', function (Blueprint $table) {
            $table->id('batch_id');

            $table->foreignId('ingredient_id')
                ->constrained('ingredients', 'ingredient_id')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('warehouse_id')
                ->constrained('warehouses', 'warehouse_id')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->string('batch_number', 50)->unique();
            $table->decimal('quantity_kg', 10, 2);
            $table->decimal('unit_cost', 12, 2);
            $table->date('expiry_date')->index();
            $table->decimal('total_batch_value', 14, 2);
            $table->string('quality_status', 30)->default('Pending')->index();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_batches');
    }
};