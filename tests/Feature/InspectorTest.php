<?php

namespace Tests\Feature;

use App\Models\Ingredient;
use App\Models\Inspector;
use App\Models\InventoryBatch;
use App\Models\QualityInspection;
use App\Models\Supplier;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class InspectorTest extends TestCase
{
    use RefreshDatabase;

    public function test_inspector_crud(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/inspectors', [
                'full_name' => 'Maria Santos',
                'email' => 'maria@example.com',
                'phone_number' => '09123456789',
                'position' => 'Quality Inspector',
                'status' => 'Active',
            ])
            ->assertRedirect('/inspectors');

        $inspector = Inspector::where('full_name', 'Maria Santos')->firstOrFail();

        $this->actingAs($user)
            ->get("/inspectors/{$inspector->inspector_id}")
            ->assertOk();

        $this->actingAs($user)
            ->put("/inspectors/{$inspector->inspector_id}", [
                'full_name' => 'Maria Santos',
                'email' => 'maria.updated@example.com',
                'phone_number' => '09987654321',
                'position' => 'Senior Quality Inspector',
                'status' => 'Inactive',
            ])
            ->assertRedirect('/inspectors');

        $this->assertSame('Inactive', $inspector->refresh()->status);

        $this->actingAs($user)
            ->delete("/inspectors/{$inspector->inspector_id}")
            ->assertRedirect('/inspectors');

        $this->assertNull(Inspector::find($inspector->inspector_id));
    }

    public function test_inspector_with_quality_inspection_cannot_be_deleted(): void
    {
        $user = User::factory()->create();
        $inspector = Inspector::create([
            'full_name' => 'Juan Dela Cruz',
            'email' => 'juan@example.com',
            'phone_number' => '09111111111',
            'position' => 'Inspector',
            'status' => 'Active',
        ]);

        $supplier = Supplier::create(['supplier_name' => 'Golden Flour Supplier']);
        $warehouse = Warehouse::create(['warehouse_name' => 'Main Warehouse']);
        $ingredient = Ingredient::create([
            'supplier_id' => $supplier->supplier_id,
            'ingredient_code' => 'FL001',
            'ingredient_name' => 'Bread Flour',
        ]);
        $batch = InventoryBatch::create([
            'ingredient_id' => $ingredient->ingredient_id,
            'warehouse_id' => $warehouse->warehouse_id,
            'batch_number' => 'BATCH-001',
            'quantity_kg' => 100,
            'unit_cost' => 50,
            'expiry_date' => now()->addMonth()->toDateString(),
            'total_batch_value' => 5000,
            'quality_status' => 'Pending',
        ]);

        QualityInspection::create([
            'batch_id' => $batch->batch_id,
            'inspector_id' => $inspector->inspector_id,
            'inspector_name' => $inspector->full_name,
            'inspection_date' => now()->toDateString(),
            'quality_status' => 'Passed',
            'remarks' => 'Supplier batch passed.',
        ]);

        $this->actingAs($user)
            ->delete("/inspectors/{$inspector->inspector_id}")
            ->assertRedirect('/inspectors');

        $this->assertNotNull(Inspector::find($inspector->inspector_id));

        $this->actingAs($user)
            ->get("/inspectors/{$inspector->inspector_id}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('inspectors/show')
                ->where('history.data.0.inventory_batch.ingredient.supplier.supplier_name', 'Golden Flour Supplier')
            );
    }
}
