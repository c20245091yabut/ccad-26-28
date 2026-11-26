<?php

namespace App\Services;

use App\Models\Ingredient;
use App\Models\InventoryBatch;
use App\Models\Warehouse;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class InventoryBatchService
{
    /**
     * Display and search inventory batches.
     */
    public function getAll(?string $search = null): LengthAwarePaginator
    {
        $query = InventoryBatch::with([
            'ingredient',
            'warehouse',
            'qualityInspections',
        ]);

        $search = trim($search ?? '');

        if ($search !== '') {
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

        return $query
            ->orderBy('batch_number', 'asc')
            ->paginate(10)
            ->withQueryString();
    }

    /**
     * Get ingredients and warehouses for dropdowns.
     */
    public function getFormOptions(): array
    {
        return [
            'ingredients' => Ingredient::query()
                ->select('ingredient_id', 'ingredient_name')
                ->orderBy('ingredient_name')
                ->get(),

            'warehouses' => Warehouse::query()
                ->select('warehouse_id', 'warehouse_name')
                ->orderBy('warehouse_name')
                ->get(),
        ];
    }

    /**
     * Find an inventory batch for editing.
     */
    public function findForEdit(int $id): InventoryBatch
    {
        return InventoryBatch::with([
            'ingredient',
            'warehouse',
        ])->findOrFail($id);
    }

    /**
     * Calculate the total value of an inventory batch.
     */
    public function calculateTotalBatchValue(
        float $quantity,
        float $unitCost
    ): float {
        return round($quantity * $unitCost, 2);
    }

    /**
     * Prepare batch data before saving.
     */
    public function prepareBatchData(array $data): array
    {
        if (isset($data['batch_number'])) {
            $data['batch_number'] = strtoupper(
                trim($data['batch_number'])
            );
        }

        $quantity = (float) $data['quantity_kg'];
        $unitCost = (float) $data['unit_cost'];

        $data['total_batch_value'] = $this->calculateTotalBatchValue(
            $quantity,
            $unitCost
        );

        return $data;
    }

    /**
     * Create a new inventory batch.
     */
    public function create(array $data): InventoryBatch
    {
        return DB::transaction(function () use ($data) {
            $data = $this->prepareBatchData($data);

            return InventoryBatch::create($data);
        });
    }

    /**
     * Update an existing inventory batch.
     */
    public function update(int $id, array $data): InventoryBatch
    {
        return DB::transaction(function () use ($id, $data) {
            $batch = InventoryBatch::findOrFail($id);

            $data['quantity_kg'] =
                $data['quantity_kg'] ?? $batch->quantity_kg;

            $data['unit_cost'] =
                $data['unit_cost'] ?? $batch->unit_cost;

            $data = $this->prepareBatchData($data);

            $batch->update($data);

            return $batch->load([
                'ingredient',
                'warehouse',
                'qualityInspections',
            ]);
        });
    }

    /**
     * Check whether an inventory batch can be allocated.
     */
    public function validateAllocation(InventoryBatch $batch): void
    {
        if ($batch->quality_status === 'Failed') {
            throw ValidationException::withMessages([
                'quality_status' =>
                    'Allocation is not allowed because this batch failed quality inspection.',
            ]);
        }

        if (
            $batch->expiry_date->startOfDay()
                ->lessThanOrEqualTo(today()->addDays(7))
        ) {
            throw ValidationException::withMessages([
                'expiry_date' =>
                    'Allocation is not allowed because this batch expires within 7 days or has already expired.',
            ]);
        }
    }

    /**
     * Delete an inventory batch if it has no inspection records.
     */
    public function delete(int $id): bool
    {
        return DB::transaction(function () use ($id) {
            $batch = InventoryBatch::findOrFail($id);

            if ($batch->qualityInspections()->exists()) {
                return false;
            }

            return (bool) $batch->delete();
        });
    }
}