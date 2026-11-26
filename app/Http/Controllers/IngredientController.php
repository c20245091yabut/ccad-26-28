<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreIngredientRequest;
use App\Http\Requests\UpdateIngredientRequest;
use App\Models\Ingredient;
use App\Models\Supplier;
use App\Services\IngredientService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class IngredientController extends Controller
{
    public function __construct(
        private IngredientService $ingredientService
    ) {}

    /**
     * Display paginated ingredients with supplier information.
     */
    public function index(): Response
    {
        $ingredients = Ingredient::query()
            ->select([
                'ingredient_id',
                'supplier_id',
                'ingredient_code',
                'ingredient_name',
            ])
            ->with('supplier:supplier_id,supplier_name')
            ->latest()
            ->paginate(10);

        return Inertia::render('ingredients/index', [
            'ingredients' => $ingredients,
        ]);
    }

    /**
     * Display the ingredient creation form.
     */
    public function create(): Response
    {
        $suppliers = Supplier::query()
            ->select([
                'supplier_id',
                'supplier_name',
            ])
            ->orderBy('supplier_name')
            ->get();

        return Inertia::render('ingredients/create', [
            'suppliers' => $suppliers,
        ]);
    }

    /**
     * Store a new ingredient.
     */
    public function store(
        StoreIngredientRequest $request
    ): RedirectResponse {
        $this->ingredientService->create(
            $request->validated()
        );

        return redirect()
            ->route('ingredients.index')
            ->with('success', 'Ingredient created successfully.');
    }

    /**
     * Update an existing ingredient.
     */
    public function update(
        UpdateIngredientRequest $request,
        int $id
    ): RedirectResponse {
        $this->ingredientService->update(
            $id,
            $request->validated()
        );

        return redirect()
            ->route('ingredients.index')
            ->with('success', 'Ingredient updated successfully.');
    }
}