<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(UserSeeder::class);
        $this->call(KidSeeder::class);
        $this->call(UserKidSeeder::class);
        $this->call(TiposQuedadasSeeder::class);
        $this->call(TipoActividadSeeder::class);
        $this->call(TipoObjetivoSeeder::class);
        $this->call(PictogramaSeeder::class);
        $this->call(ActividadSeeder::class);
        $this->call(ObjetivoSeeder::class);
        $this->call(DiarioSeeder::class);
        $this->call(AdminSeeder::class);

    }
}
