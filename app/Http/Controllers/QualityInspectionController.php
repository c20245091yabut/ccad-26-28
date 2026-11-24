<?php

namespace App\Http\Controllers;

use App\Models\InventoryBatch;
use App\Models\QualityInspection;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class QualityInspectionController extends Controller
{
    /**
     * Display all quality inspection records.
     */
    public function index(): Response
    {
        $inspections = QualityInspection::with([
            'inventoryBatch.ingredient', // need furhter optimization
            'inventoryBatch.warehouse', // need furhter optimization
        ])
            ->latest('inspection_date')
            ->paginate(10);

        return Inertia::render('quality-inspections/index', [
            'inspections' => $inspections,
        ]);
    }

    /**
     * Display the inspection creation form.
     */
    public function create(): Response
    {
        return Inertia::render('quality-inspections/create', [
            'batches' => InventoryBatch::with([
                'ingredient', // need furhter optimization
                'warehouse', // need furhter optimization
            ])->orderBy('batch_number')->get(), // need furhter optimization
        ]);
    }

    /**
     * Store a new quality inspection.
     */
    public function store(Request $request): RedirectResponse
    {
        //this must be move n  ur form reuest class
        $validated = $request->validate([
            'batch_id' => [
                'required',
                'integer',
                'exists:inventory_batches,batch_id',
            ],
            'inspector_name' => [
                'required',
                'string',
                'max:100',
            ],
            'inspection_date' => [
                'required',
                'date',
            ],
            'quality_status' => [
                'required',
                'in:Passed,Failed,Pending',
            ],
            'remarks' => [
                'nullable',
                'string',
            ],
        ]);

        //services
        QualityInspection::create($validated);

        return redirect()
            ->route('quality-inspections.index')
            ->with('success', 'Quality inspection created successfully.');
    }

    /**
     * Display an inspection by redirecting to its edit page.
     */
    public function show(QualityInspection $qualityInspection): RedirectResponse
    {
        return redirect()->route(
            'quality-inspections.edit',
            $qualityInspection->inspection_id
        );
    }

    /**
     * Display the inspection edit form.
     */
    public function edit(QualityInspection $qualityInspection): Response
    {
        return Inertia::render('quality-inspections/edit', [
            'inspection' => $qualityInspection->load([
                'inventoryBatch.ingredient', // need furhter optimization
                'inventoryBatch.warehouse', // need furhter optimization
            ]),
            'batches' => InventoryBatch::with([
                'ingredient', // need furhter optimization
                'warehouse', // need furhter optimization
            ])->orderBy('batch_number')->get(),
        ]);
    }

    /**
     * Update an existing inspection.
     */
    public function update(
        Request $request,
        QualityInspection $qualityInspection
    ): RedirectResponse {
        $validated = $request->validate([
            'batch_id' => [
                'required',
                'integer',
                'exists:inventory_batches,batch_id',
            ],
            'inspector_name' => [
                'required',
                'string',
                'max:100',
            ],
            'inspection_date' => [
                'required',
                'date',
            ],
            'quality_status' => [
                'required',
                'in:Passed,Failed,Pending',
            ],
            'remarks' => [
                'nullable',
                'string',
            ],
        ]);

        $qualityInspection->update($validated);

        return redirect()
            ->route('quality-inspections.index')
            ->with('success', 'Quality inspection updated successfully.');
    }

    /**
     * Delete an inspection.
     */
    public function destroy(
        QualityInspection $qualityInspection
    ): RedirectResponse {
        $qualityInspection->delete();

        return redirect()
            ->route('quality-inspections.index')
            ->with('success', 'Quality inspection deleted successfully.');
    }
}
