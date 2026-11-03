<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InventoryBatch extends Model
{
    protected $primaryKey = 'batch_id';

    protected $fillable = [
        'ingredient_id',
        'warehouse_id',
        'batch_number',
        'quantity_kg',
        'unit_cost',
        'expiry_date',
        'quality_status',
    ];

    protected function casts(): array
    {
        return [
            'quantity_kg' => 'decimal:2',
            'unit_cost' => 'decimal:2',
            'total_batch_value' => 'decimal:2',
            'expiry_date' => 'date',
        ];
    }

    public function ingredient(): BelongsTo
    {
        return $this->belongsTo(Ingredient::class, 'ingredient_id');
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'warehouse_id');
    }

    public function qualityInspections(): HasMany
    {
        return $this->hasMany(QualityInspection::class, 'batch_id');
    }
}