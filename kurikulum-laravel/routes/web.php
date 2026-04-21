<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\MatrixController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// --- ZONA AMAN (HANYA BISA DIAKSES JIKA SUDAH LOGIN) ---
Route::middleware('auth')->group(function () {
    // 1. Rute Profile (Bawaan Breeze)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // 2. Rute Matrix Kurikulum
    Route::get('/matrix', [MatrixController::class, 'index'])->name('matrix.index');
    
    // Rute Bulk Save (Endpoint baru untuk menyimpan banyak checkbox sekaligus)
    Route::post('/matrix/bulk-sync', [MatrixController::class, 'syncCplBulk'])->name('matrix.sync.bulk');
});

require __DIR__.'/auth.php';