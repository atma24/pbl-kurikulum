<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class DosenBiodata extends Model
{
    use HasFactory;

    protected $connection = 'central';

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

    public function mataKuliahs()
    {
        return $this->belongsToMany(MataKuliah::class, 'dosen_biodata_mata_kuliah', 'dosen_biodata_id', 'mata_kuliah_id')
                    ->withTimestamps();
    }

    /**
     * Helper: Nama lengkap dengan gelar
     */
    public function getNamaLengkapGelarAttribute(): string
    {
        return trim(implode(' ', array_filter([
            $this->gelar_depan,
            $this->nama_lengkap,
            $this->gelar_belakang,
        ])));
    }
}
