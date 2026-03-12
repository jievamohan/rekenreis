<?php

namespace App\Http\Controllers;

use App\Services\HealthService;

class HealthController extends Controller
{
    public function __construct(
        private readonly HealthService $healthService
    ) {
    }

    public function index(): \Illuminate\Http\JsonResponse
    {
        return response()
            ->json($this->healthService->check())
            ->header('Access-Control-Allow-Origin', 'http://localhost:3000');
    }
}
