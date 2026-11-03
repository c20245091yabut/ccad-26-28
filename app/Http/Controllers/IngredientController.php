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
    private IngredientService $ingredientService;

    /**
     * Display paginated ingredients.
     */
    public function index(): Response
    {
        $ingredients = Ingredient::with('supplier')
            ->latest()
            ->paginate(10);

        return Inertia::render('Ingredients/Index', [
            'ingredients' => $ingredients,
        ]);
    }

    /**
     * Display the ingredient creation form.
     */
    public function create(): Response
    {
        return Inertia::render('Ingredients/Create', [
            'suppliers' => Supplier::orderBy('supplier_name')->get(),
        ]);
    }

    /**
     * Store a newly created ingredient.
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
        $id
    ): RedirectResponse {
        $this->ingredientService->update(
            (int) $id,
            $request->validated()
        );

        return redirect()
            ->route('ingredients.index')
            ->with('success', 'Ingredient updated successfully.');
    }
}
