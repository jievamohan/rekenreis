<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\UserProgress;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProgressTest extends TestCase
{
    use RefreshDatabase;

    public function test_progress_index_returns_empty_when_no_progress(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson('/api/progress');

        $response->assertStatus(200)
            ->assertJson(['progress' => []]);
    }

    public function test_progress_index_returns_existing_progress(): void
    {
        $user = User::factory()->create();
        UserProgress::create([
            'user_id' => $user->id,
            'progress' => ['level' => 5, 'stars' => 10],
        ]);

        $response = $this->actingAs($user)->getJson('/api/progress');

        $response->assertStatus(200)
            ->assertJson([
                'progress' => [
                    'level' => 5,
                    'stars' => 10,
                ],
            ]);
    }

    public function test_progress_update_stores_and_returns_progress(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->putJson('/api/progress', [
            'progress' => ['level' => 3, 'mode' => 'classic'],
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'progress' => [
                    'level' => 3,
                    'mode' => 'classic',
                ],
            ]);

        $this->assertDatabaseHas('user_progress', [
            'user_id' => $user->id,
        ]);
    }

    public function test_progress_update_requires_authentication(): void
    {
        $response = $this->putJson('/api/progress', [
            'progress' => ['level' => 1],
        ]);

        $response->assertStatus(401);
    }

    public function test_progress_update_validates_progress_is_array(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->putJson('/api/progress', [
            'progress' => 'invalid',
        ]);

        $response->assertStatus(422)
            ->assertJsonStructure(['message', 'errors']);
    }
}
