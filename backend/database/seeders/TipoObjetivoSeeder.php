<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class TipoObjetivoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tipos = [
            [
                'nombre' => 'Deporte',
                'id'     => 1
            ],
            [
                'nombre' => 'Higiene',
                'id'     => 1
            ],
            [
                'nombre' => 'Cole',
                'id'     => 1
            ],
            [
                'nombre' => 'Ocio',
                'id'     => 1
            ],
        ];

        foreach ($tipos as $tipo) {
            DB::table('tipos_objetivos')->insert([
                'nombre' => $tipo['nombre'],
                'id' => $tipo['id']
            ]);
        }
    }
}
