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
            $table->foreignId('cpl_id');
            $table->string('kode')->unique();
            $table->text('deskripsi');
            $table->timestamps();
            $table->foreign('cpl_id')->references('id')->on('cpls')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('indikator_kinerjas');
    }
};
