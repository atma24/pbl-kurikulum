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

        // Ambil semua user yang punya dosen_biodata_id dari tenant DB
        $users = \App\Models\User::whereNotNull('dosen_biodata_id')
            ->select('id', 'dosen_biodata_id', 'email')
            ->get()
            ->keyBy('dosen_biodata_id'); // index by dosen_biodata_id biar O(1)

        // Map manual karena cross-DB
        $biodatas->each(function ($biodata) use ($users) {
            $biodata->user = $users->get($biodata->id);
        });

        return Inertia::render('DosenBiodata/page', [
            'biodatas' => $biodatas,
        ]);
    }

    public function store(Request $request)
    {
        $request->merge([
            'nip'  => $this->normalizeEmptyToNull($request->nip),
            'nidn' => $this->normalizeEmptyToNull($request->nidn),
        ]);

        DosenBiodata::create($this->validatedData($request));
        return redirect()->back()->with('success', 'Biodata dosen berhasil ditambahkan.');
    }

    public function update(Request $request, DosenBiodata $dosenBiodata)
    {
        $request->merge([
            'nip'  => $this->normalizeEmptyToNull($request->nip),
            'nidn' => $this->normalizeEmptyToNull($request->nidn),
        ]);

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
    private function normalizeEmptyToNull(?string $value): ?string
    {
        if ($value === null) return null;
        $trimmed = trim($value);
        return ($trimmed === '' || $trimmed === '-') ? null : $trimmed;
    }
    private function validatedData(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'nama_lengkap' => ['required', 'string', 'max:255'],
            'gelar_depan' => ['nullable', 'string', 'max:50'],
            'gelar_belakang' => ['nullable', 'string', 'max:50'],
            'nip'  => ['nullable', 'string', 'max:50', Rule::unique('dosen_biodatas', 'nip')->ignore($ignoreId)->whereNotNull('nip')],
            'nidn' => ['nullable', 'string', 'max:50', Rule::unique('dosen_biodatas', 'nidn')->ignore($ignoreId)->whereNotNull('nidn')],
            'email' => ['required', 'email', 'max:255', Rule::unique('dosen_biodatas', 'email')->ignore($ignoreId)],
            'no_hp' => ['nullable', 'string', 'max:30'],
            'prodi' => ['required', 'string', 'max:255'],
            'jabatan_akademik' => ['required', 'string', 'max:100'],
            'bidang_keahlian' => ['nullable', 'string'],
            'alamat' => ['nullable', 'string'],
        ]);
    }
}
