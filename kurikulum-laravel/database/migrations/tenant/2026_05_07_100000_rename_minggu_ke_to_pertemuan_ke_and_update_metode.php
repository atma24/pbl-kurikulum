<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rps_details', function (Blueprint $table) {
            $table->renameColumn('minggu_ke', 'pertemuan_ke');
        });

        Schema::table('rps_details', function (Blueprint $table) {
            $table->text('metode_pembelajaran')->change();
        });
    }

    public function down(): void
    {
        Schema::table('rps_details', function (Blueprint $table) {
            $table->string('metode_pembelajaran')->change();
        });

        Schema::table('rps_details', function (Blueprint $table) {
            $table->renameColumn('pertemuan_ke', 'minggu_ke');
        });
    }
};
