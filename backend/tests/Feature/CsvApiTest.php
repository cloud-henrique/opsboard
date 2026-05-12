<?php

namespace Tests\Feature;

use App\Enums\RequestPriority;
use App\Enums\RequestStatus;
use App\Enums\UserRole;
use App\Models\Category;
use App\Models\OperationalRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class CsvApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_authorized_user_can_export_requests_csv(): void
    {
        $operator = $this->user(UserRole::Operator);
        $category = Category::create(['name' => 'Financeiro', 'active' => true]);
        OperationalRequest::create([
            'title' => 'Exportar esta solicitação',
            'description' => 'Descrição',
            'category_id' => $category->id,
            'status' => RequestStatus::Open->value,
            'priority' => RequestPriority::Medium->value,
            'requester_id' => $operator->id,
        ]);

        $this->actingAs($operator)
            ->get('/api/requests/export')
            ->assertOk()
            ->assertHeader('content-type', 'text/csv; charset=UTF-8');
    }

    public function test_viewer_cannot_export_requests_csv(): void
    {
        $viewer = $this->user(UserRole::Viewer);

        $this->actingAs($viewer)
            ->getJson('/api/requests/export')
            ->assertForbidden();
    }

    public function test_import_csv_creates_categories(): void
    {
        $manager = $this->user(UserRole::Manager);
        $file = UploadedFile::fake()->createWithContent('categories.csv', "name,description,active\nFinanceiro,Solicitações financeiras,1\nRH,Recursos humanos,true\n");

        $this->actingAs($manager)
            ->postJson('/api/categories/import', ['file' => $file])
            ->assertOk()
            ->assertJsonPath('created', 2)
            ->assertJsonPath('failed', 0);

        $this->assertDatabaseHas('categories', ['name' => 'Financeiro']);
        $this->assertDatabaseHas('categories', ['name' => 'RH']);
    }

    public function test_import_csv_updates_categories_by_name(): void
    {
        $manager = $this->user(UserRole::Manager);
        Category::create(['name' => 'Financeiro', 'description' => 'Antiga', 'active' => true]);
        $file = UploadedFile::fake()->createWithContent('categories.csv', "name,description,active\nFinanceiro,Nova descrição,0\n");

        $this->actingAs($manager)
            ->postJson('/api/categories/import', ['file' => $file])
            ->assertOk()
            ->assertJsonPath('updated', 1);

        $this->assertDatabaseHas('categories', [
            'name' => 'Financeiro',
            'description' => 'Nova descrição',
            'active' => false,
        ]);
    }

    public function test_operator_cannot_import_categories_csv(): void
    {
        $operator = $this->user(UserRole::Operator);
        $file = UploadedFile::fake()->createWithContent('categories.csv', "name,description,active\nFinanceiro,Solicitações financeiras,1\n");

        $this->actingAs($operator)
            ->postJson('/api/categories/import', ['file' => $file])
            ->assertForbidden();
    }

    private function user(UserRole $role): User
    {
        return User::factory()->create([
            'role' => $role->value,
            'active' => true,
        ]);
    }
}
