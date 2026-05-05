<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SignatureController extends Controller
{
    public function edit()
    {
        return Inertia::render('Profile/SignatureForm', [
            'user' => auth()->user()->only('name', 'jabatan', 'signature_path')
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'jabatan' => 'required|string|max:255',
            'signature' => 'nullable|image|mimes:png,jpg,jpeg|max:2048', // Maks 2MB
        ]);

        $user = auth()->user();
        $data = $request->only('name', 'jabatan');

        if ($request->hasFile('signature')) {
            // Hapus TTD lama jika ada
            if ($user->signature_path) Storage::disk('public')->delete($user->signature_path);
            
            // Simpan TTD baru
            $data['signature_path'] = $request->file('signature')->store('signatures', 'public');
        }

        $user->update($data);

        return back()->with('success', 'Profil dan Tanda Tangan diperbarui.');
    }
}