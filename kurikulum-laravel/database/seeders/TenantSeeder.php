<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class TenantSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Eksekusi pembuatan Role & Permission di dalam tenant ini
        $this->call(RolePermissionSeeder::class);

        // 2. Tarik ID Tenant yang sedang aktif (contoh: 'trin', 'tro')
        $tenantId = tenant('id');

        // 3. Buat Akun Kaprodi Otomatis
        $kaprodi = User::firstOrCreate(
            ['email' => "kaprodi@{$tenantId}.localhost"], // Contoh: kaprodi@trin.localhost
            [
                'name' => 'Kaprodi ' . strtoupper($tenantId),
                'password' => Hash::make('password123'), // Password default sementara
            ]
        );

        // 4. Berikan hak akses Kaprodi
        $kaprodi->assignRole('Kaprodi');
    }
}