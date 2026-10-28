<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class USerKidSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('user_kids')->insert([
            'id'         => 1,
            'KidID'          => 1
        ]);
        DB::table('user_kids')->insert([
            'id'         => 1,
            'KidID'          => 2
        ]);
    }
}
