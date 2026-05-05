<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Entitas Induk RPS
        Schema::create('rps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mata_kuliah_id')->constrained('mata_kuliahs')->cascadeOnDelete();
            $table->integer('semester_ke');
            $table->string('tahun_akademik');
            $table->date('tanggal_penyusunan')->nullable();
            $table->text('deskripsi_singkat')->nullable();
            $table->text('pustaka_utama')->nullable();
            $table->text('pustaka_pendukung')->nullable();
            
            // Relasi Otorisasi
            $table->foreignId('dosen_pengampu_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('kaprodi_id')->nullable()->constrained('users')->nullOnDelete();
            
            // MVP Fix: Kajur manual
            $table->string('nama_kajur')->nullable(); 
            
            $table->timestamps();
        });

        // 2. Entitas Matriks Sistem Evaluasi (MVP Hardcoded)
        Schema::create('rps_penilaians', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rps_id')->constrained('rps')->cascadeOnDelete();
            $table->foreignId('cpmk_id')->constrained('cpmks')->cascadeOnDelete();
            $table->float('kuis')->default(0);
            $table->float('tugas')->default(0);
            $table->float('project')->default(0);
            $table->float('uts')->default(0);
            $table->float('uas')->default(0);
            $table->timestamps();
        });

        // 3. Entitas Rencana Kegiatan Mingguan
        Schema::create('rps_pertemuans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rps_id')->constrained('rps')->cascadeOnDelete();
            $table->string('pertemuan_ke');
            $table->text('kemampuan_akhir')->nullable();
            $table->text('indikator')->nullable();
            $table->text('bahan_kajian')->nullable();
            $table->text('metode_pembelajaran')->nullable();
            $table->string('estimasi_waktu')->nullable();
            $table->text('pengalaman_belajar')->nullable();
            $table->string('metode_penilaian')->nullable();
            $table->float('bobot_penilaian')->default(0);
            $table->timestamps();
        });

        // 4. Entitas Pivot (Sebaran CPMK pada Asesmen Mingguan)
        Schema::create('cpmk_rps_pertemuan', function (Blueprint $table) {
            $table->foreignId('rps_pertemuan_id')->constrained('rps_pertemuans')->cascadeOnDelete();
            $table->foreignId('cpmk_id')->constrained('cpmks')->cascadeOnDelete();
            $table->primary(['rps_pertemuan_id', 'cpmk_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cpmk_rps_pertemuan');
        Schema::dropIfExists('rps_pertemuans');
        Schema::dropIfExists('rps_penilaians');
        Schema::dropIfExists('rps');
    }
};