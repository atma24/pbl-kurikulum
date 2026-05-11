<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KurikulumTrinSeeder extends Seeder
{
    public function run(): void
    {
        // Seed Roles
        DB::table('roles')->insert([
            ['id' => 1, 'name' => 'Kaprodi', 'guard_name' => 'web', 'created_at' => '2026-05-08 23:04:43', 'updated_at' => '2026-05-08 23:04:43'],
            ['id' => 2, 'name' => 'Dosen', 'guard_name' => 'web', 'created_at' => '2026-05-08 23:04:43', 'updated_at' => '2026-05-08 23:04:43'],
        ]);

        // Seed Users
        DB::table('users')->insert([
            ['id' => 1, 'dosen_biodata_id' => null, 'name' => 'Polisi TRIN', 'email' => 'kaprodi@polman.edu', 'password' => '$2y$12$XFox44rIHcjfXJH8t2HVjOrUjLVmVN.1WNHVtDNOjurqIAD9LE4v6', 'created_at' => '2026-05-08 23:04:43', 'updated_at' => '2026-05-08 23:04:43', 'nip' => '198001012005011001', 'jabatan' => null],
            ['id' => 2, 'dosen_biodata_id' => 1, 'name' => 'tessss', 'email' => 'admin@ae.ac.id', 'password' => '$2y$12$jemKNIa8HSzLKTM3zV.jmuO5NLoUdhIIfV7O3lQGYiQ/F9TfxP3FK', 'created_at' => '2026-05-08 23:04:50', 'updated_at' => '2026-05-08 23:04:50', 'nip' => null, 'jabatan' => null],
            ['id' => 3, 'dosen_biodata_id' => 8, 'name' => 'Siti Aminah', 'email' => 'siti@ae.polman-bandung.ac.id', 'password' => '$2y$12$pWTCPSuAFePFsOrBvX7jMeGnhnLYBpy/OzhE8hOY2Xhjiw7YXXPBq', 'created_at' => '2026-05-09 21:27:12', 'updated_at' => '2026-05-09 21:27:12', 'nip' => '197408172009122001', 'jabatan' => null],
            ['id' => 4, 'dosen_biodata_id' => 11, 'name' => 'Ridwan', 'email' => 'ridwan@ae.polman-bandung.ac.id', 'password' => '$2y$12$XW3nICcoj.pa7Nl3/wxMQOjn/6zqYAqhG7yabfA8SA5Wn1UhIx5My', 'created_at' => '2026-05-09 21:34:45', 'updated_at' => '2026-05-09 21:34:45', 'nip' => '197806122001121002', 'jabatan' => null],
        ]);

        // Seed Model Has Roles
        DB::table('model_has_roles')->insert([
            ['role_id' => 1, 'model_type' => 'App\\Models\\User', 'model_id' => 1],
            ['role_id' => 1, 'model_type' => 'App\\Models\\User', 'model_id' => 2],
            ['role_id' => 1, 'model_type' => 'App\\Models\\User', 'model_id' => 3],
            ['role_id' => 1, 'model_type' => 'App\\Models\\User', 'model_id' => 4],
        ]);

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

        // Seed Dosen Biodata Mata Kuliah
        DB::table('dosen_biodata_mata_kuliah')->insert([
            ['id' => 1, 'dosen_biodata_id' => 2, 'mata_kuliah_id' => 1, 'created_at' => '2026-05-09 01:07:15', 'updated_at' => '2026-05-09 01:07:15']
        ]);
    }
}