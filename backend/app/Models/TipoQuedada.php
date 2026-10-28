<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoQuedada extends Model
{
    protected $table    = 'tipos_quedadas';
    protected $fillable = ['nombre'];
}