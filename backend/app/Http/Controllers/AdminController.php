<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminController extends Controller
{
    public function index()
    {
        $users = User::where('rol', '!=', 'admin')
                     ->select('id', 'nombre', 'email', 'rol', 'fotoPerfil')
                     ->get();

        return response()->json($users);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre'   => 'required|string',
            'email'    => 'required|email|unique:user',
            'password' => 'required|min:6',
            'rol'      => 'required|in:familiar,comun',
        ]);

        $user = User::create([
            'nombre'     => $request->nombre,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
            'rol'        => $request->rol,
            'fotoPerfil' => null,
        ]);

        return response()->json([
            'message' => 'Usuario creado correctamente',
            'user'    => $user,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::where('id', $id)->where('rol', '!=', 'admin')->firstOrFail();

        $request->validate([
            'nombre'   => 'sometimes|string',
            'email'    => 'sometimes|email|unique:user,email,' . $id,
            'password' => 'sometimes|min:6',
            'rol'      => 'sometimes|in:familiar,comun',
        ]);

        $data = $request->only(['nombre', 'email', 'rol']);

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return response()->json([
            'message' => 'Usuario actualizado correctamente',
            'user'    => $user,
        ]);
    }

    public function destroy($id)
{
    $user = User::where('id', $id)->where('rol', '!=', 'admin')->firstOrFail();
    
    $user->kids()->detach();
    
    $user->delete();

    return response()->json(['message' => 'Usuario eliminado correctamente']);
}
}