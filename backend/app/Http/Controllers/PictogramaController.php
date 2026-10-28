<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pictograma;

class PictogramaController extends Controller
{
    public function store(Request $request){
        $request->validate([
            'Titulo' => 'required|string|max:255',
            'URL'    => 'required|string|max:500',
        ]);

        $picto = Pictograma::firstOrCreate(
            ['URL'    => $request->URL],
            ['Titulo' => $request->Titulo]
        );

        return response()->json($picto, 201);
    }
}