<?php

namespace App\Http\Requests;

use App\Enums\RequestPriority;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOperationalRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:160'],
            'description' => ['required', 'string', 'max:5000'],
            'category_id' => ['required', Rule::exists('categories', 'id')->where('active', true)],
            'priority' => ['required', Rule::in(RequestPriority::values())],
            'assignee_id' => ['nullable', Rule::exists('users', 'id')->where('active', true)],
            'due_date' => ['nullable', 'date'],
        ];
    }
}
