<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreIngredientRequest extends FormRequest
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
        if ($this->has('ingredient_code')) {
            $this->merge([
                'ingredient_code' => strtoupper(
                    trim($this->ingredient_code)
                ),
            ]);
        }

        if ($this->has('ingredient_name')) {
            $this->merge([
                'ingredient_name' => trim($this->ingredient_name),
            ]);
        }
    }

    /**
     * Get the validation rules.
     */
    public function rules(): array
    {
        return [
            'supplier_id' => [
                'required',
                'integer',
                'exists:suppliers,supplier_id',
            ],

            'ingredient_code' => [
                'required',
                'string',
                'max:50',
                'regex:/^[A-Z0-9_-]+$/',
                Rule::unique('ingredients', 'ingredient_code'),
            ],

            'ingredient_name' => [
                'required',
                'string',
                'max:150',
            ],
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'supplier_id.required' =>
                'Please select a supplier.',

            'supplier_id.integer' =>
                'Supplier ID must be a valid number.',

            'supplier_id.exists' =>
                'The selected supplier does not exist.',

            'ingredient_code.required' =>
                'Ingredient code is required.',

            'ingredient_code.string' =>
                'Ingredient code must be text.',

            'ingredient_code.max' =>
                'Ingredient code must not exceed 50 characters.',

            'ingredient_code.regex' =>
                'Ingredient code must contain only uppercase letters, numbers, hyphens, or underscores.',

            'ingredient_code.unique' =>
                'Ingredient code already exists.',

            'ingredient_name.required' =>
                'Ingredient name is required.',

            'ingredient_name.string' =>
                'Ingredient name must be text.',

            'ingredient_name.max' =>
                'Ingredient name must not exceed 150 characters.',
        ];
    }

    /**
     * Get custom attribute names for validation errors.
     */
    public function attributes(): array
    {
        return [
            'supplier_id' => 'supplier',
            'ingredient_code' => 'ingredient code',
            'ingredient_name' => 'ingredient name',
        ];
    }
}
