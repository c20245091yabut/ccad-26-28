<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use App\Models\InventoryBatch;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard', [
            'totalIngredients' => Ingredient::count(),

            'totalBatches' => InventoryBatch::count(),

            'expiringSoon' => InventoryBatch::whereBetween(
                'expiry_date',
                [now()->toDateString(), now()->addDays(7)->toDateString()]
            )->count(),

            'failedBatches' => InventoryBatch::where(
                'quality_status',
                'Failed'
            )->count(),
        ]);
    }
}
