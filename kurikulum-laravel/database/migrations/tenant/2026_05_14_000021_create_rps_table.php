<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mata_kuliah_id');
            $table->foreignId('dosen_biodata_id')->nullable()->index();
            $table->string('tahun_akademik', 20);
            $table->string('kode_dokumen', 255)->nullable();
            $table->date('tanggal_penyusunan');
            $table->text('pustaka_utama');
            $table->text('pustaka_pendukung')->nullable();
            $table->text('bahan_kajian_utama')->nullable();
            $table->string('tte_dosen', 255)->nullable();
            $table->string('tte_kaprodi', 255)->nullable();
            $table->string('tte_kajur', 255)->nullable();
            $table->timestamps();
            $table->foreign('mata_kuliah_id')->references('id')->on('mata_kuliahs')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rps');
    }
};
