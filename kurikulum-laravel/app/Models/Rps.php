<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rps extends Model
{
    protected $fillable = [
        'mata_kuliah_id', 'dosen_id', 'tahun_akademik', 
        'tanggal_penyusunan', 'pustaka_utama', 'pustaka_pendukung', 'tte_path'
    ];

    public function mataKuliah()
    {
        return $this->belongsTo(MataKuliah::class);
    }

    public function dosen()
    {
        return $this->belongsTo(User::class, 'dosen_id');
    }

    public function penilaians()
    {
        return $this->hasMany(RpsPenilaian::class);
    }

    public function details()
    {
        return $this->hasMany(RpsDetail::class);
    }
}