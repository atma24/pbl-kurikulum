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
use App\Http\Controllers\RpsController; // Mantra baru diimpor
use App\Http\Controllers\UserController;
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

    // --- GERBANG PENYAMBUT ---
    Route::get('/', function () {
        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
    });

    // --- ZONA AMAN (LOGIN REQUIRED) ---
    Route::middleware(['auth', 'verified'])->group(function () {
        
        Route::get('/dashboard', function () {
            return Inertia::render('Dashboard');
        })->name('dashboard');

        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

        // ==========================================
        // KEKUASAAN KAPRODI (FULL FEATURES)
        // ==========================================
        Route::middleware(['role:Kaprodi'])->group(function () {
            Route::get('/users', [UserController::class, 'index'])->name('users.index');
            Route::post('/users', [UserController::class, 'store'])->name('users.store');
            
            Route::apiResource('cpl', CplController::class)->only(['index', 'store', 'destroy']);
            Route::apiResource('ppm', PpmController::class)->only(['index', 'store', 'destroy']);
            Route::apiResource('iea', IeaController::class)->only(['index', 'store', 'destroy']);
            Route::apiResource('indikator-kinerja', IndikatorKinerjaController::class)->only(['index', 'store', 'destroy']);
            
            Route::prefix('matrix')->group(function () {
                Route::get('/', [MatrixController::class, 'index'])->name('matrix.index');
                Route::post('/sync-cpl-iea', [MatrixController::class, 'syncCplIea'])->name('matrix.sync-cpl-iea');
                Route::post('/sync-cpl-ppm', [MatrixController::class, 'syncCplPpm'])->name('matrix.sync-cpl-ppm');
                Route::post('/sync-ppm-iea', [MatrixController::class, 'syncPpmIea'])->name('matrix.sync-ppm-iea');
            });

            Route::post('/mata-kuliah', [MataKuliahController::class, 'store'])->name('mata-kuliah.store');
            Route::put('/mata-kuliah/{mata_kuliah}', [MataKuliahController::class, 'update'])->name('mata-kuliah.update');
            Route::delete('/mata-kuliah/{mata_kuliah}', [MataKuliahController::class, 'destroy'])->name('mata-kuliah.destroy');
        });

        // ==========================================
        // KEKUASAAN BERSAMA (DOSEN & KAPRODI)
        // ==========================================
        
        // Rute Utama RPS (Inertia)
        Route::resource('rps', RpsController::class); // Meliputi index, create, store, show, edit, update, destroy

        // Gerbang Suci API (Internal Fetch untuk Otomatisasi RPS)
        Route::prefix('api')->group(function () {
            Route::get('/mata-kuliah/{id}/rps-data', [MataKuliahController::class, 'apiGetRpsData'])
                ->name('api.mata-kuliah.rps-data');
            
            Route::get('/rps/latest/{mata_kuliah_id}', [RpsController::class, 'apiGetLatestRps'])
                ->name('api.rps.latest');
        });

        Route::get('/mata-kuliah', [MataKuliahController::class, 'index'])
            ->middleware(['permission:view_mata_kuliah'])
            ->name('mata-kuliah.index');

        Route::prefix('cpmk')->group(function () {
            Route::get('/mk/{mata_kuliah_id}', [CpmkController::class, 'index'])->name('cpmk.index');
            Route::post('/', [CpmkController::class, 'store'])
                ->middleware(['permission:create_cpmk'])
                ->name('cpmk.store');
            Route::delete('/{cpmk}', [CpmkController::class, 'destroy'])
                ->middleware(['permission:create_cpmk'])
                ->name('cpmk.destroy');
        });
    });

    require __DIR__.'/auth.php'; 
});