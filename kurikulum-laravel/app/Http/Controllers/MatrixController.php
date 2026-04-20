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
     * Menampilkan halaman Matriks Kurikulum
     */
    public function index()
    {
        // 1. Ambil semua data master beserta relasinya ke IEA
        // Kita butuh 'ieas' untuk mengecek centangan di masing-masing tabel input
        $cpls = Cpl::with('ieas')->get(); 
        $ppms = Ppm::with('ieas')->get();
        $ieas = Iea::all();

        // 2. Optimasi: Siapkan pemetaan ID IEA untuk setiap PPM
        // Ini dilakukan agar kita tidak melakukan query berulang di dalam loop (menghindari N+1)
        $ppmIeaMap = [];
        foreach ($ppms as $ppm) {
            // Simpan array ID IEA yang dimiliki oleh PPM ini
            $ppmIeaMap[$ppm->id] = $ppm->ieas->pluck('id')->toArray();
        }

        // 3. Logika Transitif: Hitung relasi CPL ke PPM secara otomatis
        // Rumus: Jika (Himpunan IEA milik CPL) beririsan dengan (Himpunan IEA milik PPM)
        $cplToPpmMatrix = [];
        foreach ($cpls as $cpl) {
            // Ambil daftar ID IEA yang sudah dicentang untuk CPL ini
            $cplIeaIds = $cpl->ieas->pluck('id')->toArray();
            
            foreach ($ppms as $ppm) {
                // Cari irisan antara IEA di CPL dan IEA di PPM
                $intersection = array_intersect($cplIeaIds, $ppmIeaMap[$ppm->id]);
                
                // Jika hasil irisan tidak kosong, berarti mereka terhubung secara transitif
                $cplToPpmMatrix[$cpl->id][$ppm->id] = !empty($intersection);
            }
        }

        // 4. Kirim semua data ke Frontend (React/Inertia)
        return Inertia::render('Matrix/page', [
            'cpls' => $cpls,
            'ieas' => $ieas,
            'ppms' => $ppms,
            'cplToPpmMatrix' => $cplToPpmMatrix
        ]);
    }

    /**
     * Menyimpan atau menghapus relasi antara CPL dan IEA (Input Tabel 1)
     */
    public function syncCplIea(Request $request)
    {
        $request->validate([
            'cpl_id'      => 'required|exists:cpls,id',
            'iea_id'      => 'required|exists:ieas,id',
            'is_selected' => 'required|boolean'
        ]);

        $cpl = Cpl::findOrFail($request->cpl_id);
        
        if ($request->is_selected) {
            // Gunakan syncWithoutDetaching agar data lain tidak terhapus, 
            // dan tambahkan status is_selected di pivot jika diperlukan
            $cpl->ieas()->syncWithoutDetaching([
                $request->iea_id => ['is_selected' => true]
            ]);
        } else {
            // Jika un-check, hapus baris di tabel pivot
            $cpl->ieas()->detach($request->iea_id);
        }

        return redirect()->back()->with('success', 'Relasi CPL-IEA diperbarui');
    }

    /**
     * Menyimpan atau menghapus relasi antara PPM dan IEA (Input Tabel Baru)
     */
    public function syncPpmIea(Request $request)
    {
        $request->validate([
            'ppm_id'      => 'required|exists:ppms,id',
            'iea_id'      => 'required|exists:ieas,id',
            'is_selected' => 'required|boolean'
        ]);

        $ppm = Ppm::findOrFail($request->ppm_id);
        
        if ($request->is_selected) {
            $ppm->ieas()->syncWithoutDetaching([
                $request->iea_id => ['is_selected' => true]
            ]);
        } else {
            $ppm->ieas()->detach($request->iea_id);
        }

        return redirect()->back()->with('success', 'Relasi PPM-IEA diperbarui');
    }
}