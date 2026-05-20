<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ik_cpmk', function (Blueprint $table) {
            $table->id();
            $table->foreignId('indikator_kinerja_id');
            $table->foreignId('cpmk_id');
            $table->timestamps();
            $table->foreign('indikator_kinerja_id')->references('id')->on('indikator_kinerjas')->onDelete('cascade');
            $table->foreign('cpmk_id')->references('id')->on('cpmks')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ik_cpmk');
    }
};
