<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Actividad;

class ActividadController extends Controller
{
    public function store(Request $request){

        $request->validate([
            'Titulo'=>'required',
            'Descripcion'=>'nullable',
            'Fecha'=>'nullable|date',
            'Localizacion'=>'nullable',
            'Tipo_ActividadesID'=>'nullable',
            'Hora'=>'nullable',
            'KidID'             => 'nullable',
            'PictoID'           => 'nullable|exists:pictograma,PictoID',
        ]);
        Actividad::create($request->all());
        
    }

   public function index(Request $request){
    $kidId = $request->query('kidId');
    
     if ($kidId) {
            return Actividad::with('pictograma')
                ->where('KidID', $kidId)
                ->get();
        }
    
    return response()->json([]); 
    }

     public function destroy($id){
        $Actividad = Actividad::find($id);
        $Actividad->delete();
    }

    public function update($id, Request $request){
        $Actividad = Actividad::find($id);
        $Actividad->update($request->all());
    }
}
