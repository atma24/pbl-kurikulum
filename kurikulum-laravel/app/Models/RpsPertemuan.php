<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RpsPertemuan extends Model
{
    protected $fillable = [
        'rps_id', 'pertemuan_ke', 'kemampuan_akhir', 'indikator', 'bahan_kajian',
        'metode_pembelajaran', 'estimasi_waktu', 'pengalaman_belajar', 
        'metode_penilaian', 'bobot_penilaian'
    ];

    public function rps() { return $this->belongsTo(Rps::class); }
    public function cpmks() { return $this->belongsToMany(Cpmk::class, 'cpmk_rps_pertemuan'); }
}