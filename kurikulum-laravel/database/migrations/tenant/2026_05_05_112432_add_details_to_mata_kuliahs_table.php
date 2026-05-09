<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('mata_kuliahs', function (Blueprint $table) {
            $table->string('semester', 20)->nullable()->after('deskripsi');
            $table->string('sifat_pengambilan', 50)->nullable()->after('semester'); // Cth: Wajib / Pilihan
            $table->string('cara_pembelajaran', 100)->nullable()->after('sifat_pengambilan'); // Cth: Tatap Muka
        });
    }

    public function down(): void
    {
        Schema::table('mata_kuliahs', function (Blueprint $table) {
            $table->dropColumn(['semester', 'sifat_pengambilan', 'cara_pembelajaran']);
        });
    }
};