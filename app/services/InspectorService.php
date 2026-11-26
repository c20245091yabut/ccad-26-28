<?php

namespace App\Services;

use App\Models\Inspector;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class InspectorService
{
    public function getAll(?string $search = null): LengthAwarePaginator
    {
        $query = Inspector::query()->select([
            'inspector_id',
            'full_name',
            'email',
            'phone_number',
            'position',
            'status',
        ]);

        $search = trim($search ?? '');

        if ($search !== '') {
            $query->where('full_name', 'like', "%{$search}%");
        }

        return $query
            ->orderBy('full_name')
            ->paginate(10)
            ->withQueryString();
    }

    public function findForShow(Inspector $inspector): array
    {
        $history = $inspector->qualityInspections()
            ->select([
                'inspection_id',
                'batch_id',
                'inspector_id',
                'inspection_date',
                'quality_status',
                'remarks',
            ])
            ->with([
                'inventoryBatch:batch_id,ingredient_id,batch_number',
                'inventoryBatch.ingredient:ingredient_id,supplier_id,ingredient_name',
                'inventoryBatch.ingredient.supplier:supplier_id,supplier_name',
            ])
            ->latest('inspection_date')
            ->paginate(10);

        return [
            'inspector' => $inspector,
            'history' => $history,
        ];
    }

    public function create(array $data): Inspector
    {
        return DB::transaction(function () use ($data) {
            $data = $this->normalize($data);
            return Inspector::create($data);
        });
    }

    public function update(Inspector $inspector, array $data): Inspector
    {
        return DB::transaction(function () use ($inspector, $data) {
            $inspector->update($this->normalize($data));
            return $inspector;
        });
    }

    public function delete(Inspector $inspector): bool
    {
        return DB::transaction(function () use ($inspector) {
            if ($inspector->qualityInspections()->exists()) {
                return false;
            }

            return (bool) $inspector->delete();
        });
    }

    private function normalize(array $data): array
    {
        $data['full_name'] = trim($data['full_name']);
        $data['email'] = strtolower(trim($data['email']));
        $data['phone_number'] = trim($data['phone_number']);
        $data['position'] = trim($data['position']);
        return $data;
    }
}
