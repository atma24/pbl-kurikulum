<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rps', function (Blueprint $table) {
            $table->dropForeign(['dosen_id']);
            $table->dropColumn('dosen_id');
        });

        Schema::table('rps', function (Blueprint $table) {
            $table->unsignedBigInteger('dosen_biodata_id')->nullable()->after('mata_kuliah_id')->index();
        });
    }

    public function down(): void
    {
        Schema::table('rps', function (Blueprint $table) {
            $table->dropColumn('dosen_biodata_id');
        });

        Schema::table('rps', function (Blueprint $table) {
            $table->foreignId('dosen_id')->after('mata_kuliah_id')->constrained('users')->cascadeOnDelete();
        });
    }
};
