<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateInspectorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'full_name' => is_string($this->full_name) ? trim($this->full_name) : $this->full_name,
            'email' => is_string($this->email) ? strtolower(trim($this->email)) : $this->email,
            'phone_number' => is_string($this->phone_number) ? trim($this->phone_number) : $this->phone_number,
            'position' => is_string($this->position) ? trim($this->position) : $this->position,
        ]);
    }

    public function rules(): array
    {
        $inspector = $this->route('inspector');
        $inspectorId = $inspector instanceof \App\Models\Inspector
            ? $inspector->inspector_id
            : null;

        return [
            'full_name' => ['required', 'string', 'max:150'],
            'email' => ['required', 'email', 'max:150', Rule::unique('inspectors', 'email')->ignore($inspectorId, 'inspector_id')],
            'phone_number' => ['required', 'string', 'max:30'],
            'position' => ['required', 'string', 'max:100'],
            'status' => ['required', Rule::in(['Active', 'Inactive'])],
        ];
    }
}
