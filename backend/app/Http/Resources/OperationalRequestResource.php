<?php

namespace App\Http\Resources;

use App\Enums\RequestPriority;
use App\Enums\RequestStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OperationalRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $status = RequestStatus::tryFrom($this->status);
        $priority = RequestPriority::tryFrom($this->priority);

        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'status_label' => $status?->label(),
            'priority' => $this->priority,
            'priority_label' => $priority?->label(),
            'category_id' => $this->category_id,
            'requester_id' => $this->requester_id,
            'assignee_id' => $this->assignee_id,
            'due_date' => $this->due_date?->toISOString(),
            'resolved_at' => $this->resolved_at?->toISOString(),
            'cancelled_at' => $this->cancelled_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'requester' => new UserResource($this->whenLoaded('requester')),
            'assignee' => new UserResource($this->whenLoaded('assignee')),
        ];
    }
}
