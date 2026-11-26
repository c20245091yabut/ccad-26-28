<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreQualityInspectionRequest;
use App\Http\Requests\UpdateQualityInspectionRequest;
use App\Models\QualityInspection;
use App\Services\QualityInspectionService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class QualityInspectionController extends Controller
{
    public function __construct(
        private QualityInspectionService $qualityInspectionService
    ) {}

    /**
     * Display all quality inspection records.
     */
    public function index(): Response
    {
        return Inertia::render('quality-inspections/index', [
            'inspections' => $this->qualityInspectionService->getAll(),
        ]);
    }

    /**
     * Display the inspection creation form.
     */
    public function create(): Response
    {
        return Inertia::render('quality-inspections/create', [
            'batches' => $this->qualityInspectionService->getBatches(),
            'inspectors' => $this->qualityInspectionService->getActiveInspectors(),
        ]);
    }

    /**
     * Store a new quality inspection.
     */
    public function store(
        StoreQualityInspectionRequest $request
    ): RedirectResponse {
        $this->qualityInspectionService->create(
            $request->validated()
        );

        return redirect()
            ->route('quality-inspections.index')
            ->with('success', 'Quality inspection created successfully.');
    }

    /**
     * Display an inspection by redirecting to its edit page.
     */
    public function show(
        QualityInspection $qualityInspection
    ): RedirectResponse {
        return redirect()->route(
            'quality-inspections.edit',
            $qualityInspection->inspection_id
        );
    }

    /**
     * Display the inspection edit form.
     */
    public function edit(
        QualityInspection $qualityInspection
    ): Response {
        return Inertia::render('quality-inspections/edit', [
            'inspection' => $qualityInspection->load('inspector:inspector_id,full_name'),
            'batches' => $this->qualityInspectionService->getBatches(),
            'inspectors' => $this->qualityInspectionService->getInspectorsForEdit($qualityInspection),
        ]);
    }

    /**
     * Update an existing inspection.
     */
    public function update(
        UpdateQualityInspectionRequest $request,
        QualityInspection $qualityInspection
    ): RedirectResponse {
        $this->qualityInspectionService->update(
            $qualityInspection,
            $request->validated()
        );

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
        $this->qualityInspectionService->delete(
            $qualityInspection
        );

        return redirect()
            ->route('quality-inspections.index')
            ->with('success', 'Quality inspection deleted successfully.');
    }
}