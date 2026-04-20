<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Cpl;
use App\Models\Iea;
use App\Models\Ppm;
use App\Models\MataKuliah;

class MatrixController extends Controller
{
    /**
     * Menampilkan halaman Matriks (Frontend React)
     */
    public function index()
    {
        // 1. Ambil semua data master
        // Kita gunakan with() untuk langsung menarik data relasinya (pivot)
        $cpls = Cpl::with(['ieas', 'ppms'])->get();
        $mataKuliahs = MataKuliah::with('cpls')->get();
        
        $ieas = Iea::all();
        $ppms = Ppm::all();

        // 2. Kirim data ke frontend React (ke dalam folder resources/js/Pages/Matrix/Index.tsx)
        return Inertia::render('Matrix/Index', [
            'cpls' => $cpls,
            'ieas' => $ieas,
            'ppms' => $ppms,
            'mataKuliahs' => $mataKuliahs
        ]);
    }

    /**
     * Menyimpan/Mengupdate centangan Matriks CPL ke IEA
     */
    public function syncCplIea(Request $request)
    {
        $request->validate([
            'cpl_id' => 'required|exists:cpls,id',
            'iea_id' => 'required|exists:ieas,id',
            'is_selected' => 'required|boolean'
        ]);

        $cpl = Cpl::findOrFail($request->cpl_id);
        
        // Update relasi di tabel pivot cpl_iea
        if ($request->is_selected) {
            $cpl->ieas()->syncWithoutDetaching([$request->iea_id => ['is_selected' => true]]);
        } else {
            $cpl->ieas()->detach($request->iea_id);
        }

        return redirect()->back()->with('success', 'Matriks CPL-IEA berhasil diperbarui!');
    }
}