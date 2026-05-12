<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login_with_valid_credentials(): void
    {
        User::factory()->create([
            'email' => 'admin@opsboard.test',
            'password' => 'password',
            'role' => UserRole::Admin->value,
            'active' => true,
        ]);

        $response = $this->postJson('/login', [
            'email' => 'admin@opsboard.test',
            'password' => 'password',
        ]);

        $response->assertOk()
            ->assertJsonPath('user.email', 'admin@opsboard.test')
            ->assertJsonPath('user.role', UserRole::Admin->value);
    }

    public function test_login_fails_with_invalid_password(): void
    {
        User::factory()->create([
            'email' => 'admin@opsboard.test',
            'password' => 'password',
            'role' => UserRole::Admin->value,
            'active' => true,
        ]);

        $this->postJson('/login', [
            'email' => 'admin@opsboard.test',
            'password' => 'wrong-password',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('email');
    }

    public function test_authenticated_user_can_access_me_endpoint(): void
    {
        $user = User::factory()->create(['role' => UserRole::Manager->value, 'active' => true]);

        $this->actingAs($user)
            ->getJson('/api/me')
            ->assertOk()
            ->assertJsonPath('data.id', $user->id);
    }

    public function test_guest_receives_unauthenticated_on_protected_route(): void
    {
        $this->getJson('/api/protected-health')->assertUnauthorized();
    }

    public function test_logout_invalidates_session(): void
    {
        User::factory()->create([
            'email' => 'admin@opsboard.test',
            'password' => 'password',
            'role' => UserRole::Admin->value,
            'active' => true,
        ]);

        $this->postJson('/login', [
            'email' => 'admin@opsboard.test',
            'password' => 'password',
        ])->assertOk();

        $this->postJson('/logout')->assertOk();

        $this->assertGuest();
    }
}
