<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cpl_ppm', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cpl_id');
            $table->foreignId('ppm_id');
            $table->boolean('is_selected')->default(false);
            $table->timestamps();
            $table->foreign('cpl_id')->references('id')->on('cpls')->onDelete('cascade');
            $table->foreign('ppm_id')->references('id')->on('ppms')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cpl_ppm');
    }
};
