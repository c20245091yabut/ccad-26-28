<?php

namespace App\Services;

use App\Models\Supplier;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class SupplierService
{
    /**
     * Get all suppliers.
     */
    public function getAll(): LengthAwarePaginator
    {
        return Supplier::orderBy('supplier_id', 'desc')
            ->paginate(10);
    }

    /**
     * Create a new supplier.
     */
    public function create(array $data): Supplier
    {
        return DB::transaction(function () use ($data) {

            $data['supplier_name'] = trim(
                $data['supplier_name']
            );

            return Supplier::create($data);
        });
    }

    /**
     * Update an existing supplier.
     */
    public function update(int $id, array $data): Supplier
    {
        return DB::transaction(function () use ($id, $data) {

            $supplier = Supplier::findOrFail($id);

            if (isset($data['supplier_name'])) {
                $data['supplier_name'] = trim(
                    $data['supplier_name']
                );
            }

            $supplier->update($data);

            return $supplier;
        });
    }

    /**
     * Delete a supplier if it has no associated ingredients.
     */
    public function delete(int $id): bool
    {
        return DB::transaction(function () use ($id) {

            $supplier = Supplier::findOrFail($id);

            if ($supplier->ingredients()->exists()) {
                return false;
            }

            return (bool) $supplier->delete();
        });
    }
}
