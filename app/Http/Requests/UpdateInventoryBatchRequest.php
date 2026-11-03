<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateInventoryBatchRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Prepare and sanitize data before validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('batch_number')) {
            $this->merge([
                'batch_number' => strtoupper(
                    trim($this->batch_number)
                ),
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'ingredient_id' => [
                'sometimes',
                'required',
                'integer',
                'exists:ingredients,ingredient_id',
            ],

            'warehouse_id' => [
                'sometimes',
                'required',
                'integer',
                'exists:warehouses,warehouse_id',
            ],

            'batch_number' => [
                'sometimes',
                'required',
                'string',
                'max:50',
                'regex:/^[A-Z0-9_-]+$/',
                Rule::unique('inventory_batches', 'batch_number')
                    ->ignore($id, 'batch_id'),
            ],

            'quantity_kg' => [
                'sometimes',
                'required',
                'numeric',
                'gt:0',
                'decimal:0,2',
            ],

            'unit_cost' => [
                'sometimes',
                'required',
                'numeric',
                'min:0',
                'decimal:0,2',
            ],

            'expiry_date' => [
                'sometimes',
                'required',
                'date',
            ],

            'quality_status' => [
                'sometimes',
                'required',
                Rule::in(['Pending', 'Passed', 'Failed']),
            ],
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'ingredient_id.required' =>
                'Please select an ingredient.',

            'ingredient_id.exists' =>
                'The selected ingredient does not exist.',

            'warehouse_id.required' =>
                'Please select a warehouse.',

            'warehouse_id.exists' =>
                'The selected warehouse does not exist.',

            'batch_number.required' =>
                'Batch number is required.',

            'batch_number.unique' =>
                'Batch number already exists.',

            'batch_number.regex' =>
                'Batch number must contain uppercase letters, numbers, hyphens, or underscores.',

            'quantity_kg.gt' =>
                'Quantity must be greater than zero.',

            'unit_cost.min' =>
                'Unit cost cannot be negative.',

            'expiry_date.required' =>
                'Expiry date is required.',

            'quality_status.in' =>
                'Quality status must be Pending, Passed, or Failed.',
        ];
    }

    /**
     * Get custom attribute names.
     */
    public function attributes(): array
    {
        return [
            'ingredient_id' => 'ingredient',
            'warehouse_id' => 'warehouse',
            'batch_number' => 'batch number',
            'quantity_kg' => 'quantity in kilograms',
            'unit_cost' => 'unit cost',
            'expiry_date' => 'expiry date',
            'quality_status' => 'quality status',
        ];
    }
}
