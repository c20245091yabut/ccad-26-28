<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('inspectors') || ! Schema::hasTable('quality_inspections')) {
            return;
        }

        if (! Schema::hasColumn('quality_inspections', 'inspector_id')) {
            Schema::table('quality_inspections', function (Blueprint $table) {
                $table->foreignId('inspector_id')
                    ->nullable()
                    ->after('batch_id')
                    ->constrained('inspectors', 'inspector_id')
                    ->cascadeOnUpdate()
                    ->restrictOnDelete();
            });
        }

        DB::table('quality_inspections')
            ->whereNull('inspector_id')
            ->select(['inspection_id', 'inspector_name'])
            ->orderBy('inspection_id')
            ->get()
            ->each(function (object $inspection): void {
                $name = trim((string) $inspection->inspector_name);

                if ($name === '') {
                    return;
                }

                $inspectorId = DB::table('inspectors')
                    ->where('full_name', $name)
                    ->value('inspector_id');

                if (! $inspectorId) {
                    $inspectorId = DB::table('inspectors')->insertGetId([
                        'full_name' => $name,
                        'email' => 'backfill-' . $inspection->inspection_id . '@history.local',
                        'phone_number' => 'Not provided',
                        'position' => 'Inspector',
                        'status' => 'Inactive',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }

                DB::table('quality_inspections')
                    ->where('inspection_id', $inspection->inspection_id)
                    ->update(['inspector_id' => $inspectorId]);
            });
    }

    public function down(): void
    {
        if (! Schema::hasTable('quality_inspections')) {
            return;
        }

        if (Schema::hasColumn('quality_inspections', 'inspector_id')) {
            Schema::table('quality_inspections', function (Blueprint $table) {
                $table->dropForeign(['inspector_id']);
                $table->dropColumn('inspector_id');
            });
        }
    }
};
