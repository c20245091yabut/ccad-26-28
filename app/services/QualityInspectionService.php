<?php

namespace App\Services;

use App\Models\InventoryBatch;
use App\Models\Inspector;
use App\Models\QualityInspection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class QualityInspectionService
{
    /**
     * Retrieve paginated quality inspections.
     */
    public function getAll(): LengthAwarePaginator
    {
        return QualityInspection::query()
            ->select([
                'inspection_id',
                'batch_id',
                'inspector_id',
                'inspector_name',
                'inspection_date',
                'quality_status',
                'remarks',
            ])
            ->with([
                'inventoryBatch:batch_id,ingredient_id,batch_number',
                'inventoryBatch.ingredient:ingredient_id,ingredient_name',
                'inspector:inspector_id,full_name',
            ])
            ->latest('inspection_date')
            ->paginate(10);
    }

    /**
     * Retrieve inventory batches for inspection forms.
     */
    public function getBatches(): Collection
    {
        return InventoryBatch::query()
            ->select([
                'batch_id',
                'ingredient_id',
                'batch_number',
            ])
            ->with('ingredient:ingredient_id,ingredient_name')
            ->orderBy('batch_number')
            ->get();
    }

    public function getActiveInspectors(): Collection
    {
        return Inspector::query()
            ->select(['inspector_id', 'full_name'])
            ->where('status', 'Active')
            ->orderBy('full_name')
            ->get();
    }

    public function getInspectorsForEdit(QualityInspection $inspection): Collection
    {
        $query = Inspector::query()
            ->select(['inspector_id', 'full_name'])
            ->where('status', 'Active');

        if ($inspection->inspector_id) {
            $query->orWhere('inspector_id', $inspection->inspector_id);
        }

        return $query
            ->orderBy('full_name')
            ->get();
    }

    /**
     * Create a new quality inspection.
     */
    public function create(array $data): QualityInspection
    {
        return DB::transaction(function () use ($data) {
            $data = $this->prepareInspectorSnapshot($data);
            return QualityInspection::create($data);
        });
    }

    /**
     * Update an existing quality inspection.
     */
    public function update(
        QualityInspection $inspection,
        array $data
    ): QualityInspection {
        return DB::transaction(function () use ($inspection, $data) {
            $data = $this->prepareInspectorSnapshot($data);
            $inspection->update($data);

            return $inspection->refresh();
        });
    }

    /**
     * Delete a quality inspection.
     */
    public function delete(QualityInspection $inspection): bool
    {
        return DB::transaction(function () use ($inspection) {
            return (bool) $inspection->delete();
        });
    }

    private function prepareInspectorSnapshot(array $data): array
    {
        $inspector = Inspector::findOrFail($data['inspector_id']);
        $data['inspector_name'] = $inspector->full_name;
        return $data;
    }
}