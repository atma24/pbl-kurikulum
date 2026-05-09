<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up()
    {
        Schema::table('mata_kuliahs', function (Blueprint $table) {
            // Kita pakai tipe enum agar datanya pasti antara 'Teori' atau 'Praktek'
            $table->enum('jenis', ['Teori', 'Praktek'])->default('Teori')->after('sks');
        });
    }

    public function down()
    {
        Schema::table('mata_kuliahs', function (Blueprint $table) {
            $table->dropColumn('jenis');
        });
    }
};
