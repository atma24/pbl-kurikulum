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
        $cpls = Cpl::with('ieas')->get(); 
        $ieas = Iea::with(['cpls', 'ppms'])->get();
        $ppms = Ppm::with('ieas')->get();

        // 2. Optimasi pemetaan IEA untuk setiap PPM
        $ppmIeaMap = [];
        foreach ($ppms as $ppm) {
            $ppmIeaMap[$ppm->id] = $ppm->ieas->pluck('id')->toArray();
        }

        // 3. Hitung relasi CPL→PPM secara transitif (Otomatis)
        $cplToPpmMatrix = [];
        foreach ($cpls as $cpl) {
            $cplIeaIds = $cpl->ieas->pluck('id')->toArray();
            
            foreach ($ppms as $ppm) {
                // Jika ada IEA yang sama antara CPL dan PPM, maka true
                $cplToPpmMatrix[$cpl->id][$ppm->id] = !empty(array_intersect($cplIeaIds, $ppmIeaMap[$ppm->id]));
            }
        }

        // 4. Kirim data ke frontend React
        return Inertia::render('Matrix/page', [
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
        
        if ($request->is_selected) {
            $cpl->ieas()->syncWithoutDetaching([$request->iea_id => ['is_selected' => true]]);
        } else {
            $cpl->ieas()->detach($request->iea_id);
        }

        return redirect()->back();
    }
}