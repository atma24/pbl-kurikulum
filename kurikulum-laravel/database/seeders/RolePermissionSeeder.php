<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Menyapu bersih cache sihir Spatie sebelumnya
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // MENCIPTAKAN HAK AKSES (PERMISSIONS)
        // Kita ciptakan hak akses spesifik yang dibutuhkan Dosen
        Permission::firstOrCreate(['name' => 'view_mata_kuliah']);
        Permission::firstOrCreate(['name' => 'create_cpmk']);
        Permission::firstOrCreate(['name' => 'create_rps']);

        // MENCIPTAKAN KASTA (ROLES)
        $dosen = Role::firstOrCreate(['name' => 'Dosen']);
        $kaprodi = Role::firstOrCreate(['name' => 'Kaprodi']);

        // PENGANUGERAHAN KEKUATAN PADA DOSEN
        $dosen->syncPermissions([
            'view_mata_kuliah',
            'create_cpmk',
            'create_rps'
        ]);

        // Catatan: Kaprodi tidak perlu diberi permission satu per satu di sini,
        // karena kita akan memberinya kuasa absolut di tingkat Kernel/Provider.
    }
}