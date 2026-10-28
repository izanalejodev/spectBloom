<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kid extends Model {
    public $timestamps = false;
    protected $table = 'kid';
    protected $primaryKey = 'KidID';
    protected $fillable = [
        'Nombre', 
        'Apellidos', 
        'Fecha_nacimiento'
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_kids', 'KidID', 'id');
    }

    public function actividades()
    {
        return $this->hasMany(Actividad::class, 'KidID');
    }
}
