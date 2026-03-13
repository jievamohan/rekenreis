<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Debug logging for XSRF/CSRF token flow. Logs only when APP_DEBUG or XSRF_DEBUG_LOG.
 * Writes to stderr so logs appear in docker compose logs.
 */
class XsrfDebugLog
{
    private static function log(string $msg, array $data = []): void
    {
        if (! config('app.debug') && ! env('XSRF_DEBUG_LOG')) {
            return;
        }
        $line = '[xsrf-debug] ' . $msg . ' ' . json_encode($data);
        error_log($line);
    }

    public function handle(Request $request, Closure $next): Response
    {
        $path = $request->path();

        // 1. Request: sanctum/csrf-cookie (client fetches token)
        if (str_contains($path, 'sanctum/csrf-cookie')) {
            $cookieHeader = $request->header('Cookie', '');
            $cookieNames = [];
            if ($cookieHeader) {
                foreach (explode(';', $cookieHeader) as $pair) {
                    $name = trim(explode('=', trim($pair), 2)[0] ?? '');
                    if ($name) {
                        $cookieNames[] = $name;
                    }
                }
            }
            self::log('sanctum/csrf-cookie REQUEST', [
                'path' => $path,
                'host' => $request->getHost(),
                'hasCookie' => ! empty($cookieHeader),
                'cookieNames' => $cookieNames,
            ]);
        }

        // 2. Request: api routes (client sends token)
        if (str_starts_with($path, 'api/')) {
            $xsrfHeader = $request->header('X-XSRF-TOKEN');
            $cookieHeader = $request->header('Cookie', '');
            $hasXsrfCookie = str_contains($cookieHeader, 'XSRF-TOKEN');
            $hasLaravelSession = str_contains($cookieHeader, 'laravel_session') || str_contains($cookieHeader, 'rekenreis_session');
            self::log('api REQUEST', [
                'path' => $path,
                'method' => $request->method(),
                'hasX-XSRF-TOKEN' => ! empty($xsrfHeader),
                'xsrfPrefix' => $xsrfHeader ? substr($xsrfHeader, 0, 12) . '...' : null,
                'hasXsrfCookie' => $hasXsrfCookie,
                'hasLaravelSession' => $hasLaravelSession,
                'cookieCount' => $cookieHeader ? substr_count($cookieHeader, '=') : 0,
            ]);
        }

        $response = $next($request);

        // 3. Response: sanctum/csrf-cookie (API sets XSRF-TOKEN cookie)
        if (str_contains($path, 'sanctum/csrf-cookie')) {
            $setCookies = $response->headers->get('Set-Cookie');
            $cookieNames = [];
            if ($setCookies) {
                foreach (is_array($setCookies) ? $setCookies : [$setCookies] as $c) {
                    $name = explode('=', explode(';', $c)[0])[0] ?? '';
                    $cookieNames[] = trim($name);
                }
            }
            self::log('sanctum/csrf-cookie RESPONSE', [
                'status' => $response->getStatusCode(),
                'setCookieNames' => $cookieNames,
                'hasXsrfInSetCookie' => $setCookies && str_contains((string) $setCookies, 'XSRF-TOKEN'),
            ]);
        }

        return $response;
    }
}
