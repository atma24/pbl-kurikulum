<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class DosenController extends Controller
{
    public function index()
    {
        // Mengambil semua user yang memiliki role 'Dosen'
        $dosens = User::role('Dosen')->get();
        
        return Inertia::render('Dosen/Index', [
            'dosens' => $dosens
        ]);
    }

    public function create()
    {
        return Inertia::render('Dosen/Create');
    }

    public function store(Request $request)
    {
        // Validasi ketat (NIP dan Email tidak boleh duplikat)
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'nip' => 'required|string|max:50|unique:users',
            'password' => 'required|string|min:8', // Tambahkan '|confirmed' jika ingin input 2 kali
        ]);

        // Eksekusi insert data
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'nip' => $validated['nip'],
            'password' => Hash::make($validated['password']),
        ]);

        // Suntikkan Role Dosen
        $user->assignRole('Dosen');

        // Redirect ke tabel daftar dosen
        return redirect()->route('dosen.index')->with('success', 'Akun Dosen berhasil didaftarkan.');
    }
}