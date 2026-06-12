<?php

namespace App\Http\Controllers;

use App\Models\MataKuliah;
use App\Models\DosenBiodata;
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
            'cpmks.indikatorKinerjas',
        ])->findOrFail($id);

        // Manually fetch dosen pengampus from central database
        $dosenIds = \DB::table('dosen_biodata_mata_kuliah')
            ->where('mata_kuliah_id', $id)
            ->pluck('dosen_biodata_id');
        
        $dosenPengampus = [];
        if ($dosenIds->isNotEmpty()) {
            $dosenPengampus = DosenBiodata::on('central')
                ->whereIn('id', $dosenIds)
                ->get();
        }
        
        $mataKuliah->dosen_pengampus = $dosenPengampus;

        return response()->json([
            'status' => 'success',
            'data'   => $mataKuliah
        ]);
    }

    /**
     * Halaman Kelola Dosen Pengampu per Mata Kuliah
     * Role-based: Kaprodi sees full management, Dosen sees self-management modal
     */
    public function dosenPengampu($id)
    {
        $user = auth()->user();
        $mk = MataKuliah::findOrFail($id);
        
        // Manually fetch dosen pengampus from central database
        $dosenIds = \DB::table('dosen_biodata_mata_kuliah')
            ->where('mata_kuliah_id', $id)
            ->pluck('dosen_biodata_id');
        
        $assignedDosen = [];
        if ($dosenIds->isNotEmpty()) {
            $assignedDosen = DosenBiodata::on('central')
                ->whereIn('id', $dosenIds)
                ->get();
        }
        
        if ($user->hasRole('Dosen')) {
            $dosenBiodata = $user->dosenBiodata;
            
            if (!$dosenBiodata) {
                return back()->withErrors(['error' => 'Akun Anda belum terhubung dengan biodata dosen.']);
            }
            
            $isAssigned = $dosenIds->contains($dosenBiodata->id);
            
            return Inertia::render('MataKuliah/page', [
                'mataKuliahs' => MataKuliah::with('prasyarat')->get(),
                'showSelfManagementModal' => true,
                'selfManagementData' => [
                    'mataKuliah' => $mk,
                    'dosenBiodata' => $dosenBiodata,
                    'isAssigned' => $isAssigned,
                ],
            ]);
        }
        
        $allDosen = DosenBiodata::on('central')->orderBy('nama_lengkap')->get();

        return Inertia::render('MataKuliah/DosenPengampu', [
            'mataKuliah' => $mk,
            'assignedDosen' => $assignedDosen,
            'allDosen' => $allDosen,
        ]);
    }

    /**
     * Assign dosen pengampu ke Mata Kuliah (Kaprodi or Dosen self-add)
     */
    public function attachDosen(Request $request, $id)
    {
        $user = auth()->user();
        $mk = MataKuliah::findOrFail($id);

        if ($user->hasRole('Dosen')) {
            $dosenBiodata = $user->dosenBiodata;
            
            if (!$dosenBiodata) {
                return back()->withErrors(['error' => 'Akun Anda belum terhubung dengan biodata dosen.']);
            }
            
            $mk->dosenPengampus()->syncWithoutDetaching([$dosenBiodata->id]);
            
            return redirect()->route('mata-kuliah.index')->with('success', 'Anda berhasil ditambahkan sebagai dosen pengampu.');
        }

        $validated = $request->validate([
            'dosen_biodata_id' => 'required|exists:central.dosen_biodatas,id',
        ]);

        $mk->dosenPengampus()->syncWithoutDetaching([$validated['dosen_biodata_id']]);

        return redirect()->back()->with('success', 'Dosen pengampu berhasil ditambahkan.');
    }

    /**
     * Hapus dosen pengampu dari Mata Kuliah (Kaprodi or Dosen self-remove)
     */
    public function detachDosen($mkId, $dosenId)
    {
        $user = auth()->user();
        $mk = MataKuliah::findOrFail($mkId);
        
        if ($user->hasRole('Kaprodi')) {
            \DB::table('dosen_biodata_mata_kuliah')
                ->where('mata_kuliah_id', $mkId)
                ->where('dosen_biodata_id', $dosenId)
                ->delete();

            return redirect()->back()->with('success', 'Dosen pengampu berhasil dihapus.');
        }

        if ($user->hasRole('Dosen')) {
            $dosenBiodata = $user->dosenBiodata;
            
            if (!$dosenBiodata) {
                return back()->withErrors(['error' => 'Akun Anda belum terhubung dengan biodata dosen.']);
            }
            
            if ($dosenId != $dosenBiodata->id) {
                return back()->withErrors(['error' => 'Anda hanya dapat menghapus diri sendiri.']);
            }
            
            \DB::table('dosen_biodata_mata_kuliah')
                ->where('mata_kuliah_id', $mkId)
                ->where('dosen_biodata_id', $dosenBiodata->id)
                ->delete();
            
            return redirect()->route('mata-kuliah.index')->with('success', 'Anda berhasil dihapus dari dosen pengampu.');
        }

        return back()->withErrors(['error' => 'Akses ditolak.']);
    }
}