<?php

namespace App\Http\Controllers;

use App\Models\Quedada;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Models\Valoracion;

class QuedadasController extends Controller
{
    
    public function index(Request $request)
    {
        $userId  = $request->user()->id;
        $quedadas = Quedada::with('participantes')->get()
                           ->map(fn($q) => $this->formatear($q, $userId));

        return response()->json($quedadas);
    }

    
    public function store(Request $request)
    {
        $data = $request->validate([
            'Titulo'        => 'required|string|max:255',
            'tipo'          => 'required|string|max:100',
            'descripcion'   => 'required|string|max:500',
            'Fecha'         => 'required|date',
            'Hora'          => 'required|date_format:H:i',
            'lugar'         => 'required|string|max:500',
            'lat'           => 'required|numeric',
            'lng'           => 'required|numeric',
            'MaxAsistentes' => 'required|integer|min:1|max:100',
        ]);

        $data['id'] = $request->user()->id;  

        $quedada = Quedada::create($data);
        $quedada->load('participantes');

        return response()->json($this->formatear($quedada, $request->user()->id), 201);
    }

    
    public function destroy(Request $request, $id)
{
    $quedada = Quedada::findOrFail($id);

    if ($quedada->id !== $request->user()->id && $request->user()->rol !== 'admin') {
        return response()->json(['message' => 'No autorizado'], 403);
    }

    $quedada->delete();
    return response()->json(['message' => 'Quedada eliminada']);
}


public function inscribirse(Request $request, $id)
{
    $data = $request->validate([
        'nombre_familiar' => 'required|string|max:100',
        'nombre_nino'     => 'required|string|max:100',
        'edad_nino'       => 'required|integer|min:0|max:18',
    ]);

    $quedada = Quedada::with('participantes')->findOrFail($id);
    $userId  = $request->user()->id;

    if ($quedada->participantes()->where('inscripcion_quedada.id', $userId)->exists()) {
        return response()->json(['message' => 'Ya estás inscrito'], 409);
    }

    if ($quedada->participantes()->count() >= $quedada->MaxAsistentes) {
        return response()->json(['message' => 'No hay plazas disponibles'], 409);
    }

    $quedada->participantes()->attach($userId, [
        'Fecha_Inscripcion' => Carbon::today()->toDateString(),
        'nombre_familiar'   => $data['nombre_familiar'],
        'nombre_nino'       => $data['nombre_nino'],
        'edad_nino'         => $data['edad_nino'],
    ]);

    $quedada->load('participantes');

    return response()->json([
        'plazas_ocupadas' => $quedada->participantes()->count(),
    ]);
}

    
    public function cancelarInscripcion(Request $request, $id)
    {
        $quedada = Quedada::with('participantes')->findOrFail($id);
        $quedada->participantes()->detach($request->user()->id);
        $quedada->load('participantes');

        return response()->json([
            'plazas_ocupadas' => $quedada->participantes()->count(),
        ]);
    }

   public function update(Request $request, $id)
{
    $quedada = Quedada::findOrFail($id);

    if ($quedada->id !== $request->user()->id && $request->user()->rol !== 'admin') {
        return response()->json(['message' => 'No autorizado'], 403);
    }

    $inscritos = $quedada->participantes()->count();

    $data = $request->validate([
        'MaxAsistentes' => "required|integer|min:$inscritos|max:100",
    ]);

    $quedada->update($data);
    $quedada->load('participantes');

    return response()->json($this->formatear($quedada, $request->user()->id));
}

    
   private function formatear(Quedada $q, int $userId): array
{
    $participantes = $q->participantes->map(function ($u) {
        $palabras  = explode(' ', trim($u->nombre));
        $iniciales = collect($palabras)->take(2)->map(fn($p) => strtoupper($p[0]))->implode('');
        return [
            'id'              => $u->id,
            'nombre'          => $u->nombre,
            'iniciales'       => $iniciales,
            'foto'            => $u->fotoPerfil,
            'nombre_familiar' => $u->pivot->nombre_familiar,
            'nombre_nino'     => $u->pivot->nombre_nino,
            'edad_nino'       => $u->pivot->edad_nino,
        ];
    })->values()->toArray();

    return [
        'id'             => $q->QuedadaID,
        'user_id'        => $q->id,
        'titulo'         => $q->Titulo,
        'tipo'           => $q->tipo,
        'descripcion'    => $q->descripcion,
        'fecha'          => $q->Fecha,
        'hora'           => $q->Hora,
        'lugar'          => $q->lugar,
        'lat'            => (float) $q->lat,
        'lng'            => (float) $q->lng,
        'plazas_totales' => $q->MaxAsistentes,
        'plazas_ocupadas'=> count($participantes),
        'inscrito'       => collect($participantes)->pluck('id')->contains($userId),
        'participantes'  => $participantes,
    ];
}
}