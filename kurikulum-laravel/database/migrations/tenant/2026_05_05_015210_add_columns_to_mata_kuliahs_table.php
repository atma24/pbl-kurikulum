<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('mata_kuliahs', function (Blueprint $table) {
            // Menambahkan pilar baru setelah kolom 'sks'
            $table->integer('semester')->after('sks')->default(1);
            $table->string('sifat_pengambilan')->after('semester')->default('Wajib');
            $table->string('cara_pembelajaran')->after('sifat_pengambilan')->default('Tatap Muka');
            $table->string('prasyarat')->nullable()->after('cara_pembelajaran');
        });
    }

    public function down(): void
    {
        Schema::table('mata_kuliahs', function (Blueprint $table) {
            // Melenyapkan pilar jika terjadi pembatalan (rollback)
            $table->dropColumn(['semester', 'sifat_pengambilan', 'cara_pembelajaran', 'prasyarat']);
        });
    }
};