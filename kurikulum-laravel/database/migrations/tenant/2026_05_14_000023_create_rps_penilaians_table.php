<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rps_penilaians', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rps_id');
            $table->foreignId('cpmk_id');
            $table->decimal('quiz', 5, 2)->default(0.00);
            $table->decimal('tugas', 5, 2)->default(0.00);
            $table->decimal('project', 5, 2)->default(0.00);
            $table->decimal('uts', 5, 2)->default(0.00);
            $table->decimal('uas', 5, 2)->default(0.00);
            $table->timestamps();
            $table->foreign('rps_id')->references('id')->on('rps')->onDelete('cascade');
            $table->foreign('cpmk_id')->references('id')->on('cpmks')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rps_penilaians');
    }
};
