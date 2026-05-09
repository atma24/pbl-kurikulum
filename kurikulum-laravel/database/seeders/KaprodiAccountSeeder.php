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
            ['email' => 'admin@ae.ac.id'],
            [
                'nama_lengkap' => 'tessss',
                'gelar_depan'      => null,
                'gelar_belakang'   => null,
                'nip'              => null, // ← null, bukan ''
                'nidn'             => null, // ← null, bukan ''
                'no_hp'            => null,
                'prodi'            => '',
                'jabatan_akademik' => 'Kaprodi',
                'bidang_keahlian'  => null,
                'alamat'           => null,
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
