<?php

namespace App\Http\Controllers;

use App\Models\Iea;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IeaController extends Controller
{
    /**
     * Menampilkan halaman khusus input IEA
     */
    public function index()
    {
        // Ambil semua data IEA untuk ditampilkan di tabel bawah form
        $ieas = Iea::orderBy('id', 'asc')->get();
        
        return Inertia::render('Iea/page', [
            'ieas' => $ieas
        ]);
    }

    /**
     * Menyimpan data IEA baru dengan kode abjad otomatis
     */
    public function store(Request $request)
    {
        // 1. Validasi hanya deskripsi yang diinput
        $request->validate([
            'deskripsi' => 'required|string|min:5',
        ]);

        // 2. Logika Abjad Otomatis (A, B, C ... Z, AA, AB)
        $count = Iea::count();
        $letter = 'A'; // Dimulai dari A
        
        // Looping untuk menaikkan huruf sebanyak jumlah data yang ada
        for ($i = 0; $i < $count; $i++) {
            $letter++; 
        }

        // Format kode menjadi IEA_A, IEA_B, dst.
        $generatedKode = 'IEA_' . $letter;

        // 3. Simpan ke database
        Iea::create([
            'kode' => $generatedKode,
            'deskripsi' => $request->deskripsi,
        ]);

        return redirect()->back()->with('success', "Berhasil menambah $generatedKode");
    }
}