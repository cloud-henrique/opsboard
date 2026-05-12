<?php

use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CategoryImportController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OperationalRequestController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => response()->json([
    'status' => 'ok',
    'app' => 'OpsBoard',
]));

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/protected-health', fn (Request $request) => response()->json([
        'status' => 'ok',
        'app' => 'OpsBoard',
        'user_id' => $request->user()->id,
    ]));

    Route::get('/dashboard', DashboardController::class);

    Route::get('/requests/export', [OperationalRequestController::class, 'export']);
    Route::get('/requests/{operationalRequest}/audit-logs', [OperationalRequestController::class, 'auditLogs']);
    Route::patch('/requests/{operationalRequest}/status', [OperationalRequestController::class, 'updateStatus']);
    Route::patch('/requests/{operationalRequest}/assign', [OperationalRequestController::class, 'assign']);
    Route::post('/requests/{operationalRequest}/resolve', [OperationalRequestController::class, 'resolve']);
    Route::post('/requests/{operationalRequest}/cancel', [OperationalRequestController::class, 'cancel']);
    Route::apiResource('requests', OperationalRequestController::class)
        ->parameters(['requests' => 'operationalRequest'])
        ->except(['destroy']);

    Route::post('/categories/import', CategoryImportController::class);
    Route::apiResource('categories', CategoryController::class)->except(['show', 'destroy']);

    Route::apiResource('users', UserController::class)->except(['show', 'destroy']);

    Route::get('/audit-logs', [AuditLogController::class, 'index']);
});
