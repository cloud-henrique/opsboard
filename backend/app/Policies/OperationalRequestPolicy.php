<?php

namespace App\Policies;

use App\Enums\RequestStatus;
use App\Enums\UserRole;
use App\Models\OperationalRequest;
use App\Models\User;

class OperationalRequestPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, OperationalRequest $operationalRequest): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return ! $user->isViewer();
    }

    public function update(User $user, OperationalRequest $operationalRequest): bool
    {
        if ($user->hasAnyRole(UserRole::Admin, UserRole::Manager)) {
            return true;
        }

        return $user->isOperator()
            && $operationalRequest->assignee_id === $user->id
            && $operationalRequest->status !== RequestStatus::Cancelled->value;
    }

    public function changeStatus(User $user, OperationalRequest $operationalRequest): bool
    {
        if ($user->hasAnyRole(UserRole::Admin, UserRole::Manager)) {
            return true;
        }

        return $user->isOperator()
            && $operationalRequest->assignee_id === $user->id
            && $operationalRequest->status !== RequestStatus::Cancelled->value;
    }

    public function assign(User $user, OperationalRequest $operationalRequest): bool
    {
        return $user->hasAnyRole(UserRole::Admin, UserRole::Manager);
    }

    public function export(User $user): bool
    {
        return $user->hasAnyRole(UserRole::Admin, UserRole::Manager, UserRole::Operator);
    }
}
