<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MataKuliah extends Model
{
    use HasFactory;

    protected $table = 'mata_kuliahs';
    protected $fillable = ['kode_mk', 'nama_mk', 'sks', 'jenis', 'deskripsi'];
    // Relasi ke CPL (Sudah paduka miliki)
    public function cpls()
    {
        return $this->belongsToMany(Cpl::class, 'mk_cpl', 'mata_kuliah_id', 'cpl_id')
                    ->withPivot('bobot')
                    ->withTimestamps();
    }

    // Relasi ke CPMK (Baru ditambahkan)
    public function cpmks()
    {
        return $this->hasMany(Cpmk::class, 'mata_kuliah_id');
    }
}