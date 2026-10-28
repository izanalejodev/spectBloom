<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class TipoActividadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tipos = [
            [
                'nombre' => 'Deporte',
                'color'  => '#74c6c8',
                'id'     => 1
            ],
            [
                'nombre' => 'Higiene',
                'color'  => '#139f6e',
                'id'     => 1
            ],
            [
                'nombre' => 'Cole',
                'color'  => '#7c139f',
                'id'     => 1
            ],
            [
                'nombre' => 'Ocio',
                'color'  => '#ec8508',
                'id'     => 1
            ],
        ];

        foreach ($tipos as $tipo) {
            DB::table('tipos_actividades')->insert(
                [
                    'nombre' => $tipo['nombre'],
                    'color' => $tipo['color'],
                    'id' => $tipo['id']
                ]
            );
        }
    }
}
