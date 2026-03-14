<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DebugAuthController;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\ProgressController;
use App\Http\Controllers\SessionStatsController;
use Illuminate\Support\Facades\Route;

Route::get('/health', [HealthController::class, 'index']);
Route::get('/debug/auth-flow', DebugAuthController::class);
Route::post('/session-stats', [SessionStatsController::class, 'store']);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->group(function (): void {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/progress', [ProgressController::class, 'index']);
    Route::put('/progress', [ProgressController::class, 'update']);
});
