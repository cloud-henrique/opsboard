<?php

namespace Database\Seeders;

use App\Enums\RequestPriority;
use App\Enums\RequestStatus;
use App\Enums\UserRole;
use App\Models\Category;
use App\Models\OperationalRequest;
use App\Models\User;
use App\Services\AuditLogger;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            'admin' => User::updateOrCreate(
                ['email' => 'admin@opsboard.test'],
                ['name' => 'Admin User', 'password' => 'password', 'role' => UserRole::Admin->value, 'active' => true],
            ),
            'manager' => User::updateOrCreate(
                ['email' => 'manager@opsboard.test'],
                ['name' => 'Manager User', 'password' => 'password', 'role' => UserRole::Manager->value, 'active' => true],
            ),
            'operator' => User::updateOrCreate(
                ['email' => 'operator@opsboard.test'],
                ['name' => 'Operator User', 'password' => 'password', 'role' => UserRole::Operator->value, 'active' => true],
            ),
            'viewer' => User::updateOrCreate(
                ['email' => 'viewer@opsboard.test'],
                ['name' => 'Viewer User', 'password' => 'password', 'role' => UserRole::Viewer->value, 'active' => true],
            ),
        ];

        $categories = collect([
            ['name' => 'Financeiro', 'description' => 'Solicitações financeiras e reembolsos'],
            ['name' => 'Recursos Humanos', 'description' => 'Demandas de pessoas e benefícios'],
            ['name' => 'Infraestrutura', 'description' => 'Solicitações de espaço, equipamentos e suporte interno'],
            ['name' => 'Compliance', 'description' => 'Revisões e demandas regulatórias internas'],
        ])->mapWithKeys(fn (array $category): array => [
            $category['name'] => Category::updateOrCreate(
                ['name' => $category['name']],
                ['description' => $category['description'], 'active' => true],
            ),
        ]);

        if (OperationalRequest::count() > 0) {
            return;
        }

        $requests = [
            [
                'title' => 'Revisar política de reembolso',
                'description' => 'Atualizar regras de reembolso para viagens nacionais.',
                'category_id' => $categories['Financeiro']->id,
                'status' => RequestStatus::InReview->value,
                'priority' => RequestPriority::High->value,
                'requester_id' => $users['manager']->id,
                'assignee_id' => $users['operator']->id,
                'due_date' => now()->addDays(4),
            ],
            [
                'title' => 'Liberar acesso ao novo painel interno',
                'description' => 'Provisionar acessos para o time de operações.',
                'category_id' => $categories['Infraestrutura']->id,
                'status' => RequestStatus::InProgress->value,
                'priority' => RequestPriority::Medium->value,
                'requester_id' => $users['admin']->id,
                'assignee_id' => $users['operator']->id,
                'due_date' => now()->addDays(2),
            ],
            [
                'title' => 'Validar documento de compliance trimestral',
                'description' => 'Conferir checklist e registrar pendências antes do fechamento.',
                'category_id' => $categories['Compliance']->id,
                'status' => RequestStatus::Open->value,
                'priority' => RequestPriority::Critical->value,
                'requester_id' => $users['viewer']->id,
                'assignee_id' => null,
                'due_date' => now()->subDay(),
            ],
            [
                'title' => 'Organizar onboarding de novos colaboradores',
                'description' => 'Preparar materiais e checklist de equipamentos.',
                'category_id' => $categories['Recursos Humanos']->id,
                'status' => RequestStatus::Resolved->value,
                'priority' => RequestPriority::Low->value,
                'requester_id' => $users['manager']->id,
                'assignee_id' => $users['operator']->id,
                'due_date' => now()->subDays(3),
                'resolved_at' => now()->subDay(),
            ],
        ];

        $auditLogger = app(AuditLogger::class);

        foreach ($requests as $payload) {
            $request = OperationalRequest::create($payload);
            $auditLogger->log(
                $users['admin'],
                $request,
                'request_created',
                null,
                $request->only(['title', 'status', 'priority', 'category_id', 'assignee_id', 'due_date']),
            );
        }
    }
}
