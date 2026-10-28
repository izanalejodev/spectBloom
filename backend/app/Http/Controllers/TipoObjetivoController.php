<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TipoObjetivo;

class TipoObjetivoController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $tiposActividad = TipoObjetivo::where('id', $user->id)->get();
        return response()->json($tiposActividad);
    }
    public function store(Request $request)
    {
        $request->validate([
            'Nombre' => 'required'
        ]);
        $user = $request->user();

        TipoObjetivo::create([
            'Nombre' => $request->Nombre,
            'id'     => $user->id,
        ]);
        return response()->json(['message' => 'Tipo creado'], 201);
    }

    public function update($id, Request $request) {
        $tipo = TipoObjetivo::findOrFail($id);
        $tipo->update($request->all());
    }

    public function destroy($id) {
        $tipo = TipoObjetivo::findOrFail($id);
        $tipo->objetivos()->update(['TipoObjetivoID' => null]); // ← evita FK error
        $tipo->delete();
    }
}