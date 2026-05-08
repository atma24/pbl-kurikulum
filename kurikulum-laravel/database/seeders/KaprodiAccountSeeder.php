<?php

namespace Database\Seeders;

use App\Models\DosenBiodata;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class KaprodiAccountSeeder extends Seeder
{
    public function run(): void
    {
        Role::findOrCreate('Kaprodi');

        $biodata = DosenBiodata::updateOrCreate(
            ['email' => 'siti@ae.polman-bandung.ac.id'],
            [
                'nama_lengkap' => 'Siti Aminah',
                'gelar_depan' => null,
                'gelar_belakang' => 'S.T., M.T.',
                'nip' => '197408172009122001',
                'nidn' => '',
                'no_hp' => null,
                'prodi' => 'Teknologi Rekayasa Informatika Industri',
                'jabatan_akademik' => 'Kaprodi',
                'bidang_keahlian' => null,
                'alamat' => null,
            ]
        );

        $user = User::updateOrCreate(
            ['email' => $biodata->email],
            [
                'dosen_biodata_id' => $biodata->id,
                'name' => $biodata->nama_lengkap,
                'nip' => $biodata->nip,
                'password' => Hash::make('password123'),
            ]
        );

        $user->assignRole('Kaprodi');
    }
}
