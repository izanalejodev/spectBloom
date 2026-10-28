<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        if (!User::where('email', 'admin@admin.com')->exists()) {
            User::create([
                'nombre'     => 'Admin',
                'email'      => 'admin@admin.com',
                'password'   => Hash::make('admin'),
                'rol'        => 'admin',
                'fotoPerfil' => null,
            ]);
        }
    }
}