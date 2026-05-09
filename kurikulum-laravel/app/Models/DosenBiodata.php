<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class DosenBiodata extends Model
{
    use HasFactory;

    // 1. HAPUS ATAU COMMENT BARIS INI:
    // protected $connection = 'central';

    // 2. TAMBAHKAN METHOD INI:
    public function getTable()
    {
        // Ambil nama database central dari konfigurasi agar tetap dinamis
        // lalu gabungkan dengan nama tabel dosen_biodatas.
        $centralDb = config('database.connections.central.database');
        return $centralDb . '.dosen_biodatas';
    }

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

    // Helper: Nama lengkap dengan gelar tetap dibiarkan...
    public function getNamaLengkapGelarAttribute(): string
    {
        // ...
    }
}