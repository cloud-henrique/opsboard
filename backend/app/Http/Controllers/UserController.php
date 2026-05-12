<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\AuditLogger;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;

class UserController extends Controller
{
    public function __construct(private readonly AuditLogger $auditLogger) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        Gate::authorize('viewAny', User::class);

        $query = User::query()->orderBy('name');

        if ($request->has('active')) {
            $query->where('active', $request->boolean('active'));
        }

        if ($request->query('role')) {
            $query->where('role', $request->query('role'));
        }

        return UserResource::collection($query->get());
    }

    public function store(StoreUserRequest $request): UserResource
    {
        Gate::authorize('create', User::class);

        $user = User::create([
            ...$request->validated(),
            'active' => $request->boolean('active', true),
        ]);

        $this->auditLogger->log($request->user(), $user, 'user_created', null, $user->only(['name', 'email', 'role', 'active']));

        return new UserResource($user);
    }

    public function update(UpdateUserRequest $request, User $user): UserResource
    {
        Gate::authorize('update', $user);

        $old = $user->only(['name', 'email', 'role', 'active']);
        $payload = array_filter(
            $request->validated(),
            fn ($value, string $key): bool => ! ($key === 'password' && blank($value)),
            ARRAY_FILTER_USE_BOTH,
        );

        $user->update($payload);
        $user->refresh();

        $this->auditLogger->log($request->user(), $user, 'user_updated', $old, $user->only(['name', 'email', 'role', 'active']));

        return new UserResource($user);
    }
}
