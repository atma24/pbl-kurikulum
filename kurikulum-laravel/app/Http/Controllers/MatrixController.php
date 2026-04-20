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
     * Input: CPL→IEA dan PPM→IEA
     * Output: CPL→PPM (diturunkan secara transitif)
     */
    public function index()
    {
        // 1. Ambil semua data master
        $cpls = Cpl::with(['ieas', 'ppms'])->get();
        $ieas = Iea::with(['cpls', 'ppms'])->get();
        $ppms = Ppm::with(['ieas'])->get();

        // 2. Hitung relasi CPL→PPM secara transitif
        // Jika CPL terhubung ke IEA yang sama dengan PPM, maka CPL→PPM = true
        $cplToPpmMatrix = [];
        foreach ($cpls as $cpl) {
            foreach ($ppms as $ppm) {
                $cplIeaIds = $cpl->ieas->pluck('id')->toArray();
                $ppmIeaIds = $ppm->ieas->pluck('id')->toArray();
                // Transitif: apakah ada IEA yang sama?
                $cplToPpmMatrix[$cpl->id][$ppm->id] = !empty(array_intersect($cplIeaIds, $ppmIeaIds));
            }
        }

        // 3. Kirim data ke frontend React
        return Inertia::render('Matrix/Index', [
            'cpls' => $cpls,
            'ieas' => $ieas,
            'ppms' => $ppms,
            'cplToPpmMatrix' => $cplToPpmMatrix
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