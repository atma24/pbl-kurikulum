<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CplController;
use App\Http\Controllers\PpmController;
use App\Http\Controllers\IeaController;
use App\Http\Controllers\MatrixController;
use App\Http\Controllers\IndikatorKinerjaController;
use App\Http\Controllers\MataKuliahController;




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
    // Rute Indikator Kinerja
    Route::resource('indikator-kinerja', IndikatorKinerjaController::class)->except(['create', 'show', 'edit']);
// Grouping Matrix
    Route::get('/matrix', [MatrixController::class, 'index'])->name('matrix.index');
    Route::post('/matrix/sync-cpl-iea', [MatrixController::class, 'syncCplIea']);
    Route::post('/matrix/sync-ppm-iea', [MatrixController::class, 'syncPpmIea']);

    // CPL Routes
    Route::get('/cpl', [CplController::class, 'index'])->name('cpl.index');
    Route::post('/cpl', [CplController::class, 'store'])->name('cpl.store');
    Route::patch('/cpl/{cpl}', [CplController::class, 'update'])->name('cpl.update');
    Route::delete('/cpl/{cpl}', [CplController::class, 'destroy'])->name('cpl.destroy');

    // PPM Routes
    Route::get('/ppm', [PpmController::class, 'index'])->name('ppm.index');
    Route::post('/ppm', [PpmController::class, 'store'])->name('ppm.store');
    Route::patch('/ppm/{ppm}', [PpmController::class, 'update'])->name('ppm.update');
    Route::delete('/ppm/{ppm}', [PpmController::class, 'destroy'])->name('ppm.destroy');

    // IEA Routes
    Route::get('/iea', [IeaController::class, 'index'])->name('iea.index');
    Route::post('/iea', [IeaController::class, 'store'])->name('iea.store');
    Route::patch('/iea/{iea}', [IeaController::class, 'update'])->name('iea.update');
    Route::delete('/iea/{iea}', [IeaController::class, 'destroy'])->name('iea.destroy');

    Route::resource('mata-kuliah', MataKuliahController::class)->except(['create', 'show', 'edit']);
});

require __DIR__.'/auth.php';