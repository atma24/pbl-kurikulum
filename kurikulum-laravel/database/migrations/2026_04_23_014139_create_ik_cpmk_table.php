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
            // Relasi Many-to-Many
            $table->foreignId('indikator_kinerja_id')->constrained('indikator_kinerjas')->onDelete('cascade');
            $table->foreignId('cpmk_id')->constrained('cpmks')->onDelete('cascade');
            
            // Opsi: Jika Anda ingin mencatat bobot spesifik dari CPMK ini terhadap Indikator Kinerja
            // $table->decimal('bobot_persentase', 5, 2)->default(100.00); 

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ik_cpmk');
    }
};