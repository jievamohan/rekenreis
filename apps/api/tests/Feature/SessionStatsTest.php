<?php

namespace Tests\Feature;

use Tests\TestCase;

class SessionStatsTest extends TestCase
{
    public function test_session_stats_accepts_post_with_json_body(): void
    {
        $response = $this->postJson('/api/session-stats', [
            'score' => 10,
            'rounds' => 5,
        ]);

        $response->assertStatus(201)
            ->assertJson(['ok' => true]);
    }

    public function test_session_stats_accepts_empty_body(): void
    {
        $response = $this->postJson('/api/session-stats', []);

        $response->assertStatus(201)
            ->assertJson(['ok' => true]);
    }

    public function test_session_stats_requires_no_auth(): void
    {
        $response = $this->postJson('/api/session-stats', ['score' => 1]);

        $response->assertStatus(201);
    }
}
