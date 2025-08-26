<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\ItemController;
use App\Http\Controllers\API\ItemMovementController;
use App\Http\Controllers\API\LocationController;
use App\Http\Controllers\API\SupplierController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Auth routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // User routes
    Route::prefix('auth')->group(function () {
        Route::get('/user', [AuthController::class, 'user']);
        Route::get('/me', [AuthController::class, 'user']); // Alias untuk /user
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
    });
    
    // Routes accessible by both admin and staff
    Route::middleware('admin.staff')->group(function () {
        // Category routes
        Route::apiResource('categories', CategoryController::class);
        
        // Location routes
        Route::apiResource('locations', LocationController::class);
        
        // Supplier routes
        Route::apiResource('suppliers', SupplierController::class);
        
        // Item routes
        Route::apiResource('items', ItemController::class);
        Route::get('/items/location/{location}', [ItemController::class, 'getItemsByLocation']);
        Route::post('/items/qrcode', [ItemController::class, 'getByQrCode']);
        
        // Item Movement routes
        Route::get('/movements', [ItemMovementController::class, 'index']);
        Route::get('/movements/{movement}', [ItemMovementController::class, 'show']);
        Route::get('/items/{item}/movements', [ItemMovementController::class, 'getItemMovements']);
    });
    
    // Routes accessible only by admin
    Route::middleware('role:admin')->group(function () {
        // Additional admin-only routes can be added here
        Route::post('/movements', [ItemMovementController::class, 'store']);
    });
});