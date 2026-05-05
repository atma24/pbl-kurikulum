<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tenant;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's central database (Landlord).
     */
    public function run(): void
    {
        // 1. Definisi Data Master Prodi
        $tenants = [
            ['id' => 'trin', 'domain' => 'trin.localhost'],
            ['id' => 'tro', 'domain' => 'tro.localhost'],
            ['id' => 'trmo', 'domain' => 'trmo.localhost'],
        ];

        // 2. Injeksi Tenant & Domain ke Database Pusat
        foreach ($tenants as $data) {
            $tenant = Tenant::firstOrCreate(['id' => $data['id']]);
            $tenant->domains()->firstOrCreate(['domain' => $data['domain']]);
        }
    }
}