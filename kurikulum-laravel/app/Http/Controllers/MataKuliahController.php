<?php

namespace App\Http\Controllers;

use App\Models\MataKuliah;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MataKuliahController extends Controller
{
    /**
     * Menampilkan daftar Mata Kuliah (Eager load prasyarat)
     */
    public function index()
    {
        $mataKuliahs = MataKuliah::with('prasyarat')->get();
        
        return Inertia::render('MataKuliah/page', [
            'mataKuliahs' => $mataKuliahs
        ]);
    }

    /**
     * Menyimpan data Mata Kuliah baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode_mk'           => 'required|string|unique:mata_kuliahs,kode_mk',
            'nama_mk'           => 'required|string|max:255',
            'sks'               => 'required|integer|min:1',
            'jenis'             => 'required|in:Teori,Praktek',
            'semester'          => 'nullable|string|max:20',
            'sifat_pengambilan' => 'nullable|string|max:50',
            'cara_pembelajaran' => 'nullable|string|max:100',
            'deskripsi'         => 'nullable|string',
            'prasyarat_id'      => 'nullable|exists:mata_kuliahs,id',
        ]);

        MataKuliah::create($validated);
        
        return redirect()->back()->with('success', 'Pusaka Mata Kuliah berhasil ditempa.');
    }

    /**
     * Memperbarui data Mata Kuliah
     */
    public function update(Request $request, MataKuliah $mataKuliah)
    {
        $validated = $request->validate([
            'kode_mk'           => 'required|string|unique:mata_kuliahs,kode_mk,' . $mataKuliah->id,
            'nama_mk'           => 'required|string|max:255',
            'sks'               => 'required|integer|min:1',
            'jenis'             => 'required|in:Teori,Praktek',
            'semester'          => 'nullable|string|max:20',
            'sifat_pengambilan' => 'nullable|string|max:50',
            'cara_pembelajaran' => 'nullable|string|max:100',
            'deskripsi'         => 'nullable|string',
            'prasyarat_id'      => 'nullable|exists:mata_kuliahs,id',
        ]);

        // Proteksi logika: Mata Kuliah tidak boleh menjadikan dirinya sendiri sebagai prasyarat
        if ($validated['prasyarat_id'] == $mataKuliah->id) {
            return redirect()->back()->withErrors(['prasyarat_id' => 'Mata kuliah tidak dapat menjadi prasyarat untuk dirinya sendiri.']);
        }

        $mataKuliah->update($validated);
        
        return redirect()->back()->with('success', 'Data Mata Kuliah telah berhasil diperbarui, Yang Mulia.');
    }

    /**
     * Menghapus entitas
     */
    public function destroy(MataKuliah $mataKuliah)
    {
        $mataKuliah->delete();
        
        return redirect()->back()->with('success', 'Mata Kuliah telah dilenyapkan dari sejarah.');
    }

    /**
     * API Get RPS Data: Mengambil silsilah lengkap MK -> CPL & CPMK
     */
    public function apiGetRpsData($id)
    {
        $mataKuliah = MataKuliah::with([
            'cpls.indikatorKinerjas', 
            'cpmks.indikatorKinerjas'
        ])->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data'   => $mataKuliah
        ]);
    }
}