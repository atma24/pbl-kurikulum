<?php

namespace App\Http\Controllers;

use App\Models\Rps;
use App\Models\MataKuliah;
use App\Models\DosenBiodata;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
class RpsController extends Controller
{
    public function index()
    {
        $rps = Rps::with(['mataKuliah:id,kode_mk,nama_mk', 'penilaians', 'details'])->get();
        
        $rps->each(function ($item) {
            if ($item->dosen_biodata_id) {
                $item->dosenBiodata = DosenBiodata::find($item->dosen_biodata_id);
            }
        });
        
        $mataKuliahs = MataKuliah::select('id', 'kode_mk', 'nama_mk')->get();
        $allDosen = DosenBiodata::orderBy('nama_lengkap')->get();

        return Inertia::render('Rps/page', [
            'rps' => $rps,
            'mataKuliahs' => $mataKuliahs,
            'allDosen' => $allDosen,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateRps($request);

        DB::transaction(function () use ($validated, $request) {
            $rps = Rps::create([
                'mata_kuliah_id'     => $validated['mata_kuliah_id'],
                'dosen_biodata_id'   => 'required|exists:central.dosen_biodatas,id',
                'tahun_akademik'     => $validated['tahun_akademik'],
                'tanggal_penyusunan' => $validated['tanggal_penyusunan'],
                'pustaka_utama'      => $validated['pustaka_utama'],
                'pustaka_pendukung'  => $validated['pustaka_pendukung'] ?? null,
                'bahan_kajian_utama' => $validated['bahan_kajian_utama'],
                // Simpan 3 file
                'tte_dosen'          => $request->file('tte_dosen')->store('rps_tte', 'public'),
                'tte_kaprodi'        => $request->file('tte_kaprodi')->store('rps_tte', 'public'),
                'tte_kajur'          => $request->file('tte_kajur')->store('rps_tte', 'public'),
                'kode_dokumen'       => $validated['kode_dokumen'],
            ]);

            $rps->penilaians()->createMany($validated['penilaians']);
            $rps->details()->createMany($validated['details']);
        });

        return redirect()->route('rps.index')->with('success', 'RPS berhasil ditempa.');
    }

    // Bypass error huruf "s" dengan memakai $id
    public function update(Request $request, $id)
    {
        $rps = Rps::findOrFail($id);
        $validated = $this->validateRps($request, true);

        DB::transaction(function () use ($validated, $request, $rps) {
            $data = [
                'mata_kuliah_id'     => $validated['mata_kuliah_id'],
                'dosen_biodata_id'   => $validated['dosen_biodata_id'],
                'tahun_akademik'     => $validated['tahun_akademik'],
                'tanggal_penyusunan' => $validated['tanggal_penyusunan'],
                'pustaka_utama'      => $validated['pustaka_utama'],
                'pustaka_pendukung'  => $validated['pustaka_pendukung'] ?? null,
                'bahan_kajian_utama' => $validated['bahan_kajian_utama'],
                'kode_dokumen'       => $validated['kode_dokumen'],
            ];

            // Cek dan ganti masing-masing TTE jika ada file baru
            $ttes = ['tte_dosen', 'tte_kaprodi', 'tte_kajur'];
            foreach ($ttes as $tte) {
                if ($request->hasFile($tte)) {
                    if ($rps->$tte) Storage::disk('public')->delete($rps->$tte);
                    $data[$tte] = $request->file($tte)->store('rps_tte', 'public');
                }
            }

            $rps->update($data);

            $rps->penilaians()->delete();
            $rps->penilaians()->createMany($validated['penilaians']);

            $rps->details()->delete();
            $rps->details()->createMany($validated['details']);
        });

        return redirect()->route('rps.index')->with('success', 'RPS berhasil diperbarui.');
    }

    // Bypass error huruf "s" dengan memakai $id
    public function destroy($id)
    {
        $rps = Rps::findOrFail($id);

        // Hapus ketiga file fisiknya
        $ttes = ['tte_dosen', 'tte_kaprodi', 'tte_kajur'];
        foreach ($ttes as $tte) {
            if ($rps->$tte) Storage::disk('public')->delete($rps->$tte);
        }
        
        $rps->delete(); 
        
        return redirect()->back()->with('success', 'RPS berhasil dilenyapkan.');
    }

    private function validateRps(Request $request, $isUpdate = false)
    {
        $tteRule = $isUpdate ? 'nullable' : 'required';

        return $request->validate([
            'mata_kuliah_id'     => 'required|exists:mata_kuliahs,id',
            'dosen_biodata_id'   => 'required|exists:dosen_biodatas,id',
            'tahun_akademik'     => 'required|string|max:20',
            'tanggal_penyusunan' => 'required|date',
            'pustaka_utama'      => 'required|string',
            'pustaka_pendukung'  => 'nullable|string',
            'bahan_kajian_utama' => 'required|string', // <-- Validasi Baru
            'tte_dosen'          => "$tteRule|file|mimes:png,jpg,jpeg,pdf|max:2048",
            'tte_kaprodi'        => "$tteRule|file|mimes:png,jpg,jpeg,pdf|max:2048",
            'tte_kajur'          => "$tteRule|file|mimes:png,jpg,jpeg,pdf|max:2048",
            'kode_dokumen'       => 'required|string',
            
            'penilaians'           => 'required|array',
            'penilaians.*.cpmk_id' => 'required|exists:cpmks,id',
            'penilaians.*.quiz'    => 'numeric|min:0|max:100',
            'penilaians.*.tugas'   => 'numeric|min:0|max:100',
            'penilaians.*.project' => 'numeric|min:0|max:100',
            'penilaians.*.uts'     => 'numeric|min:0|max:100',
            'penilaians.*.uas'     => 'numeric|min:0|max:100',

            'details'                        => 'required|array',
            'details.*.pertemuan_ke'         => 'required|string|max:10',
            'details.*.kemampuan_akhir'      => 'required|string',
            'details.*.indikator'            => 'required|string',
            'details.*.bahan_kajian'         => 'required|string',
            'details.*.metode_pembelajaran'  => 'required|string',
            'details.*.estimasi_waktu'       => 'required|string',
            'details.*.pengalaman_belajar'   => 'nullable|string',
            'details.*.penilaian_komponen'   => 'nullable|string',
            'details.*.penilaian_bobot'      => 'numeric|min:0|max:100',
        ]);
    }
// BUKA DI BROWSER (Preview)
    public function printPdf($id)
    {
        $rps = Rps::with([
            'mataKuliah.cpmks.indikatorKinerjas.cpl', 
            'penilaians.cpmk', 
            'details',
            'mataKuliah.prasyarat',
        ])->findOrFail($id);

        if ($rps->dosen_biodata_id) {
            $rps->dosenBiodata = DosenBiodata::find($rps->dosen_biodata_id);
        }

        $pdf = Pdf::loadView('pdf.rps', compact('rps'))->setPaper('a4', 'landscape');

        // Menggunakan stream() agar terbuka di tab baru
        return $pdf->stream('RPS_' . $rps->mataKuliah->kode_mk . '.pdf');
    }

    // LANGSUNG DOWNLOAD KE LAPTOP
    public function downloadPdf($id)
    {
        $rps = Rps::with([
            'mataKuliah.cpmks.indikatorKinerjas.cpl', 
            'penilaians.cpmk', 
            'details',
            'mataKuliah.prasyarat',
        ])->findOrFail($id);

        if ($rps->dosen_biodata_id) {
            $rps->dosenBiodata = DosenBiodata::find($rps->dosen_biodata_id);
        }

        $pdf = Pdf::loadView('pdf.rps', compact('rps'))->setPaper('a4', 'landscape');

        // Menggunakan download() agar memaksa browser mengunduh file
        return $pdf->download('RPS_' . $rps->mataKuliah->kode_mk . '.pdf');
    }
}
