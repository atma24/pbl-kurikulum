<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\MatrixController;
use App\Http\Controllers\IeaController;

// Rute untuk halaman Input IEA
Route::get('/iea', [IeaController::class, 'index'])->name('iea.index');
Route::post('/iea', [IeaController::class, 'store'])->name('iea.store');
// Menampilkan halaman utama matriks
Route::get('/matrix', [MatrixController::class, 'index'])->name('matrix.index');

// Menyimpan centangan tabel matriks
Route::post('/matrix/sync-cpl-iea', [MatrixController::class, 'syncCplIea'])->name('matrix.sync.cpl-iea');
Route::post('/matrix/sync-ppm-iea', [MatrixController::class, 'syncPpmIea'])->name('matrix.sync.ppm-iea');
Route::post('/matrix/ppm', [MatrixController::class, 'storePpm'])->name('matrix.ppm.store');
// Menyimpan data CPL baru (Otomatis generate kode)
Route::post('/matrix/cpl', [MatrixController::class, 'storeCpl'])->name('matrix.cpl.store');

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

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
