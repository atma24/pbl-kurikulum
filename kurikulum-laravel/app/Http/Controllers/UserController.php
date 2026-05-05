<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    // Menampilkan daftar rakyat di Dashboard Kaprodi
    public function index() 
    {
        return Inertia::render('Users/Index', [
            'users' => User::with('roles')->get(),
            'roles' => \Spatie\Permission\Models\Role::pluck('name')
        ]);
    }

    // Merekrut Dosen baru
    public function store(Request $request) 
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
            'role' => 'required|exists:roles,name'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $user->assignRole($validated['role']);

        return redirect()->back()->with('success', 'Welcome.');
    }
}