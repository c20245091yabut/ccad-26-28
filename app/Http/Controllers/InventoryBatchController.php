<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInventoryBatchRequest;
use App\Http\Requests\UpdateInventoryBatchRequest;
use App\Services\InventoryBatchService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class InventoryBatchController extends Controller
{
    public function __construct(
        private InventoryBatchService $inventoryBatchService
    ) {}

    /**
     * Display and search inventory batches.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $search = is_string($search) ? $search : null;

        $batches = $this->inventoryBatchService->getAll($search);

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
        return Inertia::render(
            'inventory-batches/create',
            $this->inventoryBatchService->getFormOptions()
        );
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
        return Inertia::render('inventory-batches/edit', [
            'batch' => $this->inventoryBatchService->findForEdit($id),
            ...$this->inventoryBatchService->getFormOptions(),
        ]);
    }

    /**
     * Update an existing inventory batch.
     */
    public function update(
        UpdateInventoryBatchRequest $request,
        int $id
    ): RedirectResponse {
        $this->inventoryBatchService->update(
            $id,
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
        $deleted = $this->inventoryBatchService->delete($id);

        if (!$deleted) {
            return redirect()
                ->route('inventory-batches.index')
                ->with(
                    'error',
                    'Cannot delete this batch because it has existing quality inspection records.'
                );
        }

        return redirect()
            ->route('inventory-batches.index')
            ->with('success', 'Inventory batch deleted successfully.');
    }
}