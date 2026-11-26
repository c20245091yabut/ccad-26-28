<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInspectorRequest;
use App\Http\Requests\UpdateInspectorRequest;
use App\Models\Inspector;
use App\Services\InspectorService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class InspectorController extends Controller
{
    public function __construct(
        private InspectorService $inspectorService
    ) {}

    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $search = is_string($search) ? $search : null;

        return Inertia::render('inspectors/index', [
            'inspectors' => $this->inspectorService->getAll($search),
            'search' => $search ?? '',
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('inspectors/create');
    }

    public function store(StoreInspectorRequest $request): RedirectResponse
    {
        $this->inspectorService->create($request->validated());

        return redirect()
            ->route('inspectors.index')
            ->with('success', 'Inspector created successfully.');
    }

    public function show(Inspector $inspector): Response
    {
        return Inertia::render('inspectors/show', [
            ...$this->inspectorService->findForShow($inspector),
        ]);
    }

    public function edit(Inspector $inspector): Response
    {
        return Inertia::render('inspectors/edit', [
            'inspector' => $inspector,
        ]);
    }

    public function update(
        UpdateInspectorRequest $request,
        Inspector $inspector
    ): RedirectResponse {
        $this->inspectorService->update(
            $inspector,
            $request->validated()
        );

        return redirect()
            ->route('inspectors.index')
            ->with('success', 'Inspector updated successfully.');
    }

    public function destroy(Inspector $inspector): RedirectResponse
    {
        $deleted = $this->inspectorService->delete($inspector);

        if (! $deleted) {
            return redirect()
                ->route('inspectors.index')
                ->with('error', 'Cannot delete this inspector because inspection records exist.');
        }

        return redirect()
            ->route('inspectors.index')
            ->with('success', 'Inspector deleted successfully.');
    }
}
