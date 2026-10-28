<?php

namespace App\Http\Controllers;

use App\Models\TipoQuedada;

class TiposQuedadasController extends Controller
{
    public function index()
    {
        return response()->json(TipoQuedada::all());
    }
}