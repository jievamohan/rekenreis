<?php

use App\Http\Controllers\HealthController;
use App\Http\Controllers\SessionStatsController;
use Illuminate\Support\Facades\Route;

Route::get('/health', [HealthController::class, 'index']);
Route::post('/session-stats', [SessionStatsController::class, 'store']);
