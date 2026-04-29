<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('indikator_kinerjas', function (Blueprint $table) {
            $table->id();
            // Jangkar relasional ke tabel CPL
            $table->foreignId('cpl_id')->constrained('cpls')->onDelete('cascade');
            $table->string('kode')->unique(); // Contoh: A-1, B-2
            $table->text('deskripsi');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('indikator_kinerjas');
    }
};