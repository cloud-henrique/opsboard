<?php

namespace App\Models;

use App\Enums\RequestStatus;
use Database\Factories\OperationalRequestFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'title',
    'description',
    'category_id',
    'status',
    'priority',
    'requester_id',
    'assignee_id',
    'due_date',
    'resolved_at',
    'cancelled_at',
])]
class OperationalRequest extends Model
{
    /** @use HasFactory<OperationalRequestFactory> */
    use HasFactory;

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requester_id');
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }

    public function scopeActiveForDeadline(Builder $query): Builder
    {
        return $query->whereNotIn('status', [
            RequestStatus::Resolved->value,
            RequestStatus::Cancelled->value,
        ]);
    }

    protected function casts(): array
    {
        return [
            'due_date' => 'datetime',
            'resolved_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }
}
