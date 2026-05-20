<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rps_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rps_id');
            $table->string('pertemuan_ke', 10);
            $table->text('kemampuan_akhir');
            $table->text('indikator');
            $table->text('bahan_kajian');
            $table->text('metode_pembelajaran');
            $table->string('estimasi_waktu', 255);
            $table->text('pengalaman_belajar')->nullable();
            $table->string('penilaian_komponen', 255)->nullable();
            $table->decimal('penilaian_bobot', 5, 2)->default(0.00);
            $table->timestamps();
            $table->foreign('rps_id')->references('id')->on('rps')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rps_details');
    }
};
