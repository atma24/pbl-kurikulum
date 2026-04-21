<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Cpl;
use App\Models\Iea;
use App\Models\Ppm;

class MatrixController extends Controller
{
    public function index()
    {
        $cpls = Cpl::with('ieas')->get(); 
        $ppms = Ppm::with('ieas')->get();
        $ieas = Iea::all();

        $ppmIeaMap = [];
        foreach ($ppms as $ppm) {
            $ppmIeaMap[$ppm->id] = $ppm->ieas->pluck('id')->toArray();
        }

        $cplToPpmMatrix = [];
        foreach ($cpls as $cpl) {
            $cplIeaIds = $cpl->ieas->pluck('id')->toArray();
            foreach ($ppms as $ppm) {
                $intersection = array_intersect($cplIeaIds, $ppmIeaMap[$ppm->id]);
                $cplToPpmMatrix[$cpl->id][$ppm->id] = !empty($intersection);
            }
        }

        return Inertia::render('Matrix/page', [
            'cpls' => $cpls,
            'ieas' => $ieas,
            'ppms' => $ppms,
            'cplToPpmMatrix' => $cplToPpmMatrix
        ]);
    }

    public function syncCplIea(Request $request)
    {
        $request->validate([
            'cpl_id'      => 'required|exists:cpls,id',
            'iea_id'      => 'required|exists:ieas,id',
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

    public function syncPpmIea(Request $request)
    {
        $request->validate([
            'ppm_id'      => 'required|exists:ppms,id',
            'iea_id'      => 'required|exists:ieas,id',
            'is_selected' => 'required|boolean'
        ]);

        $ppm = Ppm::findOrFail($request->ppm_id);
        if ($request->is_selected) {
            $ppm->ieas()->syncWithoutDetaching([$request->iea_id => ['is_selected' => true]]);
        } else {
            $ppm->ieas()->detach($request->iea_id);
        }
        return redirect()->back();
    }

    // FUNGSI BARU: Tambah CPL Otomatis
    public function storeCpl(Request $request)
    {
        $request->validate([
            'deskripsi' => 'required|string|min:5',
        ]);

        $count = Cpl::count();
        $nextNumber = $count + 1;
        
        // Format menjadi CPL-01, CPL-02, dst.
        $generatedKode = 'CPL-' . str_pad($nextNumber, 2, '0', STR_PAD_LEFT);

        Cpl::create([
            'kode' => $generatedKode,
            'deskripsi' => $request->deskripsi,
        ]);

        return redirect()->back()->with('success', 'CPL Baru berhasil ditambahkan!');
    }
        public function storePpm(Request $request)
        {
        // 1. Validasi deskripsi
        $request->validate([
            'deskripsi' => 'required|string|min:5',
        ]);

        // 2. Logika Otomatisasi Kode PPM
        $count = \App\Models\Ppm::count();
        $nextNumber = $count + 1;

        // Format kode menjadi PPM-01, PPM-02, dst.
        $generatedKode = 'PPM-' . str_pad($nextNumber, 2, '0', STR_PAD_LEFT);

        // 3. Simpan ke database
        \App\Models\Ppm::create([
            'kode' => $generatedKode,
            'deskripsi' => $request->deskripsi,
        ]);

        return redirect()->back()->with('success', "Berhasil menambah $generatedKode");
    }
}