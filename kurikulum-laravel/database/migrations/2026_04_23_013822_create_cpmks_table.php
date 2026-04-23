<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cpmks', function (Blueprint $table) {
            $table->id();
            // Jangkar ke tabel mata kuliah (1 Mata Kuliah punya banyak CPMK)
            $table->foreignId('mata_kuliah_id')->constrained('mata_kuliahs')->onDelete('cascade');
            
            $table->string('kode'); // Contoh: CPMK-1, CPMK-2
            $table->text('deskripsi');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cpmks');
    }
};