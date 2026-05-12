<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\OperationalRequest;
use App\Models\User;

class AuditLogPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(UserRole::Admin, UserRole::Manager);
    }

    public function viewForRequest(User $user, OperationalRequest $operationalRequest): bool
    {
        if ($user->hasAnyRole(UserRole::Admin, UserRole::Manager)) {
            return true;
        }

        return $user->isOperator()
            && in_array($user->id, [$operationalRequest->requester_id, $operationalRequest->assignee_id], true);
    }
}
