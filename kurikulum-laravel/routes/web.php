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
use App\Http\Controllers\DosenController;
use App\Http\Controllers\RpsController;

// --- ZONA PUBLIK ---
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// --- ZONA AMAN (AUTENTIKASI UMUM) ---
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
    // rps
    Route::resource('rps', RpsController::class)->except(['show']);

    // 2. Rute Print Preview PDF (Buka di browser / tab baru)
    Route::get('/rps/{id}/pdf', [RpsController::class, 'printPdf'])->name('rps.pdf');

    // 3. Rute Download PDF (Otomatis langsung mengunduh file)
    Route::get('/rps/{id}/download', [RpsController::class, 'downloadPdf'])->name('rps.download');
    // Profile & Signature (Akses Universal)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Rute Mata Kuliah & CPMK (Dosen butuh akses READ untuk memilih MK, dan akses WRITE untuk mengisi CPMK)
    Route::resource('mata-kuliah', MataKuliahController::class)->except(['create', 'show', 'edit']);
    Route::prefix('mata-kuliah')->group(function () {
        Route::get('/{id}/rps-data', [MataKuliahController::class, 'apiGetRpsData'])->name('mata-kuliah.rps-data');
    });

    Route::prefix('cpmk')->group(function () {
        Route::get('/mk/{mata_kuliah_id}', [CpmkController::class, 'index'])->name('cpmk.index');
        Route::post('/', [CpmkController::class, 'store'])->name('cpmk.store');
        Route::delete('/{cpmk}', [CpmkController::class, 'destroy'])->name('cpmk.destroy');
    });

    // Rute Matrix (Akses Universal untuk melihat relasi)
    Route::prefix('matrix')->group(function () {
        Route::get('/', [MatrixController::class, 'index'])->name('matrix.index');
    });
});

// --- ZONA OTORISASI MUTLAK (HANYA KAPRODI) ---
Route::middleware(['auth', 'role:Kaprodi'])->group(function () {
    // Manajemen Dosen
    Route::get('/dosen', [DosenController::class, 'index'])->name('dosen.index');
    Route::get('/dosen/create', [DosenController::class, 'create'])->name('dosen.create');
    Route::post('/dosen', [DosenController::class, 'store'])->name('dosen.store');

    // Master Data OBE
    Route::resource('indikator-kinerja', IndikatorKinerjaController::class)->except(['create', 'show', 'edit']);

    Route::get('/cpl', [CplController::class, 'index'])->name('cpl.index');
    Route::post('/cpl', [CplController::class, 'store'])->name('cpl.store');
    Route::patch('/cpl/{cpl}', [CplController::class, 'update'])->name('cpl.update');
    Route::delete('/cpl/{cpl}', [CplController::class, 'destroy'])->name('cpl.destroy');

    Route::get('/ppm', [PpmController::class, 'index'])->name('ppm.index');
    Route::post('/ppm', [PpmController::class, 'store'])->name('ppm.store');
    Route::patch('/ppm/{ppm}', [PpmController::class, 'update'])->name('ppm.update');
    Route::delete('/ppm/{ppm}', [PpmController::class, 'destroy'])->name('ppm.destroy');

    Route::get('/iea', [IeaController::class, 'index'])->name('iea.index');
    Route::post('/iea', [IeaController::class, 'store'])->name('iea.store');
    Route::patch('/iea/{iea}', [IeaController::class, 'update'])->name('iea.update');
    Route::delete('/iea/{iea}', [IeaController::class, 'destroy'])->name('iea.destroy');

    // Sinkronisasi Matrix (Hanya Kaprodi yang boleh mengubah relasi CPL/PPM/IEA)
    Route::post('/matrix/bulk-sync', [MatrixController::class, 'syncCplBulk'])->name('matrix.sync.bulk');
    Route::post('/matrix/sync-cpl-iea', [MatrixController::class, 'syncCplIea'])->name('matrix.sync-cpl-iea');
    Route::post('/matrix/sync-ppm-iea', [MatrixController::class, 'syncPpmIea'])->name('matrix.sync-ppm-iea');
    Route::post('/matrix/sync-mk-cpl', [MatrixController::class, 'syncMkCpl'])->name('matrix.sync-mk-cpl');
});

require __DIR__.'/auth.php';