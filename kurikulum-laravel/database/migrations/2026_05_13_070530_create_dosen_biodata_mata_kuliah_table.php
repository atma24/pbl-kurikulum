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
        Schema::create('dosen_biodata_mata_kuliah', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('dosen_biodata_id');
            $table->unsignedBigInteger('mata_kuliah_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dosen_biodata_mata_kuliah');
    }
};
