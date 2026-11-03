<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quality_inspections', function (Blueprint $table) {
            $table->id('inspection_id');

            $table->foreignId('batch_id')
                ->constrained('inventory_batches', 'batch_id')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->string('inspector_name', 100);
            $table->date('inspection_date')->index();
            $table->string('quality_status', 30)->default('Pending')->index();
            $table->text('remarks')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quality_inspections');
    }
};