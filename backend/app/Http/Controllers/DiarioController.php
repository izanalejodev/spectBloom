<?php

namespace App\Http\Controllers;

use App\Models\DiarioEntrada;
use Illuminate\Http\Request;

class DiarioController extends Controller
{
    // GET /api/diario/{kidId}
    public function index(Request $request, $kidId)
    {
        $entradas = DiarioEntrada::where('kid_id', $kidId)
            ->where('kid_id', $kidId)
            ->where('user_id', $request->user()->id)
            ->orderBy('Fecha', 'desc')
            ->get()
            ->map(fn($e) => $this->formatear($e));

        return response()->json($entradas);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'kid_id'          => 'required|integer',
            'fecha'           => 'required|date',
            'estado'          => 'required|string|max:20',
            'descripcion'     => 'required|string|max:1000',
            'comportamientos' => 'nullable|array',
            'logros'          => 'nullable|string|max:500',
            'notas'           => 'nullable|string|max:500',
        ]);

        $entrada = DiarioEntrada::create([
            'user_id' => $request->user()->id,
            'kid_id'          => $data['kid_id'],
            'Fecha'           => $data['fecha'],
            'estado'          => $data['estado'],
            'Contenido'       => $data['descripcion'],
            'comportamientos' => json_encode($data['comportamientos'] ?? []),
            'logros'          => $data['logros'] ?? null,
            'notas'           => $data['notas'] ?? null,
        ]);

        return response()->json($this->formatear($entrada), 201);
    }

    
    public function update(Request $request, $id)
    {
        $entrada = DiarioEntrada::where('DiarioID', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $data = $request->validate([
            'fecha'           => 'required|date',
            'estado'          => 'required|string|max:20',
            'descripcion'     => 'required|string|max:1000',
            'comportamientos' => 'nullable|array',
            'logros'          => 'nullable|string|max:500',
            'notas'           => 'nullable|string|max:500',
        ]);

        $entrada->update([
            'Fecha'           => $data['fecha'],
            'estado'          => $data['estado'],
            'Contenido'       => $data['descripcion'],
            'comportamientos' => json_encode($data['comportamientos'] ?? []),
            'logros'          => $data['logros'] ?? null,
            'notas'           => $data['notas'] ?? null,
        ]);

        return response()->json($this->formatear($entrada));
    }

    
    public function destroy(Request $request, $id)
    {
        $entrada = DiarioEntrada::where('DiarioID', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $entrada->delete();

        return response()->json(['message' => 'Entrada eliminada']);
    }

    private function formatear(DiarioEntrada $e): array
    {
        return [
            'id'              => $e->DiarioID,
            'kid_id'          => $e->kid_id,
            'fecha'           => $e->Fecha,
            'estado'          => $e->estado,
            'descripcion'     => $e->Contenido,
            'comportamientos' => json_decode($e->comportamientos ?? '[]'),
            'logros'          => $e->logros,
            'notas'           => $e->notas,
        ];
    }
}