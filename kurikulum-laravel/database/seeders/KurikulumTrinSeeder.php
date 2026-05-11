<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KurikulumTrinSeeder extends Seeder
{
    public function run(): void
    {


        // Seed Users


        // Seed Model Has Roles


        // Seed CPLs
        DB::table('cpls')->insert([
            ['id' => 1, 'kode' => 'CPL-01', 'deskripsi' => 'Lulusan mampu melakukan pengelolaan data science, komputasi, dan dasar-dasar rekayasa pada prosedur, proses, maupun sistem keteknikan terapan.', 'created_at' => '2026-05-09 20:27:24', 'updated_at' => '2026-05-09 20:27:24'],
            ['id' => 2, 'kode' => 'CPL-02', 'deskripsi' => 'Lulusan mampu merancang dan mengembangkan sistem dengan unjuk kerja baik dan memiliki kemampuan cerdas.', 'created_at' => '2026-05-09 20:27:34', 'updated_at' => '2026-05-09 20:27:34'],
            ['id' => 4, 'kode' => 'CPL-03', 'deskripsi' => 'Lulusan mampu merancang dan mengembangkan solusi teknologi rekayasa yang komprehensif dengan mengintegrasikan standar keselamatan, efisiensi sumber daya, dan dampak lingkungan hidup', 'created_at' => '2026-05-09 20:28:02', 'updated_at' => '2026-05-09 20:28:02'],
            ['id' => 5, 'kode' => 'CPL-04', 'deskripsi' => 'Lulusan mampu melakukan pengelolaan data dan informasi dalam skala enterprise, dapat melakukan pemantauan data dan informasi secara realtime dan mampu melakukan pemeliharaan sistem.', 'created_at' => '2026-05-09 20:28:17', 'updated_at' => '2026-05-09 20:28:17'],
        ]);

        // Seed IEAs
        DB::table('ieas')->insert([
            ['id' => 1, 'kode' => 'IEA_A', 'deskripsi' => 'Engineering Knowledge : Kemampuan menerapkan pengetahuan matematika, ilmu alam, komputasi, dasar-dasar rekayasa, dan suatu spesialisasi keteknikan pada prosedur, proses, sistem, atau metodologi keteknikan terapan tertentu.', 'created_at' => '2026-05-09 20:34:12', 'updated_at' => '2026-05-09 20:34:12'],
            ['id' => 2, 'kode' => 'IEA_B', 'deskripsi' => 'Problem Analysis :	Kemampuan mengidentifikasi, merumuskan, meneliti literatur dan menganalisis masalah teknik yang terdefinisi secara luas guna mencapai kesimpulan yang dibuktikan, dengan menggunakan alat bantu analisis yang sesuai dengan disiplin atau bidang spesialisasi.', 'created_at' => '2026-05-09 20:34:23', 'updated_at' => '2026-05-09 20:34:23'],
        ]);

        // Seed PPMs
        DB::table('ppms')->insert([
            ['id' => 10, 'kode' => 'PPM-01', 'deskripsi' => 'Lulusan dapat menggunakan pengalaman akademis dari perkuliahan, demonstrasi, eksperimen, proyek dan laboratorium, dan akan menerapkan pengetahuan teknis mendalam yang diperoleh di bidang informatika sebagai ahli perekayasa perangkat cerdas dan sistem tertanam berbasis otomasi manufaktur pada Manufacturing Execution System dan Enterprise Resource Planning dan akan berhasil menerapkan teknik analisis dan keterampilan pemecahan masalah yang diperlukan untuk beradaptasi dengan perubahan teknologi dan untuk berkarir di industri manufaktur.', 'created_at' => '2026-05-09 20:32:31', 'updated_at' => '2026-05-09 20:32:31'],
            ['id' => 11, 'kode' => 'PPM-02', 'deskripsi' => 'Lulusan dapat mengembangkan kemampuan diri untuk mengembangkan aplikasi perangkat lunak, konsultansi   perangkat   lunak,   membuat perangkat   lunak,   dan   melakukan   pengujian untuk memverifikasi fungsionalitas perangkat lunak. Mampu mengembangkan (Programmer), menguji dan memvalidasi (Quality Assurance) perangkat lunak pada Manufacturing Execution System dan Enterprise Resource Planning.', 'created_at' => '2026-05-09 20:32:42', 'updated_at' => '2026-05-09 20:32:42'],
        ]);

        // Seed Indikator Kinerjas
        DB::table('indikator_kinerjas')->insert([
            ['id' => 1, 'cpl_id' => 1, 'kode' => 'A-1', 'deskripsi' => 'Menerapkan metode data science dan algoritma komputasi untuk memproses dan menganalisis set data kompleks pada sistem industri.', 'created_at' => '2026-05-09 20:37:06', 'updated_at' => '2026-05-09 20:37:06'],
            ['id' => 2, 'cpl_id' => 1, 'kode' => 'A-2', 'deskripsi' => 'Menggunakan prinsip dasar rekayasa informatika dalam merancang prosedur, pemodelan matematis, dan logika sistem komputasi terapan.', 'created_at' => '2026-05-09 20:37:21', 'updated_at' => '2026-05-09 20:37:21'],
        ]);

        // Seed Mata Kuliah
        DB::table('mata_kuliahs')->insert([
            ['id' => 1, 'kode_mk' => '1232144ew', 'nama_mk' => 'matematika', 'sks' => 2, 'jenis' => 'Teori', 'deskripsi' => 'awdawdwadw', 'semester' => '1', 'sifat_pengambilan' => 'Wajib', 'cara_pembelajaran' => 'Daring', 'created_at' => '2026-05-08 23:49:26', 'updated_at' => '2026-05-08 23:49:26', 'prasyarat_id' => null]
        ]);


    }
}