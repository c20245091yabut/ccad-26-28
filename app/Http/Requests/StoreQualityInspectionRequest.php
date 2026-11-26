<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreQualityInspectionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules.
     */
    public function rules(): array
    {
        return [
            'batch_id' => [
                'required',
                'integer',
                'exists:inventory_batches,batch_id',
            ],

            'inspector_id' => [
                'required',
                'integer',
                Rule::exists('inspectors', 'inspector_id')
                    ->where('status', 'Active'),
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
        ];
    }
}