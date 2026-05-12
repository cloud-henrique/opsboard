<?php

namespace App\Http\Controllers;

use App\Http\Resources\AuditLogResource;
use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;

class AuditLogController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        Gate::authorize('viewAny', AuditLog::class);

        $query = AuditLog::with('user')
            ->when($request->query('action'), fn (Builder $query, string $action): Builder => $query->where('action', $action))
            ->when($request->query('user_id'), fn (Builder $query, string $userId): Builder => $query->where('user_id', $userId))
            ->when($request->query('date_from'), fn (Builder $query, string $date): Builder => $query->whereDate('created_at', '>=', $date))
            ->when($request->query('date_to'), fn (Builder $query, string $date): Builder => $query->whereDate('created_at', '<=', $date))
            ->latest();

        return AuditLogResource::collection($query->paginate(min(max((int) $request->integer('per_page', 20), 1), 50)));
    }
}
