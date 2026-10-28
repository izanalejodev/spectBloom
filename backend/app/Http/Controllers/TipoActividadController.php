<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TipoActividad;

class TipoActividadController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $tiposActividad = TipoActividad::where('id', $user->id)->get();
        return response()->json($tiposActividad);
    }

    public function store(Request $request)
    {
        $request->validate([
            'Nombre' => 'required'
        ]);
        $user = $request->user();

        TipoActividad::create([
            'Nombre' => $request->Nombre,
            'Color'  => $request->Color ?? '#6181ff',
            'id'     => $user->id,
        ]);
        return response()->json(['message' => 'Tipo creado'], 201);
    }

    public function destroy($id)
    {
        $tipoActividad = TipoActividad::findOrFail($id);
        $tipoActividad->actividades()->update(['Tipo_ActividadesID' => null]);
        $tipoActividad->delete();
    }

    public function update($id, Request $request)
    {
        $tipoActividad = TipoActividad::findOrFail($id);
        $tipoActividad->update($request->all());
    }
}
