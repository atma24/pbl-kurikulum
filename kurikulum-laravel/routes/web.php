<?php

use Illuminate\Support\Facades\Route;
use App\Models\Tenant;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Central Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    // Menarik semua data tenant beserta tabel relasi 'domains'
    $tenants = Tenant::with('domains')->get();

    // Melempar data ke komponen React js/Pages/Portal/page.tsx
    return Inertia::render('Portal/page', [
        'tenants' => $tenants
    ]);
});