<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Inspector extends Model
{
    protected $primaryKey = 'inspector_id';

    protected $fillable = [
        'full_name',
        'email',
        'phone_number',
        'position',
        'status',
    ];

    public function qualityInspections(): HasMany
    {
        return $this->hasMany(
            QualityInspection::class,
            'inspector_id',
            'inspector_id'
        );
    }
}
