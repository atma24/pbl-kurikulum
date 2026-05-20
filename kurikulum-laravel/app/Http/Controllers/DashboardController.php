<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Cpl;
use App\Models\Cpmk;
use App\Models\MataKuliah;
use App\Models\Rps;
use App\Models\DosenBiodata;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if ($user->hasRole('Kaprodi')) {
            return $this->kaprodiDashboard($user);
        }

        if ($user->hasRole('Dosen')) {
            return $this->dosenDashboard($user);
        }

        // Fallback: role tidak dikenali
        return Inertia::render('Dashboard', [
            'dashboardRole' => 'default',
            'stats'         => [],
            'coverage'      => [],
            'items'         => [],
            'shortcuts'     => [],
        ]);
    }

    // ─── Dashboard Kaprodi ──────────────────────────────────────────

    private function kaprodiDashboard($user)
    {
        $totalMk    = MataKuliah::count();
        $totalCpl   = Cpl::count();
        $totalCpmk  = Cpmk::count();
        $totalRps   = Rps::count();
        $totalDosen = DB::connection('central')->table('dosen_biodatas')->count();

        $mkWithCpl   = MataKuliah::has('cpls')->count();
        $mkWithRps   = MataKuliah::has('rps')->count();
        $mkWithDosen = \DB::table('dosen_biodata_mata_kuliah')
            ->distinct('mata_kuliah_id')
            ->count('mata_kuliah_id');

        $obeCoverage   = $totalMk > 0 ? round(($mkWithCpl / $totalMk) * 100) : 0;
        $rpsCoverage   = $totalMk > 0 ? round(($mkWithRps / $totalMk) * 100) : 0;
        $dosenCoverage = $totalMk > 0 ? round(($mkWithDosen / $totalMk) * 100) : 0;

        // Tabel ringkasan mata kuliah
        $mataKuliahs = MataKuliah::withCount(['cpls', 'cpmks', 'rps'])
            ->orderBy('semester')
            ->orderBy('kode_mk')
            ->get()
            ->map(function ($mk) {
                $dosenIds = DB::table('dosen_biodata_mata_kuliah')
                    ->where('mata_kuliah_id', $mk->id)
                    ->pluck('dosen_biodata_id');
                
                $dosenPengampusCount = $dosenIds->count();
                $dosenPengampusNames = [];
                
                if ($dosenIds->isNotEmpty()) {
                    $dosens = DosenBiodata::on('central')
                        ->whereIn('id', $dosenIds)
                        ->get(['id', 'nama_lengkap', 'gelar_depan', 'gelar_belakang']);
                    
                    $dosenPengampusNames = $dosens->map(fn ($d) => [
                        'id'   => $d->id,
                        'nama' => trim(implode(' ', array_filter([
                            $d->gelar_depan, $d->nama_lengkap, $d->gelar_belakang,
                        ]))),
                    ])->toArray();
                }

                return [
                    'id'                   => $mk->id,
                    'kode_mk'              => $mk->kode_mk,
                    'nama_mk'              => $mk->nama_mk,
                    'sks'                  => $mk->sks,
                    'semester'             => $mk->semester ?? '-',
                    'jenis'                => $mk->jenis,
                    'cpls_count'           => $mk->cpls_count,
                    'cpmks_count'          => $mk->cpmks_count,
                    'dosen_pengampus_count' => $dosenPengampusCount,
                    'rps_count'            => $mk->rps_count,
                    'dosen_pengampus'      => $dosenPengampusNames,
                ];
            });

        return Inertia::render('Dashboard', [
            'dashboardRole' => 'kaprodi',
            'stats' => [
                'total_mk'    => $totalMk,
                'total_cpl'   => $totalCpl,
                'total_cpmk'  => $totalCpmk,
                'total_rps'   => $totalRps,
                'total_dosen' => $totalDosen,
            ],
            'coverage' => [
                'obe'              => $obeCoverage,
                'rps'              => $rpsCoverage,
                'dosen_assignment' => $dosenCoverage,
            ],
            'items' => $mataKuliahs,
            'shortcuts' => [
                ['label' => 'Kelola CPL',              'href' => route('cpl.index'),              'description' => 'Capaian Pembelajaran Lulusan'],
                ['label' => 'Kelola PPM',              'href' => route('ppm.index'),              'description' => 'Profil Profesional Mandiri'],
                ['label' => 'Kelola IEA',              'href' => route('iea.index'),              'description' => 'IEA Graduate Attributes'],
                ['label' => 'Indikator Kinerja',       'href' => route('indikator-kinerja.index'), 'description' => 'Indikator pencapaian CPL'],
                ['label' => 'Curriculum Map',           'href' => route('matrix.index'),           'description' => 'Matriks CPL-MK-IEA-PPM'],
                ['label' => 'Kelola RPS',              'href' => route('rps.index'),              'description' => 'Rencana Pembelajaran Semester'],
                ['label' => 'Biodata Dosen',           'href' => route('biodata-dosen.index'),     'description' => 'Data lengkap dosen'],
                ['label' => 'Akun Dosen',              'href' => route('dosen.index'),            'description' => 'Manajemen akun dosen'],
            ],
        ]);
    }

    // ─── Dashboard Dosen ────────────────────────────────────────────

    private function dosenDashboard($user)
    {
        // Use the same dashboard as Kaprodi
        return $this->kaprodiDashboard($user);
    }
}
