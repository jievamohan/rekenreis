<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    private static function authLog(string $msg, array $data = []): void
    {
        if (! config('app.debug') && ! config('app.xsrf_debug_log')) {
            return;
        }
        error_log('[auth-debug] ' . $msg . ' ' . json_encode($data));
    }
    public function login(Request $request): JsonResponse
    {
        self::authLog('login REQUEST', [
            'hasSession' => $request->hasSession(),
            'email' => $request->input('email'),
        ]);
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        if ($request->hasSession()) {
            if (! Auth::attempt($request->only('email', 'password'))) {
                self::authLog('login FAIL', ['reason' => 'invalid credentials']);
                return response()->json(['message' => 'Invalid credentials'], 401);
            }
            $request->session()->regenerate();
            $user = $request->user();
            self::authLog('login OK', ['userId' => $user->id]);
        } else {
            $user = User::where('email', $request->email)->first();
            if (! $user || ! Hash::check($request->password, $user->password)) {
                self::authLog('login FAIL', ['reason' => 'invalid credentials (no session)']);
                return response()->json(['message' => 'Invalid credentials'], 401);
            }
            self::authLog('login OK (no session)', ['userId' => $user->id]);
        }

        return response()->json([
            'user' => $user->only(['id', 'name', 'email']),
        ]);
    }

    public function register(Request $request): JsonResponse
    {
        self::authLog('register REQUEST', [
            'hasSession' => $request->hasSession(),
            'sessionId' => $request->hasSession() ? substr($request->session()->getId(), 0, 8) . '...' : null,
            'cookieCount' => $request->header('Cookie') ? substr_count($request->header('Cookie'), '=') : 0,
        ]);

        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $didLogin = false;
        if ($request->hasSession()) {
            Auth::login($user);
            $request->session()->regenerate();
            $didLogin = true;
        }

        self::authLog('register RESPONSE', [
            'userId' => $user->id,
            'didLogin' => $didLogin,
            'hasSession' => $request->hasSession(),
        ]);

        return response()->json([
            'user' => $user->only(['id', 'name', 'email']),
        ], 201);
    }

    public function logout(Request $request): JsonResponse
    {
        if ($request->hasSession()) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return response()->json(['message' => 'Logged out']);
    }

    public function user(Request $request): JsonResponse
    {
        $user = $request->user();
        self::authLog('user REQUEST', [
            'hasSession' => $request->hasSession(),
            'authenticated' => (bool) $user,
            'userId' => $user?->id,
        ]);
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        return response()->json([
            'user' => $user->only(['id', 'name', 'email']),
        ]);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email'],
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        $status = Password::sendResetLink($request->only('email'));

        if ($status !== Password::RESET_LINK_SENT) {
            return response()->json(['message' => 'Unable to send reset link'], 400);
        }

        return response()->json(['message' => 'Reset link sent']);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password): void {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            return response()->json(['message' => 'Unable to reset password'], 400);
        }

        return response()->json(['message' => 'Password reset']);
    }
}
