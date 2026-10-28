<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Actividad extends Model
{
    public $timestamps = false;
    
    protected $table = 'actividades';
    protected $primaryKey = 'UniqueID'; 

    protected $fillable = [
        'Titulo',
        'Descripcion',
        'Fecha',
        'Localizacion',
        'Tipo_ActividadesID',
        'Hora',
        'KidID',
        'PictoID'
    ];

    public function pictograma() {
    return $this->belongsTo(Pictograma::class, 'PictoID', 'PictoID');
}
}
