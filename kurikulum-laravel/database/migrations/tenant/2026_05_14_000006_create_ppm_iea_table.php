<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ppm_iea', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ppm_id');
            $table->foreignId('iea_id');
            $table->boolean('is_selected')->default(false);
            $table->timestamps();
            $table->foreign('ppm_id')->references('id')->on('ppms')->onDelete('cascade');
            $table->foreign('iea_id')->references('id')->on('ieas')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ppm_iea');
    }
};
