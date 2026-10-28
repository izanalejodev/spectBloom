<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoActividad extends Model
{
    public $timestamps = false;
    protected $table = 'tipos_actividades';
    protected $primaryKey = 'UniqueID';
    protected $fillable = [
        'Nombre',
        'Color',
        'id'
    ];

    public function actividades()
    {
        return $this->hasMany(Actividad::class, 'Tipo_ActividadesID', 'UniqueID');
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'id', 'id');
    }
}
