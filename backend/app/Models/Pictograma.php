<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pictograma extends Model
{
    public $timestamps = false;

    protected $table = 'pictograma';
    protected $primaryKey = 'PictoID';
    protected $fillable = ['Titulo', 'URL'];
}


