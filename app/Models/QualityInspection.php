<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QualityInspection extends Model
{
    protected $primaryKey = 'inspection_id';

    protected $fillable = [
        'batch_id',
        'inspector_name',
        'inspection_date',
        'quality_status',
        'remarks',
    ];

    protected function casts(): array
    {
        return [
            'inspection_date' => 'date',
        ];
    }

    public function inventoryBatch(): BelongsTo
    {
        return $this->belongsTo(
            InventoryBatch::class,
            'batch_id'
        );
    }
}