<?php

namespace App\Http\Controllers;

use App\Enums\RequestStatus;
use App\Http\Requests\AssignRequestRequest;
use App\Http\Requests\StoreOperationalRequestRequest;
use App\Http\Requests\UpdateOperationalRequestRequest;
use App\Http\Requests\UpdateRequestStatusRequest;
use App\Http\Resources\AuditLogResource;
use App\Http\Resources\OperationalRequestResource;
use App\Models\AuditLog;
use App\Models\OperationalRequest;
use App\Policies\AuditLogPolicy;
use App\Services\AuditLogger;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\StreamedResponse;

class OperationalRequestController extends Controller
{
    public function __construct(private readonly AuditLogger $auditLogger) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        Gate::authorize('viewAny', OperationalRequest::class);

        $perPage = min(max((int) $request->integer('per_page', 10), 1), 50);

        return OperationalRequestResource::collection(
            $this->queryFromFilters($request)
                ->paginate($perPage)
                ->withQueryString()
        );
    }

    public function store(StoreOperationalRequestRequest $request): OperationalRequestResource
    {
        Gate::authorize('create', OperationalRequest::class);

        $operationalRequest = OperationalRequest::create([
            ...$request->validated(),
            'requester_id' => $request->user()->id,
            'status' => RequestStatus::Open->value,
        ])->load(['category', 'requester', 'assignee']);

        $this->auditLogger->log(
            $request->user(),
            $operationalRequest,
            'request_created',
            null,
            $operationalRequest->only(['title', 'status', 'priority', 'category_id', 'assignee_id', 'due_date'])
        );

        return new OperationalRequestResource($operationalRequest);
    }

    public function show(OperationalRequest $operationalRequest): OperationalRequestResource
    {
        Gate::authorize('view', $operationalRequest);

        return new OperationalRequestResource($operationalRequest->load(['category', 'requester', 'assignee']));
    }

    public function update(UpdateOperationalRequestRequest $request, OperationalRequest $operationalRequest): OperationalRequestResource
    {
        Gate::authorize('update', $operationalRequest);

        $old = $operationalRequest->only(['title', 'description', 'category_id', 'status', 'priority', 'assignee_id', 'due_date']);
        $payload = $request->validated();

        if (($payload['status'] ?? null) === RequestStatus::Resolved->value) {
            $payload['resolved_at'] = $operationalRequest->resolved_at ?? now();
            $payload['cancelled_at'] = null;
        }

        if (($payload['status'] ?? null) === RequestStatus::Cancelled->value) {
            $payload['cancelled_at'] = $operationalRequest->cancelled_at ?? now();
            $payload['resolved_at'] = null;
        }

        $operationalRequest->update($payload);
        $operationalRequest->refresh()->load(['category', 'requester', 'assignee']);

        $new = $operationalRequest->only(['title', 'description', 'category_id', 'status', 'priority', 'assignee_id', 'due_date']);
        $this->auditLogger->log($request->user(), $operationalRequest, 'request_updated', $old, $new);

        if (($old['priority'] ?? null) !== ($new['priority'] ?? null)) {
            $this->auditLogger->log($request->user(), $operationalRequest, 'priority_changed', ['priority' => $old['priority']], ['priority' => $new['priority']]);
        }

        if (($old['status'] ?? null) !== ($new['status'] ?? null)) {
            $this->auditLogger->log($request->user(), $operationalRequest, 'status_changed', ['status' => $old['status']], ['status' => $new['status']]);
        }

        return new OperationalRequestResource($operationalRequest);
    }

    public function updateStatus(UpdateRequestStatusRequest $request, OperationalRequest $operationalRequest): OperationalRequestResource
    {
        Gate::authorize('changeStatus', $operationalRequest);

        $oldStatus = $operationalRequest->status;
        $status = $request->validated('status');
        $payload = ['status' => $status];

        if ($status === RequestStatus::Resolved->value) {
            $payload['resolved_at'] = now();
            $payload['cancelled_at'] = null;
        } elseif ($status === RequestStatus::Cancelled->value) {
            $payload['cancelled_at'] = now();
            $payload['resolved_at'] = null;
        } elseif (in_array($oldStatus, [RequestStatus::Resolved->value, RequestStatus::Cancelled->value], true)) {
            $payload['resolved_at'] = null;
            $payload['cancelled_at'] = null;
        }

        $operationalRequest->update($payload);
        $operationalRequest->refresh()->load(['category', 'requester', 'assignee']);

        $this->auditLogger->log($request->user(), $operationalRequest, 'status_changed', ['status' => $oldStatus], ['status' => $status]);

        if ($status === RequestStatus::Resolved->value) {
            $this->auditLogger->log($request->user(), $operationalRequest, 'request_resolved', ['status' => $oldStatus], ['resolved_at' => $operationalRequest->resolved_at?->toISOString()]);
        }

        if ($status === RequestStatus::Cancelled->value) {
            $this->auditLogger->log($request->user(), $operationalRequest, 'request_cancelled', ['status' => $oldStatus], ['cancelled_at' => $operationalRequest->cancelled_at?->toISOString()]);
        }

        return new OperationalRequestResource($operationalRequest);
    }

    public function assign(AssignRequestRequest $request, OperationalRequest $operationalRequest): OperationalRequestResource
    {
        Gate::authorize('assign', $operationalRequest);

        $oldAssignee = $operationalRequest->assignee_id;
        $operationalRequest->update($request->validated());
        $operationalRequest->refresh()->load(['category', 'requester', 'assignee']);

        $this->auditLogger->log(
            $request->user(),
            $operationalRequest,
            'assignee_changed',
            ['assignee_id' => $oldAssignee],
            ['assignee_id' => $operationalRequest->assignee_id]
        );

        return new OperationalRequestResource($operationalRequest);
    }

    public function resolve(Request $request, OperationalRequest $operationalRequest): OperationalRequestResource
    {
        Gate::authorize('changeStatus', $operationalRequest);

        $oldStatus = $operationalRequest->status;
        $operationalRequest->update([
            'status' => RequestStatus::Resolved->value,
            'resolved_at' => now(),
            'cancelled_at' => null,
        ]);
        $operationalRequest->refresh()->load(['category', 'requester', 'assignee']);

        $this->auditLogger->log($request->user(), $operationalRequest, 'request_resolved', ['status' => $oldStatus], ['status' => RequestStatus::Resolved->value]);

        return new OperationalRequestResource($operationalRequest);
    }

    public function cancel(Request $request, OperationalRequest $operationalRequest): OperationalRequestResource
    {
        Gate::authorize('changeStatus', $operationalRequest);

        $oldStatus = $operationalRequest->status;
        $operationalRequest->update([
            'status' => RequestStatus::Cancelled->value,
            'cancelled_at' => now(),
            'resolved_at' => null,
        ]);
        $operationalRequest->refresh()->load(['category', 'requester', 'assignee']);

        $this->auditLogger->log($request->user(), $operationalRequest, 'request_cancelled', ['status' => $oldStatus], ['status' => RequestStatus::Cancelled->value]);

        return new OperationalRequestResource($operationalRequest);
    }

    public function auditLogs(Request $request, OperationalRequest $operationalRequest): AnonymousResourceCollection
    {
        abort_unless(app(AuditLogPolicy::class)->viewForRequest($request->user(), $operationalRequest), 403);

        return AuditLogResource::collection(
            AuditLog::with('user')
                ->where('auditable_type', OperationalRequest::class)
                ->where('auditable_id', $operationalRequest->id)
                ->latest()
                ->paginate(20)
        );
    }

    public function export(Request $request): StreamedResponse
    {
        Gate::authorize('export-requests');

        $filename = 'opsboard-requests-'.now()->format('Ymd-His').'.csv';

        return response()->streamDownload(function () use ($request): void {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['ID', 'Título', 'Status', 'Prioridade', 'Categoria', 'Solicitante', 'Responsável', 'Prazo', 'Criada em', 'Resolvida em', 'Cancelada em']);

            $this->queryFromFilters($request)
                ->chunk(100, function ($requests) use ($handle): void {
                    foreach ($requests as $operationalRequest) {
                        fputcsv($handle, [
                            $operationalRequest->id,
                            $operationalRequest->title,
                            $operationalRequest->status,
                            $operationalRequest->priority,
                            $operationalRequest->category?->name,
                            $operationalRequest->requester?->name,
                            $operationalRequest->assignee?->name,
                            $operationalRequest->due_date?->toDateTimeString(),
                            $operationalRequest->created_at?->toDateTimeString(),
                            $operationalRequest->resolved_at?->toDateTimeString(),
                            $operationalRequest->cancelled_at?->toDateTimeString(),
                        ]);
                    }
                });

            fclose($handle);
        }, $filename, ['Content-Type' => 'text/csv; charset=UTF-8']);
    }

    private function queryFromFilters(Request $request): Builder
    {
        $sort = in_array($request->query('sort'), ['created_at', 'due_date', 'priority', 'status', 'title'], true)
            ? $request->query('sort')
            : 'created_at';
        $direction = $request->query('direction') === 'asc' ? 'asc' : 'desc';

        return OperationalRequest::with(['category', 'requester', 'assignee'])
            ->when($request->query('search'), function (Builder $query, string $search): void {
                $query->where(function (Builder $nested) use ($search): void {
                    $nested->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhereHas('category', fn (Builder $category): Builder => $category->where('name', 'like', "%{$search}%"));
                });
            })
            ->when($request->query('status'), fn (Builder $query, string $status): Builder => $query->where('status', $status))
            ->when($request->query('priority'), fn (Builder $query, string $priority): Builder => $query->where('priority', $priority))
            ->when($request->query('category_id'), fn (Builder $query, string $categoryId): Builder => $query->where('category_id', $categoryId))
            ->when($request->query('assignee_id'), fn (Builder $query, string $assigneeId): Builder => $query->where('assignee_id', $assigneeId))
            ->when($request->query('requester_id'), fn (Builder $query, string $requesterId): Builder => $query->where('requester_id', $requesterId))
            ->when($request->query('date_from'), fn (Builder $query, string $date): Builder => $query->whereDate('created_at', '>=', $date))
            ->when($request->query('date_to'), fn (Builder $query, string $date): Builder => $query->whereDate('created_at', '<=', $date))
            ->orderBy($sort, $direction);
    }
}
