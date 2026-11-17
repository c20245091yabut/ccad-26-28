<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInventoryBatchRequest;
use App\Http\Requests\UpdateInventoryBatchRequest;
use App\Models\Ingredient;
use App\Models\InventoryBatch;
use App\Models\Warehouse;
use App\Services\InventoryBatchService;
use Illuminate\Http\Request;
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
     * Display and search inventory batches.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $query = InventoryBatch::with([
            'ingredient',
            'warehouse',
            'qualityInspections',
        ]);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('batch_number', 'like', "%{$search}%")
                    ->orWhereHas('ingredient', function ($ingredient) use ($search) {
                        $ingredient->where(
                            'ingredient_name',
                            'like',
                            "%{$search}%"
                        );
                    })
                    ->orWhereHas('warehouse', function ($warehouse) use ($search) {
                        $warehouse->where(
                            'warehouse_name',
                            'like',
                            "%{$search}%"
                        );
                    });
            });
        }

        $batches = $query
            ->orderBy('batch_number', 'asc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('inventory-batches/index', [
            'batches' => $batches,
            'search' => $search ?? '',
        ]);
    }

    /**
     * Display the inventory batch creation form.
     */
    public function create(): Response
    {
        return Inertia::render('inventory-batches/create', [
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
     * Display the inventory batch edit form.
     */
    public function edit(int $id): Response
    {
        $batch = InventoryBatch::with([
            'ingredient',
            'warehouse',
        ])->findOrFail($id);

        return Inertia::render('inventory-batches/edit', [
            'batch' => $batch,
            'ingredients' => Ingredient::orderBy('ingredient_name')->get(),
            'warehouses' => Warehouse::orderBy('warehouse_name')->get(),
        ]);
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

    /**
     * Delete an inventory batch.
     */
    public function destroy(int $id): RedirectResponse
    {
        $batch = InventoryBatch::findOrFail($id);

        if ($batch->qualityInspections()->exists()) {
            return redirect()
                ->route('inventory-batches.index')
                ->with(
                    'error',
                    'Cannot delete this batch because it has existing quality inspection records.'
                );
        }

        $batch->delete();

        return redirect()
            ->route('inventory-batches.index')
            ->with('success', 'Inventory batch deleted successfully.');
    }
}
