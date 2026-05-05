<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rps extends Model
{
    // Ubah kajur_id menjadi nama_kajur
    protected $fillable = [
        'mata_kuliah_id', 'semester_ke', 'tahun_akademik', 'tanggal_penyusunan',
        'deskripsi_singkat', 'pustaka_utama', 'pustaka_pendukung',
        'dosen_pengampu_id', 'nama_kajur', 'kaprodi_id'
    ];

    public function mataKuliah() { return $this->belongsTo(MataKuliah::class); }
    public function penilaians() { return $this->hasMany(RpsPenilaian::class); }
    public function pertemuans() { return $this->hasMany(RpsPertemuan::class); }
    
    // Relasi Aktor (Hapus relasi kajur)
    public function dosenPengampu() { return $this->belongsTo(User::class, 'dosen_pengampu_id'); }
    public function kaprodi() { return $this->belongsTo(User::class, 'kaprodi_id'); }
}