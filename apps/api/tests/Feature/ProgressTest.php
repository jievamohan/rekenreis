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

    public function test_progress_update_does_not_lower_stars_or_current_level(): void
    {
        $user = User::factory()->create();
        $existing = [
            'version' => 1,
            'activeProfileId' => 'p1',
            'profiles' => [
                [
                    'id' => 'p1',
                    'name' => 'Kid',
                    'progress' => [
                        'bestScore' => 0,
                        'currentLevel' => 5,
                        'levelProgress' => [
                            '1' => ['stars' => 3],
                            '2' => ['stars' => 2],
                        ],
                    ],
                ],
            ],
        ];
        UserProgress::create([
            'user_id' => $user->id,
            'progress' => $existing,
        ]);

        $incoming = $existing;
        $incoming['profiles'][0]['progress']['currentLevel'] = 2;
        $incoming['profiles'][0]['progress']['levelProgress']['1'] = ['stars' => 1];
        $incoming['profiles'][0]['progress']['levelProgress']['2'] = ['stars' => 1];

        $response = $this->actingAs($user)->putJson('/api/progress', [
            'progress' => $incoming,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('progress.profiles.0.progress.currentLevel', 5)
            ->assertJsonPath('progress.profiles.0.progress.levelProgress.1.stars', 3)
            ->assertJsonPath('progress.profiles.0.progress.levelProgress.2.stars', 2);
    }
}
