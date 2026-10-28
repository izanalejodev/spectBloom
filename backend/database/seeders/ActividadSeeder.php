<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class actividadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('actividades')->insert([
            'Titulo' => 'Ir a jugar al pádel',	
            'Descripcion' => 'Juanito irá a jugar al pádel',
            'Fecha' => '2026-05-18',	
            'Localizacion' => 'Pistas de pádel del pueblo',	
            'Tipo_ActividadesID' => '1',	
            'Hora' => '12:00:00',	
            'KidID' => 1,	
            'PictoID' => 1
        ]);
        DB::table('actividades')->insert([
            'Titulo' => 'Duchar a juanito',	
            'Descripcion' => 'Juanito se duchará',
            'Fecha' => '2026-05-23',	
            'Localizacion' => 'Casa',	
            'Tipo_ActividadesID' => '2',	
            'Hora' => '20:00:00',		
            'KidID' => 1,	
            'PictoID' => 2
        ]);
        DB::table('actividades')->insert([
            'Titulo' => 'Ir a jugar a fútbol',	
            'Descripcion' => 'Juanita irá a jugar al pádel',
            'Fecha' => '2026-05-23',	
            'Localizacion' => 'Campo de fútbol del pueblo',	
            'Tipo_ActividadesID' => '4',	
            'Hora' => '16:00:00',	
            'KidID' => 2,	
            'PictoID' => 3
        ]);
        DB::table('actividades')->insert([
            'Titulo' => 'Hacer los deberess',	
            'Descripcion' => 'Juanita hará los deberes',
            'Fecha' => '2026-05-21',	
            'Localizacion' => 'En casa',	
            'Tipo_ActividadesID' => '3',	
            'Hora' => '9:00:00',	
            'KidID' => 2,	
            'PictoID' => 4
        ]);
    }
}
