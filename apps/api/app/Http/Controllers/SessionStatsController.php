<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SessionStatsController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $score = $request->input('score');
        $rounds = $request->input('rounds');

        $payload = array_filter([
            'score' => is_numeric($score) ? (int) $score : null,
            'rounds' => is_numeric($rounds) ? (int) $rounds : null,
        ], fn ($v) => $v !== null);

        if (! empty($payload)) {
            Log::channel('single')->info('session-stats', $payload);
        }

        return response()->json(['ok' => true], 201);
    }
}
