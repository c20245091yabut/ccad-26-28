<?php

namespace App\Services;

use App\Models\Ingredient;
use Illuminate\Support\Facades\DB;

class IngredientService
{
    /**
     * Create a new ingredient.
     */
    public function create(array $data): Ingredient
    {
        return DB::transaction(function () use ($data) {

            $data['ingredient_code'] = strtoupper(
                trim($data['ingredient_code'])
            );

            $data['ingredient_name'] = trim(
                $data['ingredient_name']
            );

            return Ingredient::create($data);
        });
    }

    /**
     * Update an existing ingredient.
     */
    public function update(int $id, array $data): Ingredient
    {
        return DB::transaction(function () use ($id, $data) {

            $ingredient = Ingredient::findOrFail($id);

            if (isset($data['ingredient_code'])) {
                $data['ingredient_code'] = strtoupper(
                    trim($data['ingredient_code'])
                );
            }

            if (isset($data['ingredient_name'])) {
                $data['ingredient_name'] = trim(
                    $data['ingredient_name']
                );
            }

            $ingredient->update($data);

            return $ingredient->load('supplier');
        });
    }
}
