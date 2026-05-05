<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::table('mata_kuliahs', function (Blueprint $table) {
        $table->foreignId('prasyarat_id')
              ->nullable()
              ->constrained('mata_kuliahs')
              ->nullOnDelete(); // Jika MK prasyarat dihapus, set null, jangan hapus MK ini
    });
}

public function down(): void
{
    Schema::table('mata_kuliahs', function (Blueprint $table) {
        $table->dropForeign(['prasyarat_id']);
        $table->dropColumn('prasyarat_id');
    });
}
};
