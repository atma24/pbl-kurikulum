<?php

namespace App\Http\Controllers;

use App\Models\DosenBiodata;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class DosenBiodataController extends Controller
{
    public function index()
    {
        $biodatas = DosenBiodata::latest()->get();
        
        $biodatas->each(function ($biodata) {
            $user = \App\Models\User::where('dosen_biodata_id', $biodata->id)
                ->select('id', 'dosen_biodata_id', 'email')
                ->first();
            $biodata->user = $user;
        });

        return Inertia::render('DosenBiodata/page', [
            'biodatas' => $biodatas,
        ]);
    }

    public function store(Request $request)
    {
        DosenBiodata::create($this->validatedData($request));

        return redirect()->back()->with('success', 'Biodata dosen berhasil ditambahkan.');
    }

    public function update(Request $request, DosenBiodata $dosenBiodata)
    {
        $dosenBiodata->update($this->validatedData($request, $dosenBiodata->id));

        return redirect()->back()->with('success', 'Biodata dosen berhasil diperbarui.');
    }

    public function destroy(DosenBiodata $dosenBiodata)
    {
        $userExists = \App\Models\User::where('dosen_biodata_id', $dosenBiodata->id)->exists();
        
        if ($userExists) {
            return redirect()->back()->withErrors([
                'biodata' => 'Biodata dosen tidak dapat dihapus karena sudah terhubung ke akun dosen.',
            ]);
        }

        $dosenBiodata->delete();

        return redirect()->back()->with('success', 'Biodata dosen berhasil dihapus.');
    }

    private function validatedData(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'nama_lengkap' => ['required', 'string', 'max:255'],
            'gelar_depan' => ['nullable', 'string', 'max:50'],
            'gelar_belakang' => ['nullable', 'string', 'max:50'],
            'nip' => ['required', 'string', 'max:50', Rule::unique('dosen_biodatas', 'nip')->ignore($ignoreId)],
            'nidn' => ['required', 'string', 'max:50', Rule::unique('dosen_biodatas', 'nidn')->ignore($ignoreId)],
            'email' => ['required', 'email', 'max:255', Rule::unique('dosen_biodatas', 'email')->ignore($ignoreId)],
            'no_hp' => ['nullable', 'string', 'max:30'],
            'prodi' => ['required', 'string', 'max:255'],
            'jabatan_akademik' => ['required', 'string', 'max:100'],
            'bidang_keahlian' => ['nullable', 'string'],
            'alamat' => ['nullable', 'string'],
        ]);
    }
}
