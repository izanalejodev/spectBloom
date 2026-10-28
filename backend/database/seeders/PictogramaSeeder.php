<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class PictogramaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('pictograma')->insert([
            'Titulo'          => 'padel',
            'URL'       => 'https://static.arasaac.org/pictograms/28609/28609_300.png'
        ]);
        DB::table('pictograma')->insert([
            'Titulo'          => 'ducha',
            'URL'       => 'https://static.arasaac.org/pictograms/38582/38582_300.png'
        ]);
        DB::table('pictograma')->insert([
            'Titulo'          => 'fútbol',
            'URL'       => 'https://static.arasaac.org/pictograms/35256/35256_300.png'
        ]);
        DB::table('pictograma')->insert([
            'Titulo'          => 'deberes',
            'URL'       => 'https://static.arasaac.org/pictograms/36055/36055_300.png'
        ]);
        DB::table('pictograma')->insert([
            'Titulo'          => 'cine',
            'URL'       => 'https://static.arasaac.org/pictograms/30387/30387_300.png'
        ]);
        DB::table('pictograma')->insert([
            'Titulo'          => 'recoger',
            'URL'       => 'https://static.arasaac.org/pictograms/32663/32663_300.png'
        ]);
    }
}

