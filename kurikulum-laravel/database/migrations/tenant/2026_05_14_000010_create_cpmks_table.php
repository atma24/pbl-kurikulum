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
            $table->foreignId('mata_kuliah_id');
            $table->string('kode_cpmk');
            $table->text('deskripsi');
            $table->timestamps();
            $table->foreign('mata_kuliah_id')->references('id')->on('mata_kuliahs')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cpmks');
    }
};
