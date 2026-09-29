<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CollectionController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
});

Route::get('/shop', [ShopController::class, 'index'])->name('shop');
Route::get('/shop/{product}', [ProductController::class, 'show'])->name('shop.product');

Route::get('/collections/{slug}', [CollectionController::class, 'show'])->name('collections.show');


// Cart
Route::get('/cart', [CartController::class, 'index'])->name('cart');
Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
Route::patch('/cart/{cartLine}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{cartLine}', [CartController::class, 'destroy'])->name('cart.destroy');
Route::delete('/cart', [CartController::class, 'clear'])->name('cart.clear');

// Checkout
Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout');
Route::post('/checkout/address', [CheckoutController::class, 'address'])->name('checkout.address');
Route::post('/checkout/shipping', [CheckoutController::class, 'shipping'])->name('checkout.shipping');
Route::post('/checkout/order', [OrderController::class, 'createOrder'])->name('checkout.order.create');
Route::post('/checkout/paypal/capture', [CheckoutController::class, 'capturePaypal'])->name('checkout.paypal.capture');
Route::get('/checkout/success/{fingerprint?}', [CheckoutController::class, 'success'])->name('checkout.success');




require __DIR__.'/auth.php';
