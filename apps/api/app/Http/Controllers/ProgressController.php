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

        /** @var array<string, mixed> $incoming */
        $incoming = $request->progress;

        $existing = UserProgress::query()->where('user_id', $user->id)->first();
        if ($existing !== null) {
            /** @var mixed $existingRaw */
            $existingRaw = $existing->getAttribute('progress');
            if (is_array($existingRaw)) {
                /** @var array<string, mixed> $existingRaw */
                $incoming = $this->mergeProgressMax($existingRaw, $incoming);
            }
        }

        $progress = UserProgress::updateOrCreate(
            ['user_id' => $user->id],
            ['progress' => $incoming]
        );

        return response()->json([
            'progress' => $progress->progress,
        ]);
    }

    /**
     * Never lower per-level stars or currentLevel when replacing the progress blob.
     *
     * @param  array<string, mixed>  $existing
     * @param  array<string, mixed>  $incoming
     * @return array<string, mixed>
     */
    private function mergeProgressMax(array $existing, array $incoming): array
    {
        if (! isset($incoming['profiles']) || ! is_array($incoming['profiles'])) {
            return $incoming;
        }

        /** @var array<string, array<string, mixed>> $existingById */
        $existingById = [];
        if (isset($existing['profiles']) && is_array($existing['profiles'])) {
            foreach ($existing['profiles'] as $profile) {
                if (is_array($profile) && isset($profile['id']) && is_string($profile['id'])) {
                    $existingById[$profile['id']] = $profile;
                }
            }
        }

        foreach ($incoming['profiles'] as $i => $profile) {
            if (! is_array($profile) || ! isset($profile['id']) || ! is_string($profile['id'])) {
                continue;
            }
            if (! isset($existingById[$profile['id']])) {
                continue;
            }
            $prev = $existingById[$profile['id']];

            $prevProgress = isset($prev['progress']) && is_array($prev['progress']) ? $prev['progress'] : [];
            $nextProgress = isset($profile['progress']) && is_array($profile['progress']) ? $profile['progress'] : [];

            $prevLevel = isset($prevProgress['currentLevel']) && is_numeric($prevProgress['currentLevel'])
                ? (int) $prevProgress['currentLevel']
                : 1;
            $nextLevel = isset($nextProgress['currentLevel']) && is_numeric($nextProgress['currentLevel'])
                ? (int) $nextProgress['currentLevel']
                : 1;
            $nextProgress['currentLevel'] = max($prevLevel, $nextLevel);

            $prevStars = isset($prevProgress['levelProgress']) && is_array($prevProgress['levelProgress'])
                ? $prevProgress['levelProgress']
                : [];
            $nextStars = isset($nextProgress['levelProgress']) && is_array($nextProgress['levelProgress'])
                ? $nextProgress['levelProgress']
                : [];

            foreach ($prevStars as $levelKey => $entry) {
                $prevStar = is_array($entry) && isset($entry['stars']) && is_numeric($entry['stars'])
                    ? (int) $entry['stars']
                    : 0;
                $incomingEntry = $nextStars[$levelKey] ?? null;
                $nextStar = is_array($incomingEntry) && isset($incomingEntry['stars']) && is_numeric($incomingEntry['stars'])
                    ? (int) $incomingEntry['stars']
                    : 0;
                $nextStars[$levelKey] = ['stars' => max($prevStar, $nextStar)];
            }
            $nextProgress['levelProgress'] = $nextStars;

            $incoming['profiles'][$i]['progress'] = $nextProgress;
        }

        return $incoming;
    }
}
