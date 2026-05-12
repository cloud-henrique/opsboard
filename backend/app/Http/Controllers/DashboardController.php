<?php

namespace App\Http\Controllers;

use App\Enums\RequestStatus;
use App\Models\OperationalRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class DashboardController extends Controller
{
    public function __invoke(): JsonResponse
    {
        Gate::authorize('view-dashboard');

        $now = now();
        $resolvedRequests = OperationalRequest::whereNotNull('resolved_at')->get(['created_at', 'resolved_at']);
        $averageResolutionHours = $resolvedRequests->isEmpty()
            ? 0
            : round($resolvedRequests->avg(fn (OperationalRequest $request): float => $request->created_at->diffInMinutes($request->resolved_at) / 60), 1);

        return response()->json([
            'total_requests' => OperationalRequest::count(),
            'open_requests' => OperationalRequest::where('status', RequestStatus::Open->value)->count(),
            'in_progress_requests' => OperationalRequest::where('status', RequestStatus::InProgress->value)->count(),
            'overdue_requests' => OperationalRequest::activeForDeadline()->whereNotNull('due_date')->where('due_date', '<', $now)->count(),
            'resolved_this_month' => OperationalRequest::where('status', RequestStatus::Resolved->value)
                ->whereBetween('resolved_at', [$now->copy()->startOfMonth(), $now->copy()->endOfMonth()])
                ->count(),
            'average_resolution_hours' => $averageResolutionHours,
            'by_status' => $this->countBy('status'),
            'by_priority' => $this->countBy('priority'),
        ]);
    }

    /**
     * @return array<int, array{key:string, total:int}>
     */
    private function countBy(string $column): array
    {
        return OperationalRequest::query()
            ->selectRaw($column.' as key, count(*) as total')
            ->groupBy($column)
            ->orderBy($column)
            ->get()
            ->map(fn ($row): array => ['key' => $row->key, 'total' => (int) $row->total])
            ->values()
            ->all();
    }
}
