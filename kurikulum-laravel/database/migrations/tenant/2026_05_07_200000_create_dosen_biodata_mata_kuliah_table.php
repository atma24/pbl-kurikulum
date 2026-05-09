<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dosen_biodata_mata_kuliah', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('dosen_biodata_id')->index();
            $table->foreignId('mata_kuliah_id')->constrained('mata_kuliahs')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['dosen_biodata_id', 'mata_kuliah_id'], 'dosen_mk_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dosen_biodata_mata_kuliah');
    }
};
