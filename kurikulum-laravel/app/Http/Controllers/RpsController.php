<?php

namespace App\Http\Controllers;

use App\Models\Rps;
use App\Models\MataKuliah;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class RpsController extends Controller
{
    public function index()
    {
        // Isolasi Data: Hanya tarik RPS milik Dosen yang sedang login
        $rps = Rps::with(['mataKuliah'])
            ->where('dosen_pengampu_id', Auth::id())
            ->latest()
            ->get();
            
        return Inertia::render('Rps/page', ['rps' => $rps]);
    }

    public function create()
    {
        // Tarik Mata Kuliah dan daftar Kaprodi untuk dropdown Form
        $mataKuliahs = MataKuliah::all(); 
        $kaprodis = User::role('Kaprodi')->get(['id', 'name']);

        return Inertia::render('Rps/Create', [
            'mataKuliahs' => $mataKuliahs,
            'kaprodis' => $kaprodis
        ]);
    }

    public function store(Request $request)
    {
        // Validasi Ketat MVP
        $validated = $request->validate([
            'mata_kuliah_id'    => 'required|exists:mata_kuliahs,id',
            'semester_ke'       => 'required|integer',
            'tahun_akademik'    => 'required|string',
            'deskripsi_singkat' => 'nullable|string',
            'pustaka_utama'     => 'nullable|string',
            'pustaka_pendukung' => 'nullable|string',
            
            // Validasi Aktor
            'kaprodi_id'        => 'required|exists:users,id',
            'nama_kajur'        => 'required|string|max:255',
            
            // Validasi Array Matriks Penilaian
            'penilaian'           => 'required|array',
            'penilaian.*.cpmk_id' => 'required|exists:cpmks,id',
            'penilaian.*.kuis'    => 'nullable|numeric',
            'penilaian.*.tugas'   => 'nullable|numeric',
            'penilaian.*.project' => 'nullable|numeric',
            'penilaian.*.uts'     => 'nullable|numeric',
            'penilaian.*.uas'     => 'nullable|numeric',
            
            // Validasi Array Rencana Mingguan
            'pertemuan'                   => 'required|array',
            'pertemuan.*.pertemuan_ke'    => 'required|string',
            'pertemuan.*.kemampuan_akhir' => 'nullable|string',
            'pertemuan.*.indikator'       => 'nullable|string',
            'pertemuan.*.bahan_kajian'    => 'nullable|string',
            'pertemuan.*.metode_pembelajaran' => 'nullable|string',
            'pertemuan.*.estimasi_waktu'  => 'nullable|string',
            'pertemuan.*.pengalaman_belajar'  => 'nullable|string',
            'pertemuan.*.metode_penilaian'=> 'nullable|string',
            'pertemuan.*.bobot_penilaian' => 'nullable|numeric',
            'pertemuan.*.cpmk_ids'        => 'nullable|array',
        ]);

        return DB::transaction(function () use ($validated) {
            // Injeksi otomatis otorisasi Dosen Pengampu
            $validated['dosen_pengampu_id'] = Auth::id();

            // 1. Tempa Induk RPS
            $rps = Rps::create($validated);

            // 2. Tenun Matriks Penilaian
            if (!empty($validated['penilaian'])) {
                foreach ($validated['penilaian'] as $item) {
                    $rps->penilaians()->create($item);
                }
            }

            // 3. Rajut Rencana Pertemuan & Pivot CPMK
            if (!empty($validated['pertemuan'])) {
                foreach ($validated['pertemuan'] as $p) {
                    $pertemuan = $rps->pertemuans()->create($p);
                    
                    if (isset($p['cpmk_ids']) && is_array($p['cpmk_ids'])) {
                        $pertemuan->cpmks()->attach($p['cpmk_ids']);
                    }
                }
            }

            return redirect()->route('rps.index')->with('success', 'RPS berhasil disemayamkan.');
        });
    }

    public function destroy(Rps $rps)
    {
        // Lapis Keamanan Tambahan: Cegah penghapusan RPS milik orang lain via API/Postman
        if ($rps->dosen_pengampu_id !== Auth::id()) {
            abort(403, 'Otorisasi ditolak. Anda tidak berhak memusnahkan RPS ini.');
        }

        $rps->delete();
        return redirect()->back()->with('success', 'RPS telah dilenyapkan.');
    }
}