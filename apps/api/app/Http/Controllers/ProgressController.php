<?php

namespace App\Http\Controllers;

use App\Models\UserProgress;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProgressController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $progress = UserProgress::firstOrCreate(
            ['user_id' => $user->id],
            ['progress' => []]
        );

        return response()->json([
            'progress' => $progress->progress ?? [],
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $user = $request->user();
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $validator = Validator::make($request->all(), [
            'progress' => ['required', 'array'],
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        $progress = UserProgress::updateOrCreate(
            ['user_id' => $user->id],
            ['progress' => $request->progress]
        );

        return response()->json([
            'progress' => $progress->progress,
        ]);
    }
}
