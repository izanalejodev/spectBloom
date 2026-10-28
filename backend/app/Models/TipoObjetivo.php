<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoObjetivo extends Model
{
    public $timestamps = false;
    protected $table = 'tipos_objetivos';
    protected $primaryKey = 'UniqueID';
    protected $fillable = [
        'Nombre',
        'id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id', 'id');
    }
}
