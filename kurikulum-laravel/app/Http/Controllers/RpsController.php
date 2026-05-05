<?php

namespace App\Http\Controllers;

use App\Models\Rps;
use App\Models\MataKuliah;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class RpsController extends Controller
{
// app/Http/Controllers/RpsController.php

public function index()
{
    $rps = Rps::with(['mataKuliah:id,kode_mk,nama_mk', 'dosen:id,name'])->get();
    $mataKuliahs = MataKuliah::select('id', 'kode_mk', 'nama_mk')->get();

    // UBAH: 'Rps/Index' menjadi 'Rps/page'
    return Inertia::render('Rps/page', [
        'rps' => $rps,
        'mataKuliahs' => $mataKuliahs
    ]);
}

    public function create()
    {
        return Inertia::render('Rps/page', [
            'mataKuliahs' => MataKuliah::select('id', 'kode_mk', 'nama_mk')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateRps($request);

        DB::transaction(function () use ($validated, $request) {
            $ttePath = $request->file('tte')->store('rps_tte', 'public');

            $rps = Rps::create([
                'mata_kuliah_id'     => $validated['mata_kuliah_id'],
                'dosen_id'           => $request->user()->id,
                'tahun_akademik'     => $validated['tahun_akademik'],
                'tanggal_penyusunan' => $validated['tanggal_penyusunan'],
                'pustaka_utama'      => $validated['pustaka_utama'],
                'pustaka_pendukung'  => $validated['pustaka_pendukung'] ?? null,
                'tte_path'           => $ttePath,
            ]);

            // Eksekusi Mass Insert
            $rps->penilaians()->createMany($validated['penilaians']);
            $rps->details()->createMany($validated['details']);
        });

        return redirect()->route('rps.index')->with('success', 'RPS berhasil ditempa.');
    }

    public function edit(Rps $rps)
    {
        $rps->load(['mataKuliah', 'penilaians', 'details']);
        
        return Inertia::render('Rps/Edit', [
            'rpsData' => $rps,
            'mataKuliahs' => MataKuliah::select('id', 'kode_mk', 'nama_mk')->get()
        ]);
    }

    public function update(Request $request, Rps $rps)
    {
        $validated = $this->validateRps($request, true);

        DB::transaction(function () use ($validated, $request, $rps) {
            $data = [
                'mata_kuliah_id'     => $validated['mata_kuliah_id'],
                'tahun_akademik'     => $validated['tahun_akademik'],
                'tanggal_penyusunan' => $validated['tanggal_penyusunan'],
                'pustaka_utama'      => $validated['pustaka_utama'],
                'pustaka_pendukung'  => $validated['pustaka_pendukung'] ?? null,
            ];

    // 2. Pada method update() - bagian ganti file TTE
        if ($request->hasFile('tte')) {
            if ($rps->tte_path) {
                Storage::disk('public')->delete($rps->tte_path);
            }
            $data['tte_path'] = $request->file('tte')->store('rps_tte', 'public');
        }

            $rps->update($data);

            // Strategi Wipe-and-Recreate: Hapus data lama, masukkan data baru. 
            // Paling efisien untuk form repeater dinamis tanpa melacak ID baris satu per satu.
            $rps->penilaians()->delete();
            $rps->penilaians()->createMany($validated['penilaians']);

            $rps->details()->delete();
            $rps->details()->createMany($validated['details']);
        });

        return redirect()->route('rps.index')->with('success', 'RPS berhasil diperbarui.');
    }

// 1. Pada method destroy()
    public function destroy(Rps $rps)
    {
        if ($rps->tte_path) {
            Storage::disk('public')->delete($rps->tte_path);
        }
        
        $rps->delete(); 
        
        return redirect()->back()->with('success', 'RPS berhasil dilenyapkan.');
    }



    /**
     * Sentralisasi aturan validasi RPS
     */
    private function validateRps(Request $request, $isUpdate = false)
    {
        $tteRule = $isUpdate ? 'nullable' : 'required';

        return $request->validate([
            'mata_kuliah_id'     => 'required|exists:mata_kuliahs,id',
            'tahun_akademik'     => 'required|string|max:20',
            'tanggal_penyusunan' => 'required|date',
            'pustaka_utama'      => 'required|string',
            'pustaka_pendukung'  => 'nullable|string',
            'tte'                => "$tteRule|file|mimes:png,jpg,jpeg,pdf|max:2048",
            
            // Validasi Matriks Penilaian
            'penilaians'           => 'required|array',
            'penilaians.*.cpmk_id' => 'required|exists:cpmks,id',
            'penilaians.*.quiz'    => 'numeric|min:0|max:100',
            'penilaians.*.tugas'   => 'numeric|min:0|max:100',
            'penilaians.*.project' => 'numeric|min:0|max:100',
            'penilaians.*.uts'     => 'numeric|min:0|max:100',
            'penilaians.*.uas'     => 'numeric|min:0|max:100',

            // Validasi Detail Mingguan
            'details'                        => 'required|array',
            'details.*.minggu_ke'            => 'required|string|max:10',
            'details.*.kemampuan_akhir'      => 'required|string',
            'details.*.indikator'            => 'required|string',
            'details.*.bahan_kajian'         => 'required|string',
            'details.*.metode_pembelajaran'  => 'required|string',
            'details.*.estimasi_waktu'       => 'required|string',
            'details.*.pengalaman_belajar'   => 'nullable|string',
            'details.*.penilaian_komponen'   => 'nullable|string',
            'details.*.penilaian_bobot'      => 'numeric|min:0|max:100',
        ]);
    }
}