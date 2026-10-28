<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Objetivo extends Model
{
    public $timestamps = false;

    protected $table = 'objetivo';
    protected $primaryKey = 'ObjetivoID';

    protected $fillable = [
        'KidID',
        'TipoObjetivoID',
        'PictoID',
        'PictoIDRecompensa',
        'Titulo',
        'Descripcion',
        'Fecha_inicio',
        'Fecha_fin',
        'Recompensa',
        'Perfil',
        'Marcas',
        'RecompensaPequena',
        'RecompensaMediana', 
        'RecompensaGrande',
    ];
    protected $casts = [
        'Marcas' => 'array'
    ];
    public function objetivos()
    {
        return $this->hasMany(Objetivo::class, 'TipoObjetivoID', 'UniqueID');
    }
    public function pictograma()
    {
        return $this->belongsTo(Pictograma::class, 'PictoID', 'PictoID');
    }
    public function pictogramaRecompensa()
    {
        return $this->belongsTo(Pictograma::class, 'PictoIDRecompensa', 'PictoID');
    }
}
