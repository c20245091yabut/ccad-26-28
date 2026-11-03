<?php

namespace App\Services;

use App\Models\InventoryBatch;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class InventoryBatchService
{
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

        $data['total_batch_value'] =
            $this->calculateTotalBatchValue($quantity, $unitCost);

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
}
