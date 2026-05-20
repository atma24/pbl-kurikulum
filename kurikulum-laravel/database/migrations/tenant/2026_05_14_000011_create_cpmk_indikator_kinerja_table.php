<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cpmk_indikator_kinerja', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cpmk_id');
            $table->foreignId('indikator_kinerja_id');
            $table->timestamps();
            $table->foreign('cpmk_id')->references('id')->on('cpmks')->onDelete('cascade');
            $table->foreign('indikator_kinerja_id')->references('id')->on('indikator_kinerjas')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cpmk_indikator_kinerja');
    }
};
