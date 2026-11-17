<?php

namespace App\Http\Controllers;

use App\Models\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class WarehouseController extends Controller
{
    // Display all warehouses
    public function index(): Response
    {
        $warehouses = Warehouse::latest()->paginate(10);

        return Inertia::render('warehouses/index', [
            'warehouses' => $warehouses,
        ]);
    }

    // Show create form
    public function create(): Response
    {
        return Inertia::render('warehouses/create');
    }

    // Save new warehouse
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'warehouse_name' => [
                'required',
                'string',
                'max:100',
                'unique:warehouses,warehouse_name',
            ],
        ]);

        Warehouse::create($validated);

        return redirect()
            ->route('warehouses.index')
            ->with('success', 'Warehouse created successfully.');
    }

    // Show a specific warehouse
    public function show(int $id): Response
    {
        $warehouse = Warehouse::findOrFail($id);

        return Inertia::render('warehouses/show', [
            'warehouse' => $warehouse,
        ]);
    }

    // Show edit form
    public function edit(int $id): Response
    {
        $warehouse = Warehouse::findOrFail($id);

        return Inertia::render('warehouses/edit', [
            'warehouse' => $warehouse,
        ]);
    }

    // Update warehouse
    public function update(Request $request, int $id): RedirectResponse
    {
        $warehouse = Warehouse::findOrFail($id);

        $validated = $request->validate([
            'warehouse_name' => [
                'required',
                'string',
                'max:100',
                'unique:warehouses,warehouse_name,' . $id . ',warehouse_id',
            ],
        ]);

        $warehouse->update($validated);

        return redirect()
            ->route('warehouses.index')
            ->with('success', 'Warehouse updated successfully.');
    }

    // Delete warehouse
    public function destroy(int $id): RedirectResponse
    {
        $warehouse = Warehouse::findOrFail($id);

        if ($warehouse->inventoryBatches()->exists()) {
            return back()->with(
                'error',
                'Cannot delete this warehouse because it has inventory batches.'
            );
        }

        $warehouse->delete();

        return redirect()
            ->route('warehouses.index')
            ->with('success', 'Warehouse deleted successfully.');
    }
}
