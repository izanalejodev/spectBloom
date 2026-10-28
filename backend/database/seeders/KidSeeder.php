<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class KidSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('kid')->insert([
            'Nombre'         => 'Juanito',
            'Apellidos'          => 'García',
            'fecha_nacimiento'       => '2020-01-01'
        ]);
        DB::table('kid')->insert([
            'Nombre'         => 'Juanita',
            'Apellidos'          => 'García',
            'fecha_nacimiento'       => '2020-01-01'
        ]);
    }
}
