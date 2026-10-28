<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Kid;

class KidController extends Controller
{
    public function index(Request $request) {
    $user = $request->user();
    $kids = $user->kids; 
    return response()->json($kids);
}

public function store(Request $request) {
    $request->validate([
        'Nombre' => 'required',
        'Apellidos' => 'required',
        'Fecha_nacimiento' => 'required|date'
    ]);
    $kid = Kid::create($request->all());

    // Asociar al usuario 
    $request->user()->kids()->attach($kid->KidID);
    return response()->json($kid, 201);
}
 public function update($id, Request $request) {
    $kid = Kid::findOrFail($id);
    $kid->update($request->all());
    return response()->json($kid); 
}

public function destroy($id) {
    $kid = Kid::findOrFail($id);
    // Primero elimina las actividades del kid
    $kid->actividades()->delete();
    // Luego desvincula de los usuarios en user_kids
    $kid->users()->detach();
    // Finalmente elimina el kid
    $kid->delete();
    return response()->json(null, 204);
}
}