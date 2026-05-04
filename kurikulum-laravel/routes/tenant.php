<?php

declare(strict_types=1);

use App\Http\Controllers\CplController;
use App\Http\Controllers\CpmkController;
use App\Http\Controllers\IeaController;
use App\Http\Controllers\IndikatorKinerjaController;
use App\Http\Controllers\MataKuliahController;
use App\Http\Controllers\MatrixController;
use App\Http\Controllers\PpmController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;

Route::middleware([
    'web',
    InitializeTenancyByDomain::class,
    PreventAccessFromCentralDomains::class,
])->group(function () {

    // --- ZONA AMAN (LOGIN REQUIRED) ---
    Route::middleware(['auth', 'verified'])->group(function () {
        
        Route::get('/dashboard', function () {
            return Inertia::render('Dashboard');
        })->name('dashboard');

        // Rute Profil (Bisa diakses semua kasta yang login)
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

        // ==========================================
        // KEKUASAAN KAPRODI (FULL FEATURES)
        // ==========================================
        Route::middleware(['role:Kaprodi'])->group(function () {
            // Master Data Management
            Route::apiResource('cpl', CplController::class)->only(['index', 'store', 'destroy']);
            Route::apiResource('ppm', PpmController::class)->only(['index', 'store', 'destroy']);
            Route::apiResource('iea', IeaController::class)->only(['index', 'store', 'destroy']);
            Route::apiResource('indikator-kinerja', IndikatorKinerjaController::class)->only(['index', 'store', 'destroy']);
            
            // Matrix Syncing
            Route::prefix('matrix')->group(function () {
                Route::get('/', [MatrixController::class, 'index'])->name('matrix.index');
                Route::post('/sync-cpl-iea', [MatrixController::class, 'syncCplIea'])->name('matrix.sync-cpl-iea');
                Route::post('/sync-cpl-ppm', [MatrixController::class, 'syncCplPpm'])->name('matrix.sync-cpl-ppm');
                Route::post('/sync-ppm-iea', [MatrixController::class, 'syncPpmIea'])->name('matrix.sync-ppm-iea');
            });

            // Management Mata Kuliah (Create/Update/Delete)
            Route::post('/mata-kuliah', [MataKuliahController::class, 'store'])->name('mata-kuliah.store');
            Route::put('/mata-kuliah/{mata_kuliah}', [MataKuliahController::class, 'update'])->name('mata-kuliah.update');
            Route::delete('/mata-kuliah/{mata_kuliah}', [MataKuliahController::class, 'destroy'])->name('mata-kuliah.destroy');
        });

        // ==========================================
        // KEKUASAAN BERSAMA (DOSEN & KAPRODI)
        // ==========================================
        
        // Mata Kuliah Index (Dosen perlu melihat ini untuk akses CPMK)
        Route::get('/mata-kuliah', [MataKuliahController::class, 'index'])
            ->middleware(['permission:view_mata_kuliah'])
            ->name('mata-kuliah.index');
        
        Route::get('/mata-kuliah/{id}/rps-data', [MataKuliahController::class, 'apiGetRpsData'])
            ->middleware(['permission:view_mata_kuliah'])
            ->name('mata-kuliah.rps-data');

        // CPMK Management
        Route::prefix('cpmk')->group(function () {
            Route::get('/mk/{mata_kuliah_id}', [CpmkController::class, 'index'])->name('cpmk.index');
            
            // Dosen & Kaprodi boleh menambah data CPMK
            Route::post('/', [CpmkController::class, 'store'])
                ->middleware(['permission:create_cpmk'])
                ->name('cpmk.store');
                
            Route::delete('/{cpmk}', [CpmkController::class, 'destroy'])
                ->middleware(['permission:create_cpmk'])
                ->name('cpmk.destroy');
        });

        // Placeholder untuk RPS (Sesuai titah masa depan Paduka)
        Route::post('/rps', function() {
            return response()->json(['message' => 'Mantra RPS belum diracik.']);
        })->middleware(['permission:create_rps'])->name('rps.store');
    });

    // --- MANTRA AUTENTIKASI ---
    require __DIR__.'/auth.php'; 
});