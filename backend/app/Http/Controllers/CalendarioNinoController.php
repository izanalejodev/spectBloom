<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CalendarioNinoController extends Controller
{
    public function getActividadesHoy($kidId)
    {
        $hoy = date('Y-m-d');

        $actividades = DB::table('actividades as a')
            ->join('actividades_kid as ak', 'a.UniqueID', '=', 'ak.ActividadID')
            ->leftJoin('relacion_actividades as ra', 'a.UniqueID', '=', 'ra.ActividadID')
            ->where('ak.KidID', $kidId)
            ->where('a.Fecha', $hoy)
            ->select(
                'a.UniqueID as id',
                'a.Titulo as titulo',
                'ra.PictoID as PictoID',
                'a.completada as completada'
            )
            ->get();

        return response()->json($actividades);
    }

    public function completarActividad($id)
    {
        $actividad = DB::table('actividades')->where('UniqueID', $id)->first();

        if (!$actividad) {
            return response()->json(['error' => 'Actividad no encontrada'], 404);
        }

        $nuevoEstado = $actividad->completada ? 0 : 1;

        DB::table('actividades')
            ->where('UniqueID', $id)
            ->update(['completada' => $nuevoEstado]);

        return response()->json(['completada' => $nuevoEstado]);
    }

    public function guardarEmocion(Request $request)
    {
        $request->validate([
            'KidID' => 'required|integer',
            'TipoEstadoID' => 'required|integer',
        ]);

        $hoy = date('Y-m-d');

        $existe = DB::table('estado_kid')
            ->where('KidID', $request->KidID)
            ->where('Fecha', $hoy)
            ->first();

        if ($existe) {
            DB::table('estado_kid')
                ->where('KidID', $request->KidID)
                ->where('Fecha', $hoy)
                ->update(['TipoEstadoID' => $request->TipoEstadoID]);
        } else {
            DB::table('estado_kid')->insert([
                'KidID' => $request->KidID,
                'TipoEstadoID' => $request->TipoEstadoID,
                'Fecha' => $hoy,
            ]);
        }

        return response()->json(['mensaje' => 'Emoción guardada correctamente']);
    }

    public function getNino($id){
        $nino = DB::table('kid')->where('KidID', '$id')->first();
        return response()->json($nino);
    }
}