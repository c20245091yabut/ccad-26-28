<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('inspectors')) {
            return;
        }

        Schema::create('inspectors', function (Blueprint $table) {
            $table->id('inspector_id');
            $table->string('full_name', 150);
            $table->string('email', 150)->unique();
            $table->string('phone_number', 30);
            $table->string('position', 100);
            $table->string('status', 20)->default('Active')->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inspectors');
    }
};
