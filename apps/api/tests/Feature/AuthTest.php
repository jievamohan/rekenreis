<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_creates_user_and_returns_user_data(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Test Kind',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'user' => [
                    'name' => 'Test Kind',
                    'email' => 'test@example.com',
                ],
            ])
            ->assertJsonStructure(['user' => ['id', 'name', 'email']]);

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
            'name' => 'Test Kind',
        ]);
    }

    public function test_register_validation_fails_with_invalid_data(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => '',
            'email' => 'invalid',
            'password' => 'short',
        ]);

        $response->assertStatus(422)
            ->assertJsonStructure(['message', 'errors']);
    }

    public function test_login_returns_user_on_valid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'login@example.com',
            'password' => 'password123',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'login@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'user' => [
                    'email' => 'login@example.com',
                ],
            ]);
    }

    public function test_login_returns_401_on_invalid_credentials(): void
    {
        $response = $this->postJson('/api/login', [
            'email' => 'login@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
            ->assertJson(['message' => 'Invalid credentials']);
    }

    public function test_user_endpoint_returns_authenticated_user(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson('/api/user');

        $response->assertStatus(200)
            ->assertJson([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
            ]);
    }

    public function test_user_endpoint_returns_401_when_unauthenticated(): void
    {
        $response = $this->getJson('/api/user');

        $response->assertStatus(401);
    }
}
