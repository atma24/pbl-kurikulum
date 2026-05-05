<?php

namespace App\Http\Controllers;

use App\Models\Rps;
use App\Models\MataKuliah;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RpsController extends Controller
{
    public function index()
    {
        $rps = Rps::with(['mataKuliah'])->latest()->get();
        return Inertia::render('Rps/page', ['rps' => $rps]);
    }

    public function create()
    {
        // Mengambil MK beserta CPMK-nya untuk bahan Matriks Penilaian
        $mataKuliahs = MataKuliah::with('cpmks')->get();
        return Inertia::render('Rps/Create', ['mataKuliahs' => $mataKuliahs]);
    }

    public function store(Request $request)
    {
        // Validasi Ketat: Memastikan seluruh struktur data suci dari kesalahan
        $validated = $request->validate([
            'mata_kuliah_id'    => 'required|exists:mata_kuliahs,id',
            'semester_ke'       => 'required|integer',
            'tahun_akademik'    => 'required|string',
            'deskripsi_singkat' => 'nullable|string',
            'pustaka_utama'     => 'nullable|string',
            'pustaka_pendukung' => 'nullable|string',
            'penilaian'         => 'required|array', // Matriks Evaluasi
            'penilaian.*.cpmk_id' => 'required|exists:cpmks,id',
            'pertemuan'         => 'required|array', // Rencana Mingguan
            'pertemuan.*.cpmk_ids' => 'required|array',
        ]);

        return DB::transaction(function () use ($validated) {
            // 1. Menempa Induk RPS
            $rps = Rps::create($validated);

            // 2. Menenun Matriks Penilaian (Evaluasi)
            foreach ($validated['penilaian'] as $item) {
                $rps->penilaians()->create($item);
            }

            // 3. Merajut Rencana Pertemuan & Ikatan Pivot CPMK
            foreach ($validated['pertemuan'] as $p) {
                $pertemuan = $rps->pertemuans()->create($p);
                // Mengunci relasi Many-to-Many dengan CPMK
                $pertemuan->cpmks()->attach($p['cpmk_ids']);
            }

            return redirect()->route('rps.index')->with('success', 'Prasasti RPS berhasil disemayamkan di pangkalan data.');
        });
    }

    public function destroy(Rps $rps)
    {
        $rps->delete(); // Seluruh anak data akan musnah karena Segel Cascade di Database
        return redirect()->back()->with('success', 'RPS telah dilenyapkan dari sejarah.');
    }
}