<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;   

class TiposQuedadasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
   public function run(): void
{
    $tipos = [
        'Excursión', 'Paseo', 'Taller', 'Charla', 'Deporte',
        'Juegos', 'Música', 'Arte', 'Teatro', 'Cine',
        'Lectura', 'Picnic', 'Celebración', 'Voluntariado', 'Formación', 'Otros',
    ];

    foreach ($tipos as $tipo) {
        DB::table('tipos_quedadas')->insert(['nombre' => $tipo, 'created_at' => now(), 'updated_at' => now()]);
    }
}
}
