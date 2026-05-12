<?php

namespace App\Http\Requests;

use App\Enums\RequestPriority;
use App\Enums\RequestStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOperationalRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:160'],
            'description' => ['sometimes', 'required', 'string', 'max:5000'],
            'category_id' => ['sometimes', 'required', Rule::exists('categories', 'id')->where('active', true)],
            'status' => ['sometimes', 'required', Rule::in(RequestStatus::values())],
            'priority' => ['sometimes', 'required', Rule::in(RequestPriority::values())],
            'assignee_id' => ['sometimes', 'nullable', Rule::exists('users', 'id')->where('active', true)],
            'due_date' => ['sometimes', 'nullable', 'date'],
        ];
    }
}
