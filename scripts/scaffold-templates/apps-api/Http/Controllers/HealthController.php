<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class HealthController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'status' => 'ok',
            'version' => '1.0.0',
        ])->header('Access-Control-Allow-Origin', 'http://localhost:3000');
    }
}
