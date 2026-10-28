<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class GoogleAuthController extends Controller
{
    public function handleGoogleToken(Request $request)
    {
        try {
            $token = $request->token;

            // Verificar el token directamente con la API de Google
            $response = file_get_contents(
                'https://oauth2.googleapis.com/tokeninfo?id_token=' . $token
            );

            $googleUser = json_decode($response, true);

            // Comprobar que el token es válido 
            if (!$googleUser || !isset($googleUser['email'])) {
                return response()->json(['message' => 'Token inválido'], 401);
            }

            
            $user = User::where('email', $googleUser['email'])->first();

            if (!$user) {
                $user = User::create([
                    'nombre'     => $googleUser['name']    ?? 'Usuario Google',
                    'email'      => $googleUser['email'],
                    'password'   => Hash::make(Str::random(24)),
                    'rol'        => 'familiar',
                    'fotoPerfil' => $googleUser['picture'] ?? null,
                ]);
            }

            
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
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

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al autenticar con Google',
                'error'   => $e->getMessage()
            ], 401);
        }
    }
}