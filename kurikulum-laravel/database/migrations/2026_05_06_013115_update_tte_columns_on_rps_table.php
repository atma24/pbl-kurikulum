<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rps', function (Blueprint $table) {
            $table->dropColumn('tte_path'); // Hapus yang lama
            $table->string('tte_dosen')->nullable();
            $table->string('tte_kaprodi')->nullable();
            $table->string('tte_kajur')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('rps', function (Blueprint $table) {
            $table->string('tte_path')->nullable();
            $table->dropColumn(['tte_dosen', 'tte_kaprodi', 'tte_kajur']);
        });
    }
};