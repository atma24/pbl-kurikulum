<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mk_cpl', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mata_kuliah_id');
            $table->foreignId('cpl_id');
            $table->integer('bobot')->default(0);
            $table->timestamps();
            $table->foreign('mata_kuliah_id')->references('id')->on('mata_kuliahs')->onDelete('cascade');
            $table->foreign('cpl_id')->references('id')->on('cpls')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mk_cpl');
    }
};
