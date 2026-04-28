<?php

namespace App\Http\Controllers;

use App\Models\MataKuliah;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MataKuliahController extends Controller
{
    // Menampilkan daftar Mata Kuliah ke ranah Antarmuka (Front-end)
    public function index()
    {
        $mataKuliahs = MataKuliah::all();
        return Inertia::render('MataKuliah/page', [
            'mataKuliahs' => $mataKuliahs
        ]);
    }

    // Menempa data Mata Kuliah baru
// Menempa data Mata Kuliah baru
        public function store(Request $request)
        {
            $validated = $request->validate([
                'kode_mk' => 'required|string|unique:mata_kuliahs,kode_mk',
                'nama_mk' => 'required|string|max:255',
                'sks' => 'required|integer|min:1',
                'jenis' => 'required|in:Teori,Praktek', // <-- TAMBAHAN BARU
                'deskripsi' => 'nullable|string'
            ]);

            MataKuliah::create($validated);
            return redirect()->back()->with('success', 'Pusaka Mata Kuliah berhasil ditempa.');
        }

        // Fungsi Update
        public function update(Request $request, MataKuliah $mataKuliah)
        {
            $validated = $request->validate([
                'kode_mk' => 'required|string|unique:mata_kuliahs,kode_mk,' . $mataKuliah->id,
                'nama_mk' => 'required|string|max:255',
                'sks' => 'required|integer|min:1',
                'jenis' => 'required|in:Teori,Praktek', // <-- TAMBAHAN BARU
                'deskripsi' => 'nullable|string'
            ]);

            $mataKuliah->update($validated);
            return redirect()->back()->with('success', 'Data Mata Kuliah telah berhasil diperbarui, Yang Mulia.');
        }

    // Menghapus entitas
    public function destroy(MataKuliah $mataKuliah)
    {
        $mataKuliah->delete();
        return redirect()->back()->with('success', 'Mata Kuliah telah dilenyapkan dari sejarah.');
    }

    /**
     * FUNGSI SAKTI UNTUK RPS OTOMATIS
     * Mengambil silsilah lengkap: MK -> CPL (dengan Indikator) & MK -> CPMK (dengan Indikator)
     */
    public function apiGetRpsData($id)
    {
        $mataKuliah = MataKuliah::with([
            'cpls.indikatorKinerjas', 
            'cpmks.indikatorKinerjas'
        ])->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $mataKuliah
        ]);
    }
}