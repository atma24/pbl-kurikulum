<?php

namespace App\Http\Controllers;

use App\Models\Cpmk;
use App\Models\MataKuliah;
use App\Models\IndikatorKinerja;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CpmkController extends Controller
{
    /**
     * Menampilkan daftar CPMK berdasarkan Mata Kuliah tertentu
     */
    public function index($mataKuliahId)
    {
        $mk = MataKuliah::with('cpmks.indikatorKinerjas')->findOrFail($mataKuliahId);
        $allIndikators = IndikatorKinerja::all(); // Untuk pilihan di form

        return Inertia::render('Cpmk/Index', [
            'mataKuliah' => $mk,
            'allIndikators' => $allIndikators
        ]);
    }

    /**
     * Menempa CPMK baru dan mengikatnya dengan Indikator Kinerja
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'mata_kuliah_id' => 'required|exists:mata_kuliahs,id',
            'kode_cpmk' => 'required|string',
            'deskripsi' => 'required|string',
            'indikator_ids' => 'required|array', // Array ID Indikator Kinerja
            'indikator_ids.*' => 'exists:indikator_kinerjas,id'
        ]);

        $cpmk = Cpmk::create([
            'mata_kuliah_id' => $validated['mata_kuliah_id'],
            'kode_cpmk' => $validated['kode_cpmk'],
            'deskripsi' => $validated['deskripsi'],
        ]);

        // Ritual pengikatan Many-to-Many
        $cpmk->indikatorKinerjas()->sync($validated['indikator_ids']);

        return redirect()->back()->with('success', 'CPMK telah berhasil ditempa dan diikat pada Indikator.');
    }

    /**
     * Melenyapkan CPMK dari sejarah
     */
    public function destroy(Cpmk $cpmk)
    {
        $cpmk->delete();
        return redirect()->back()->with('success', 'CPMK telah dilenyapkan.');
    }
}