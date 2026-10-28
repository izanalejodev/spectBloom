<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class DiarioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         DB::table('diario')->insert([
            'user_id' => 1,
            'kid_id' => 1,
            'estado' => 'bien',
            'Fecha' => '2025-05-07',
            'Contenido' => 'Hoy juanito se ha portado bastante bien',
            'comportamientos' => json_encode(
                ["Tranquilo\/a","Activo\/a"]),
            'logros' => null,
            'notas' => null
         ]);
          DB::table('diario')->insert([
            'user_id' => 1,
            'kid_id' => 1,
            'estado' => 'mal',
            'Fecha' => '2025-05-07',
            'Contenido' => 'Hoy juanito se ha portado bastante bien',
            'comportamientos' => json_encode(
                ["Tranquilo\/a","Activo\/a"]),
            'logros' => null,
            'notas' => null
         ]);
          DB::table('diario')->insert([
            'user_id' => 1,
            'kid_id' => 1,
            'estado' => 'normal',
            'Fecha' => '2025-05-07',
            'Contenido' => 'Hoy juanito se ha portado bastante bien',
            'comportamientos' => json_encode(
                ["Tranquilo\/a","Activo\/a"]),
            'logros' => null,
            'notas' => null
         ]);
          DB::table('diario')->insert([
            'user_id' => 1,
            'kid_id' => 1,
            'estado' => 'bien',
            'Fecha' => '2025-05-07',
            'Contenido' => 'Hoy juanito se ha portado bastante bien',
            'comportamientos' => json_encode(
                ["Tranquilo\/a","Activo\/a"]),
            'logros' => null,
            'notas' => null
         ]); 
          DB::table('diario')->insert([
            'user_id' => 1,
            'kid_id' => 1,
            'estado' => 'bien',
            'Fecha' => '2025-05-07',
            'Contenido' => 'Hoy juanito se ha portado bastante bien',
            'comportamientos' => json_encode(
                ["Tranquilo\/a","Activo\/a"]),
            'logros' => null,
            'notas' => null
         ]);
          DB::table('diario')->insert([
            'user_id' => 1,
            'kid_id' => 1,
            'estado' => 'mal',
            'Fecha' => '2025-05-07',
            'Contenido' => 'Hoy juanito se ha portado bastante bien',
            'comportamientos' => json_encode(
                ["Tranquilo\/a","Activo\/a"]),
            'logros' => null,
            'notas' => null
         ]);
          DB::table('diario')->insert([
            'user_id' => 1,
            'kid_id' => 1,
            'estado' => 'mal',
            'Fecha' => '2025-05-07',
            'Contenido' => 'Hoy juanito se ha portado bastante bien',
            'comportamientos' => json_encode(
                ["Tranquilo\/a","Activo\/a"]),
            'logros' => null,
            'notas' => null
         ]);
         DB::table('diario')->insert([
            'user_id' => 1,
            'kid_id' => 2,
            'estado' => 'bien',
            'Fecha' => '2025-05-07',
            'Contenido' => 'Hoy juanito se ha portado bastante bien',
            'comportamientos' => json_encode(
                ["Tranquilo\/a","Activo\/a"]),
            'logros' => null,
            'notas' => null
         ]);
          DB::table('diario')->insert([
            'user_id' => 1,
            'kid_id' => 2,
            'estado' => 'mal',
            'Fecha' => '2025-05-07',
            'Contenido' => 'Hoy juanito se ha portado bastante bien',
            'comportamientos' => json_encode(
                ["Tranquilo\/a","Activo\/a"]),
            'logros' => null,
            'notas' => null
         ]);
          DB::table('diario')->insert([
            'user_id' => 1,
            'kid_id' => 2,
            'estado' => 'normal',
            'Fecha' => '2025-05-07',
            'Contenido' => 'Hoy juanito se ha portado bastante bien',
            'comportamientos' => json_encode(
                ["Tranquilo\/a","Activo\/a"]),
            'logros' => null,
            'notas' => null
         ]);
          DB::table('diario')->insert([
            'user_id' => 1,
            'kid_id' => 2,
            'estado' => 'bien',
            'Fecha' => '2025-05-07',
            'Contenido' => 'Hoy juanito se ha portado bastante bien',
            'comportamientos' => json_encode(
                ["Tranquilo\/a","Activo\/a"]),
            'logros' => null,
            'notas' => null
         ]); 
          DB::table('diario')->insert([
            'user_id' => 1,
            'kid_id' => 2,
            'estado' => 'bien',
            'Fecha' => '2025-05-07',
            'Contenido' => 'Hoy juanito se ha portado bastante bien',
            'comportamientos' => json_encode(
                ["Tranquilo\/a","Activo\/a"]),
            'logros' => null,
            'notas' => null
         ]);
          DB::table('diario')->insert([
            'user_id' => 1,
            'kid_id' => 2,
            'estado' => 'mal',
            'Fecha' => '2025-05-07',
            'Contenido' => 'Hoy juanito se ha portado bastante bien',
            'comportamientos' => json_encode(
                ["Tranquilo\/a","Activo\/a"]),
            'logros' => null,
            'notas' => null
         ]);
          DB::table('diario')->insert([
            'user_id' => 1,
            'kid_id' => 2,
            'estado' => 'mal',
            'Fecha' => '2025-05-07',
            'Contenido' => 'Hoy juanito se ha portado bastante bien',
            'comportamientos' => json_encode(
                ["Tranquilo\/a","Activo\/a"]),
            'logros' => null,
            'notas' => null
         ]);
    }
}


