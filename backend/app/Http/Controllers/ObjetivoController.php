<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Objetivo;

class ObjetivoController extends Controller
{
    public function store(Request $request)
    {

        $request->validate([
            'Titulo' => 'required',
            'KidID' => 'required',
            'TipoObjetivoID' => 'nullable',
            'PictoID' => 'required|integer',
            'PictoIDRecompensa' => 'nullable',
            'Descripcion' => 'nullable',
            'Fecha_inicio' => 'nullable|date',
            'Fecha_fin' => 'nullable|date',
            'Recompensa' => 'nullable',
            'Perfil'         => 'nullable|in:TEA,TDAH',
            'Marcas' => 'nullable|array',
        ]);
        Objetivo::create($request->all());
    }

    public function index(Request $request)
    {
        $kidId = $request->query('KidID');

        if ($kidId) {
            return Objetivo::with('pictograma', 'pictogramaRecompensa')->where('KidID', $kidId)->get();
        }
        return response()->json([]);
    }

    public function destroy($id)
    {
        $Objetivo = Objetivo::findorfail($id);
        $Objetivo->delete();
    }

    public function update($id, Request $request)
    {
        $Objetivo = Objetivo::findorfail($id);
        $Objetivo->update($request->all());
    }
    public function updateMarcas($id, Request $request)
    {
        $objetivo = Objetivo::findOrFail($id);
        $objetivo->update(['Marcas' => $request->input('Marcas')]);
        return response()->json(['ok' => true]);
    }
}
