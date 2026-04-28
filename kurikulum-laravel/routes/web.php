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
use App\Http\Controllers\CpmkController;



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
    // --- GULUNGAN RUTE MATA KULIAH ---
Route::prefix('mata-kuliah')->group(function () {
        Route::get('/', [MataKuliahController::class, 'index'])->name('mata-kuliah.index');
        Route::post('/', [MataKuliahController::class, 'store'])->name('mata-kuliah.store');
        
        // MANTRA BARU: Ubah "put" menjadi "patch"
        Route::patch('/{mata_kuliah}', [MataKuliahController::class, 'update'])->name('mata-kuliah.update');
        
        Route::delete('/{mata_kuliah}', [MataKuliahController::class, 'destroy'])->name('mata-kuliah.destroy');
        Route::get('/{id}/rps-data', [MataKuliahController::class, 'apiGetRpsData'])->name('mata-kuliah.rps-data');
    });

    // --- GULUNGAN RUTE CPMK ---
    Route::prefix('cpmk')->group(function () {
        // Menampilkan CPMK berdasarkan ID Mata Kuliah
        Route::get('/mk/{mata_kuliah_id}', [CpmkController::class, 'index'])->name('cpmk.index');
        Route::post('/', [CpmkController::class, 'store'])->name('cpmk.store');
        Route::delete('/{cpmk}', [CpmkController::class, 'destroy'])->name('cpmk.destroy');
    });

    // --- GULUNGAN RUTE MATRIX (PUSAKA UTAMA KURIKULUM) ---
    Route::prefix('matrix')->group(function () {
        Route::get('/', [MatrixController::class, 'index'])->name('matrix.index');
        
        // MANTRA SINKRONISASI PIVOT
        Route::post('/sync-cpl-iea', [MatrixController::class, 'syncCplIea'])->name('matrix.sync-cpl-iea');
        Route::post('/sync-ppm-iea', [MatrixController::class, 'syncPpmIea'])->name('matrix.sync-ppm-iea');
        Route::post('/sync-mk-cpl', [MatrixController::class, 'syncMkCpl'])->name('matrix.sync-mk-cpl');
    });
});

require __DIR__.'/auth.php';