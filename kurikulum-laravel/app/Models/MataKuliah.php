<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MataKuliah extends Model
{
    use HasFactory;

    // Menegaskan nama tabel (opsional tapi sangat disarankan agar Laravel tidak bingung)
    protected $table = 'mata_kuliahs';

    protected $fillable = ['kode_mk', 'nama_mk', 'sks'];

    // Relasi ke CPL
    public function cpls()
    {
        return $this->belongsToMany(Cpl::class, 'mk_cpl', 'mata_kuliah_id', 'cpl_id')
                    ->withPivot('bobot')
                    ->withTimestamps();
    }
}