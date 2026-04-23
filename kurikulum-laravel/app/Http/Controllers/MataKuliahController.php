<?php

namespace App\Http\Controllers;

use App\Models\MataKuliah;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MataKuliahController extends Controller
{
    /**
     * Menampilkan daftar mata kuliah
     */
    public function index()
    {
        return Inertia::render('MataKuliah/page', [
            'mata_kuliahs' => MataKuliah::orderBy('kode_mk', 'asc')->get()
        ]);
    }

    /**
     * Menyimpan mata kuliah baru
     */
    public function store(Request $request)
    {
        $request->validate([
            'kode_mk' => 'required|string|max:20|unique:mata_kuliahs,kode_mk',
            'nama_mk' => 'required|string|max:255',
            'sks'     => 'required|integer|min:1|max:8',
        ]);

        MataKuliah::create([
            'kode_mk' => $request->kode_mk,
            'nama_mk' => $request->nama_mk,
            'sks'     => $request->sks,
        ]);

        return redirect()->back()->with('success', 'Mata Kuliah berhasil ditambahkan!');
    }

    /**
     * Memperbarui data mata kuliah
     */
    public function update(Request $request, MataKuliah $mataKuliah)
    {
        $request->validate([
            'kode_mk' => 'required|string|max:20|unique:mata_kuliahs,kode_mk,' . $mataKuliah->id,
            'nama_mk' => 'required|string|max:255',
            'sks'     => 'required|integer|min:1|max:8',
        ]);

        $mataKuliah->update($request->only('kode_mk', 'nama_mk', 'sks'));

        return redirect()->back()->with('success', 'Mata Kuliah berhasil diperbarui!');
    }

    /**
     * Menghapus mata kuliah
     */
    public function destroy(MataKuliah $mataKuliah)
    {
        // Catatan: Karena kita menggunakan cascade di migrasi, 
        // menghapus MK akan otomatis menghapus CPMK di dalamnya.
        $mataKuliah->delete();

        return redirect()->back()->with('success', 'Mata Kuliah berhasil dihapus dari sistem!');
    }
}