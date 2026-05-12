<?php

namespace App\Providers;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::define('view-dashboard', fn (User $user): bool => true);
        Gate::define('export-requests', fn (User $user): bool => $user->hasAnyRole(
            UserRole::Admin,
            UserRole::Manager,
            UserRole::Operator,
        ));
        Gate::define('import-categories', fn (User $user): bool => $user->hasAnyRole(
            UserRole::Admin,
            UserRole::Manager,
        ));
    }
}
