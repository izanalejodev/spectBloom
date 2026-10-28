<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;


class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
     public function run(): void
    {
        DB::table('user')->insert([
            'nombre'         => 'Pepito',
            'email'          => 'pepito@spectbloom.cat',
            'password'       => Hash::make('password123'),
            'rol'            => 'familiar',
            'fotoPerfil'     => null,
            'remember_token' => null,
            'created_at'     => now(),
            'updated_at'     => now(),
        ]);
    }
}
