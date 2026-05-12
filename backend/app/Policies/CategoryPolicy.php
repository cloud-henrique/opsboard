<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Category;
use App\Models\User;

class CategoryPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(UserRole::Admin, UserRole::Manager);
    }

    public function update(User $user, Category $category): bool
    {
        return $user->hasAnyRole(UserRole::Admin, UserRole::Manager);
    }

    public function import(User $user): bool
    {
        return $user->hasAnyRole(UserRole::Admin, UserRole::Manager);
    }
}
