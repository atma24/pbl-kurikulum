<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class DosenBiodata extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_lengkap',
        'gelar_depan',
        'gelar_belakang',
        'nip',
        'nidn',
        'email',
        'no_hp',
        'prodi',
        'jabatan_akademik',
        'bidang_keahlian',
        'alamat',
    ];

    public function user(): HasOne
    {
        return $this->hasOne(User::class);
    }
}
