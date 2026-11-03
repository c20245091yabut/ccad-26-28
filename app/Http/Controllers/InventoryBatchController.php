<?php
namespace App\Http\Controllers;

use App\Http\Requests\StoreInventoryBatchRequest;
use App\Http\Requests\UpdateInventoryBatchRequest;
use App\Models\Ingredient;
use App\Models\InventoryBatch;
use App\Models\Warehouse;
use App\Services\InventoryBatchService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class InventoryBatchController extends Controller
{
    private InventoryBatchService $inventoryBatchService;

    public function __construct(
        InventoryBatchService $inventoryBatchService
    ) {
        $this->inventoryBatchService = $inventoryBatchService;
    }

    /**
     * Display paginated inventory batches.
     */
    public function index(): Response
    {
        $batches = InventoryBatch::with([
            'ingredient',
            'warehouse',
            'qualityInspections',
        ])
            ->latest()
            ->paginate(10);

        return Inertia::render('InventoryBatches/Index', [
            'batches' => $batches,
        ]);
    }

    /**
     * Display the inventory batch creation form.
     */
    public function create(): Response
    {
        return Inertia::render('InventoryBatches/Create', [
            'ingredients' => Ingredient::orderBy('ingredient_name')->get(),
            'warehouses' => Warehouse::orderBy('warehouse_name')->get(),
        ]);
    }

    /**
     * Store a newly created inventory batch.
     */
    public function store(
        StoreInventoryBatchRequest $request
    ): RedirectResponse {
        $this->inventoryBatchService->create(
            $request->validated()
        );

        return redirect()
            ->route('inventory-batches.index')
            ->with('success', 'Inventory batch created successfully.');
    }

    /**
     * Update an existing inventory batch.
     */
    public function update(
        UpdateInventoryBatchRequest $request,
        $id
    ): RedirectResponse {
        $this->inventoryBatchService->update(
            (int) $id,
            $request->validated()
        );

        return redirect()
            ->route('inventory-batches.index')
            ->with('success', 'Inventory batch updated successfully.');
    }
}
