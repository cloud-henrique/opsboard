<?php

namespace Tests\Feature;

use App\Enums\RequestPriority;
use App\Enums\RequestStatus;
use App\Enums\UserRole;
use App\Models\AuditLog;
use App\Models\Category;
use App\Models\OperationalRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OperationalRequestApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_list_requests(): void
    {
        $user = $this->user(UserRole::Viewer);
        $this->request(['requester_id' => $user->id]);

        $this->actingAs($user)
            ->getJson('/api/requests')
            ->assertOk()
            ->assertJsonStructure(['data', 'links', 'meta']);
    }

    public function test_operator_can_create_request(): void
    {
        $user = $this->user(UserRole::Operator);
        $category = Category::create(['name' => 'Financeiro', 'active' => true]);

        $this->actingAs($user)
            ->postJson('/api/requests', [
                'title' => 'Nova solicitação',
                'description' => 'Descrição da solicitação operacional.',
                'category_id' => $category->id,
                'priority' => RequestPriority::High->value,
            ])
            ->assertCreated()
            ->assertJsonPath('data.title', 'Nova solicitação');

        $this->assertDatabaseHas('audit_logs', ['action' => 'request_created']);
    }

    public function test_invalid_request_payload_returns_validation_errors(): void
    {
        $user = $this->user(UserRole::Operator);

        $this->actingAs($user)
            ->postJson('/api/requests', [
                'title' => '',
                'description' => '',
                'category_id' => 999,
                'priority' => 'urgent',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['title', 'description', 'category_id', 'priority']);
    }

    public function test_manager_can_assign_responsible_user(): void
    {
        $manager = $this->user(UserRole::Manager);
        $operator = $this->user(UserRole::Operator);
        $operationalRequest = $this->request(['requester_id' => $manager->id]);

        $this->actingAs($manager)
            ->patchJson("/api/requests/{$operationalRequest->id}/assign", [
                'assignee_id' => $operator->id,
            ])
            ->assertOk()
            ->assertJsonPath('data.assignee_id', $operator->id);
    }

    public function test_operator_cannot_assign_responsible_user(): void
    {
        $operator = $this->user(UserRole::Operator);
        $operationalRequest = $this->request(['requester_id' => $operator->id]);

        $this->actingAs($operator)
            ->patchJson("/api/requests/{$operationalRequest->id}/assign", [
                'assignee_id' => $operator->id,
            ])
            ->assertForbidden();
    }

    public function test_operator_can_change_status_of_assigned_request(): void
    {
        $operator = $this->user(UserRole::Operator);
        $operationalRequest = $this->request([
            'requester_id' => $operator->id,
            'assignee_id' => $operator->id,
        ]);

        $this->actingAs($operator)
            ->patchJson("/api/requests/{$operationalRequest->id}/status", [
                'status' => RequestStatus::InProgress->value,
            ])
            ->assertOk()
            ->assertJsonPath('data.status', RequestStatus::InProgress->value);
    }

    public function test_viewer_cannot_create_request(): void
    {
        $viewer = $this->user(UserRole::Viewer);
        $category = Category::create(['name' => 'Financeiro', 'active' => true]);

        $this->actingAs($viewer)
            ->postJson('/api/requests', [
                'title' => 'Nova solicitação',
                'description' => 'Descrição da solicitação operacional.',
                'category_id' => $category->id,
                'priority' => RequestPriority::High->value,
            ])
            ->assertForbidden();
    }

    public function test_audit_log_is_registered_when_status_changes(): void
    {
        $manager = $this->user(UserRole::Manager);
        $operationalRequest = $this->request(['requester_id' => $manager->id]);

        $this->actingAs($manager)
            ->patchJson("/api/requests/{$operationalRequest->id}/status", [
                'status' => RequestStatus::Resolved->value,
            ])
            ->assertOk();

        $this->assertDatabaseHas('audit_logs', [
            'auditable_type' => OperationalRequest::class,
            'auditable_id' => $operationalRequest->id,
            'action' => 'status_changed',
        ]);
        $this->assertDatabaseHas('audit_logs', ['action' => 'request_resolved']);
    }

    public function test_dashboard_returns_expected_structure(): void
    {
        $user = $this->user(UserRole::Admin);
        $this->request(['requester_id' => $user->id]);

        $this->actingAs($user)
            ->getJson('/api/dashboard')
            ->assertOk()
            ->assertJsonStructure([
                'total_requests',
                'open_requests',
                'in_progress_requests',
                'overdue_requests',
                'resolved_this_month',
                'average_resolution_hours',
                'by_status',
                'by_priority',
            ]);
    }

    public function test_request_filters_work(): void
    {
        $user = $this->user(UserRole::Admin);
        $this->request(['requester_id' => $user->id, 'priority' => RequestPriority::Critical->value, 'title' => 'Incidente critico']);
        $this->request(['requester_id' => $user->id, 'priority' => RequestPriority::Low->value, 'title' => 'Baixa prioridade']);

        $this->actingAs($user)
            ->getJson('/api/requests?priority=critical&search=Incidente')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.priority', RequestPriority::Critical->value);
    }

    private function user(UserRole $role): User
    {
        return User::factory()->create([
            'role' => $role->value,
            'active' => true,
        ]);
    }

    /**
     * @param  array<string, mixed>  $overrides
     */
    private function request(array $overrides = []): OperationalRequest
    {
        $requester = $overrides['requester_id'] ?? $this->user(UserRole::Operator)->id;
        $category = Category::first() ?? Category::create(['name' => 'Financeiro', 'active' => true]);

        return OperationalRequest::create([
            'title' => 'Solicitação operacional',
            'description' => 'Descrição de apoio para o teste.',
            'category_id' => $category->id,
            'status' => RequestStatus::Open->value,
            'priority' => RequestPriority::Medium->value,
            'requester_id' => $requester,
            'assignee_id' => null,
            ...$overrides,
        ]);
    }
}
