<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kid', function (Blueprint $table) {
            $table->increments('KidID');
            $table->string('Nombre', 100);
            $table->string('Apellidos', 100);
            $table->date('Fecha_nacimiento');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kid');
    }
};