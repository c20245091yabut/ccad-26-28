<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Warehouse extends Model
{
    protected $primaryKey = 'warehouse_id';

    protected $fillable = [
        'warehouse_name',
    ];

    public function inventoryBatches(): HasMany
    {
        return $this->hasMany(InventoryBatch::class, 'warehouse_id');
    }
}