<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DiarioEntrada extends Model
{
    protected $table      = 'diario';
    protected $primaryKey = 'DiarioID';
    public    $timestamps = false;

    protected $fillable = [
        'user_id',        
        'kid_id',
        'Fecha',
        'estado',
        'Contenido', 
        'comportamientos',
        'logros',
        'notas',
    ];
}