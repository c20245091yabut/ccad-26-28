<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use App\Models\InventoryBatch;
use App\Models\Inspector;
use App\Models\QualityInspection;
use App\Models\Supplier;
use App\Models\Warehouse;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class DashboardController extends Controller
{
    /**
     * Display the dashboard statistics.
     */
    public function index(): InertiaResponse
    {
        $today = today();
        $nextSevenDays = $today->copy()->addDays(7);

        // Retrieve inventory statistics in one query.
        $batchStats = InventoryBatch::query()
            ->selectRaw(
                '
                    COUNT(*) as total_batches,
                    COALESCE(SUM(total_batch_value), 0) as total_inventory_value,
                    COALESCE(
                        SUM(
                            CASE
                                WHEN expiry_date BETWEEN ? AND ?
                                THEN 1 ELSE 0
                            END
                        ), 0
                    ) as expiring_soon,
                    COALESCE(
                        SUM(
                            CASE
                                WHEN quality_status = ?
                                THEN 1 ELSE 0
                            END
                        ), 0
                    ) as failed_batches
                ',
                [
                    $today->toDateString(),
                    $nextSevenDays->toDateString(),
                    'Failed',
                ]
            )
            ->first();

        $qualityStatusCounts = InventoryBatch::query()
            ->selectRaw('quality_status, COUNT(*) as total')
            ->groupBy('quality_status')
            ->pluck('total', 'quality_status');

        $recentBatches = InventoryBatch::query()
            ->select([
                'batch_id',
                'ingredient_id',
                'warehouse_id',
                'batch_number',
                'quantity_kg',
                'expiry_date',
                'quality_status',
                'created_at',
            ])
            ->with([
                'ingredient:ingredient_id,ingredient_name',
                'warehouse:warehouse_id,warehouse_name',
            ])
            ->latest()
            ->limit(5)
            ->get();

        $recentInspections = QualityInspection::query()
            ->select([
                'inspection_id',
                'batch_id',
                'inspector_id',
                'inspector_name',
                'inspection_date',
                'quality_status',
            ])
            ->with([
                'inspector:inspector_id,full_name',
                'inventoryBatch:batch_id,ingredient_id,batch_number',
                'inventoryBatch.ingredient:ingredient_id,ingredient_name',
            ])
            ->latest('inspection_date')
            ->limit(5)
            ->get();

        return Inertia::render('dashboard', [
            'totalIngredients' => Ingredient::count(),
            'totalBatches' => (int) $batchStats->total_batches,
            'expiringSoon' => (int) $batchStats->expiring_soon,
            'failedBatches' => (int) $batchStats->failed_batches,
            'expiredBatches' => InventoryBatch::where('expiry_date', '<', $today)->count(),
            'totalSuppliers' => Supplier::count(),
            'totalWarehouses' => Warehouse::count(),
            'activeInspectors' => Inspector::where('status', 'Active')->count(),
            'totalInventoryValue' => (float) $batchStats->total_inventory_value,
            'qualityStatusCounts' => [
                'Passed' => (int) ($qualityStatusCounts['Passed'] ?? 0),
                'Pending' => (int) ($qualityStatusCounts['Pending'] ?? 0),
                'Failed' => (int) ($qualityStatusCounts['Failed'] ?? 0),
            ],
            'recentBatches' => $recentBatches,
            'recentInspections' => $recentInspections,
        ]);
    }
}