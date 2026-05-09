<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mata_kuliah_id')->constrained('mata_kuliahs')->cascadeOnDelete();
            $table->foreignId('dosen_id')->constrained('users')->cascadeOnDelete();
            $table->string('tahun_akademik', 20); // Contoh: 2021/2022
            $table->date('tanggal_penyusunan');
            $table->text('pustaka_utama');
            $table->text('pustaka_pendukung')->nullable();
            $table->string('tte_path'); // Path file tanda tangan digital
            $table->timestamps();
        });

        Schema::create('rps_penilaians', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rps_id')->constrained('rps')->cascadeOnDelete();
            $table->foreignId('cpmk_id')->constrained('cpmks')->cascadeOnDelete();
            // Menggunakan decimal untuk presisi angka (contoh: 8.75)
            $table->decimal('quiz', 5, 2)->default(0);
            $table->decimal('tugas', 5, 2)->default(0);
            $table->decimal('project', 5, 2)->default(0);
            $table->decimal('uts', 5, 2)->default(0);
            $table->decimal('uas', 5, 2)->default(0);
            $table->timestamps();
        });

        Schema::create('rps_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rps_id')->constrained('rps')->cascadeOnDelete();
            $table->string('minggu_ke', 10); // Contoh: "1" atau "3-4"
            $table->text('kemampuan_akhir');
            $table->text('indikator');
            $table->text('bahan_kajian');
            $table->string('metode_pembelajaran');
            $table->string('estimasi_waktu'); // Contoh: "2x100 menit"
            $table->text('pengalaman_belajar')->nullable();
            $table->string('penilaian_komponen')->nullable();
            $table->decimal('penilaian_bobot', 5, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop tabel anak terlebih dahulu untuk menghindari foreign key constraint violation
        Schema::dropIfExists('rps_details');
        Schema::dropIfExists('rps_penilaians');
        Schema::dropIfExists('rps');
    }
};