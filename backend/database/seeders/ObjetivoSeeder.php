<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ObjetivoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('objetivo')->insert([
            'KidID' => 1,
            'TipoObjetivoID' => 1,
            'PictoID' => 6,
            'PictoIDRecompensa' => 5,
            'Titulo' => 'Recoger la habitación',
            'Descripcion' => 'Este objetivo trata de recoger la habitacióin para conseguir la recompensa',
            'Recompensa' => 'Ir al cine',
            'Perfil' => 'TEA',
            'Marcas' => json_encode([
                [false, false, true, false, true],
                [true,  false, true, false, false],
                [true,  false, false, true, false],
                [true,  false, false, true, false],
            ]),
            'RecompensaPequena' => null,
            'RecompensaMediana' => null,
            'RecompensaGrande' => null
        ]);
        DB::table('objetivo')->insert([
            'KidID' => 2,
            'TipoObjetivoID' => 3,
            'PictoID' => 6,
            'PictoIDRecompensa' => null,
            'Titulo' => 'Recoger la habitación',
            'Descripcion' => 'Este objetivo trata de recoger la habitacióin para conseguir la recompensa',
            'Recompensa' => null,
            'Perfil' => 'TDAH',
            'Marcas' => json_encode([
                [false, false, true, false, true],
                [true,  false, true, false, false],
                [true,  false, false, true, false],
                [true,  false, false, true, false],
            ]),
            'RecompensaPequena' => 'Helado',
            'RecompensaMediana' => 'Salir al parque',
            'RecompensaGrande' => 'Fin de semana en la montaña'
        ]);
    }
}
