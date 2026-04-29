<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate; // 1. Tambahkan ini

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // 2. MANTRA KUASA ABSOLUT KAPRODI
        // Secara implisit memberikan akses 'true' pada setiap pengecekan 'can()' atau middleware
        Gate::before(function ($user, $ability) {
            return $user->hasRole('Kaprodi') ? true : null;
        });
    }
}