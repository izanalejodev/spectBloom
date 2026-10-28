<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quedada extends Model
{
    protected $table      = 'quedadas';
    protected $primaryKey = 'QuedadaID';   

    protected $fillable = [
        'id',            // user_id 
        'Titulo',
        'tipo',
        'descripcion',
        'Fecha',
        'Hora',
        'lugar',
        'lat',
        'lng',
        'MaxAsistentes',
    ];

    // Creador
    public function creador()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');

    }

    
    public function participantes()
    {
        return $this->belongsToMany(
            User::class,
            'inscripcion_quedada',  
            'QuedadaID',            
            'id'                    
        )->withPivot('Fecha_Inscripcion', 'nombre_familiar', 'nombre_nino', 'edad_nino');
    }

}