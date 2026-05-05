<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rps extends Model
{
    protected $fillable = [
        'mata_kuliah_id', 'semester_ke', 'tahun_akademik', 'tanggal_penyusunan',
        'deskripsi_singkat', 'pustaka_utama', 'pustaka_pendukung',
        'dosen_pengampu_id', 'kajur_id', 'kaprodi_id'
    ];

    public function mataKuliah() { return $this->belongsTo(MataKuliah::class); }
    public function penilaians() { return $this->hasMany(RpsPenilaian::class); }
    public function pertemuans() { return $this->hasMany(RpsPertemuan::class); }
    
    // Relasi Aktor
    public function dosenPengampu() { return $this->belongsTo(User::class, 'dosen_pengampu_id'); }
    public function kajur() { return $this->belongsTo(User::class, 'kajur_id'); }
    public function kaprodi() { return $this->belongsTo(User::class, 'kaprodi_id'); }
}