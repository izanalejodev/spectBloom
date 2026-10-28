<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'nombre'            => 'required|string',
            'email'             => 'required|email|unique:user',
            'password'          => 'required|min:6',
            'confirmarPassword' => 'required|same:password',
            'rol'               => 'required|string',
            'fotoPerfil'        => 'nullable|image|max:2048',  
        ]);

        $fotoUrl = null;

        if ($request->hasFile('fotoPerfil')) {
            $path = $request->file('fotoPerfil')->store('fotos', 'public');
            $fotoUrl = asset('storage/' . $path);
        }

        $user = User::create([
            'nombre'     => $request->nombre,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
            'rol'        => $request->rol,
            'fotoPerfil' => $fotoUrl,  
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message'      => 'Usuario creado correctamente',
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => $user, 
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
        return response()->json(['message' => 'El usuario no existe'], 404);
    }

    if (!Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Credenciales incorrectas'], 401);
    }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message'      => 'Login exitoso',
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => [
                'id'         => $user->id, 
                'nombre'     => $user->nombre,
                'email'      => $user->email,
                'rol'        => $user->rol,
                'fotoPerfil' => $user->fotoPerfil,  
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logout correcto']);
    }
}