<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use \Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = "user";
    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'email',
        'password',
        'rol',
        'fotoPerfil',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function getAuthPassword()
    {
        return $this->password;
    }

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
        ];
    }
    public function kids(): BelongsToMany 
    {
        return $this->belongsToMany(Kid::class, 'user_kids', 'id', 'KidID');
    }
    public function tiposActividad()
    {
        return $this->hasMany(TipoActividad::class, 'id', 'id');
    }
    public function tiposObjetivo()
    {
        return $this->hasMany(TipoObjetivo::class, 'id', 'id');
    }
}
