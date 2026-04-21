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

    // Fungsi sync tetap di sini karena ini spesifik hubungan antar entitas di matriks
    public function syncCplIea(Request $request)
    {
        $request->validate([
            'cpl_id' => 'required|exists:cpls,id',
            'iea_id' => 'required|exists:ieas,id',
            'is_selected' => 'required|boolean'
        ]);

        $cpl = Cpl::findOrFail($request->cpl_id);
        $request->is_selected ? 
            $cpl->ieas()->syncWithoutDetaching([$request->iea_id => ['is_selected' => true]]) : 
            $cpl->ieas()->detach($request->iea_id);

        return redirect()->back();
    }

    public function syncPpmIea(Request $request)
    {
        $request->validate([
            'ppm_id' => 'required|exists:ppms,id',
            'iea_id' => 'required|exists:ieas,id',
            'is_selected' => 'required|boolean'
        ]);

        $ppm = Ppm::findOrFail($request->ppm_id);
        $request->is_selected ? 
            $ppm->ieas()->syncWithoutDetaching([$request->iea_id => ['is_selected' => true]]) : 
            $ppm->ieas()->detach($request->iea_id);

        return redirect()->back();
    }
}