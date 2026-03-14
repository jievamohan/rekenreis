<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * Debug endpoint for auth flow diagnosis in CI. Only active when XSRF_DEBUG_LOG or APP_DEBUG.
 * Returns granular state at each step to trace cookie/session flow.
 */
class DebugAuthController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        if (! config('app.debug') && ! config('app.xsrf_debug_log')) {
            return response()->json(['error' => 'Debug disabled'], 403);
        }

        $cookieHeader = $request->header('Cookie', '');
        $cookieNames = [];
        if ($cookieHeader) {
            foreach (explode(';', $cookieHeader) as $pair) {
                $parts = explode('=', trim($pair), 2);
                $name = trim($parts[0]);
                if ($name !== '') {
                    $cookieNames[] = $name;
                }
            }
        }

        $hasSession = $request->hasSession();
        $sessionId = $hasSession ? $request->session()->getId() : null;
        $user = $request->user();

        return response()->json([
            'step' => 'debug-auth',
            'host' => $request->getHost(),
            'path' => $request->path(),
            'cookies_received' => [
                'count' => count($cookieNames),
                'names' => $cookieNames,
                'has_xsrf' => in_array('XSRF-TOKEN', $cookieNames) || str_contains($cookieHeader, 'XSRF-TOKEN'),
                'has_laravel_session' => str_contains($cookieHeader, 'laravel_session') || str_contains($cookieHeader, 'rekenreis_session'),
            ],
            'session' => [
                'has_session' => $hasSession,
                'session_id' => $sessionId ? substr($sessionId, 0, 8) . '...' : null,
                'session_domain' => config('session.domain'),
                'session_driver' => config('session.driver'),
            ],
            'auth' => [
                'user_id' => $user?->id,
                'user_email' => $user?->email,
                'authenticated' => (bool) $user,
            ],
            'config' => [
                'app_url' => config('app.url'),
                'sanctum_stateful' => config('sanctum.stateful'),
            ],
        ]);
    }
}
