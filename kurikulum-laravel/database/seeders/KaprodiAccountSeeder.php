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
            ['email' => 'adhitya@ae.polman-bandung.ac.id'],
            [
                'nama_lengkap' => 'Adhitya Sumardi Sunarya',
                'gelar_depan'      => null,
                'gelar_belakang'   => 'S.Si., M.Si.',
                'nip'              => '198110052009121005', 
                'nidn'             => null, // ← null, bukan ''
                'no_hp'            => null,
                'prodi'            => 'Teknologi Rekayasa Mekatronika',
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
