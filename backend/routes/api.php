<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ReturnController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\NewsletterController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe']);


// Password Reset Routes
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetCode']);
Route::post('/verify-reset-code', [PasswordResetController::class, 'verifyCode']);
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);

// Public product routes
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

// Public coupon validation
Route::post('/coupons/validate', [CouponController::class, 'validate_coupon']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {

    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Order routes
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);

    // Favorite routes
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites/toggle', [FavoriteController::class, 'toggle']);

    // Customer - submit review
    Route::post('/reviews', [ReviewController::class, 'store']);

    // Customer - submit return
    Route::post('/returns', [ReturnController::class, 'store']);

    // Admin only routes
    Route::middleware('admin')->group(function () {

        // Dashboard & customers
        Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/admin/customers', [AdminController::class, 'customers']);
        Route::get('/admin/orders', [AdminController::class, 'allOrders']);
        Route::put('/admin/customers/{id}', [AdminController::class, 'updateCustomer']);

        // Product management
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);
        Route::post('/products/bulk-delete', [ProductController::class, 'bulkDelete']);
        Route::put('/products/bulk-price', [ProductController::class, 'bulkPrice']);

        // Order management
        Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);

        // Coupons
        Route::get('/admin/coupons', [CouponController::class, 'index']);
        Route::post('/admin/coupons', [CouponController::class, 'store']);
        Route::put('/admin/coupons/{id}', [CouponController::class, 'update']);
        Route::put('/admin/coupons/{id}/toggle', [CouponController::class, 'toggle']);
        Route::delete('/admin/coupons/{id}', [CouponController::class, 'destroy']);

        // Reviews
        Route::get('/admin/reviews', [ReviewController::class, 'index']);
        Route::put('/admin/reviews/{id}/approve', [ReviewController::class, 'approve']);
        Route::put('/admin/reviews/{id}/reject', [ReviewController::class, 'reject']);
        Route::post('/admin/reviews/{id}/reply', [ReviewController::class, 'reply']);
        Route::delete('/admin/reviews/{id}', [ReviewController::class, 'destroy']);

        // Returns
        Route::get('/admin/returns', [ReturnController::class, 'index']);
        Route::put('/admin/returns/{id}', [ReturnController::class, 'update']);

        // Notifications
        Route::get('/admin/notifications', [NotificationController::class, 'index']);
        Route::put('/admin/notifications/read-all', [NotificationController::class, 'markAllRead']);

        // Global search
        Route::get('/admin/search', [SearchController::class, 'search']);
        
        // Admin - single order details
        Route::get('/admin/orders/{id}', [OrderController::class, 'show']);
        
    });
        
    });
    

