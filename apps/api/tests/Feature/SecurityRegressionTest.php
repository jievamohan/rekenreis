<?php

namespace Tests\Feature;

use Tests\TestCase;

class SecurityRegressionTest extends TestCase
{
    public function test_health_endpoint_returns_200_without_auth(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertStatus(200)
            ->assertJsonStructure(['status']);
    }

    public function test_session_stats_accepts_json_and_returns_201(): void
    {
        $response = $this->postJson('/api/session-stats', ['score' => 1]);

        $response->assertStatus(201)
            ->assertJson(['ok' => true]);
    }

    public function test_api_defaults_to_no_auth_required(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertStatus(200);
    }
}
