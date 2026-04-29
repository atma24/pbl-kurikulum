<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Central Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return 'Selamat datang di Gerbang Landlord. Silakan akses wilayah Paduka melalui subdomain (contoh: trin.localhost:8000).';
});

// Catatan: require auth.php TELAH DIHAPUS dari sini dan dipindah ke tenant.php