<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('actividades', function (Blueprint $table) {
            $table->increments('UniqueID');
            $table->string('Titulo', 255);
            $table->text('Descripcion')->nullable();
            $table->date('Fecha')->nullable();
            $table->string('Localizacion', 255)->nullable();
            $table->unsignedInteger('Tipo_ActividadesID')->nullable();
            $table->time('Hora')->nullable();
            $table->unsignedInteger('KidID')->nullable();
            $table->unsignedInteger('PictoID')->nullable();

            $table->foreign('KidID')->references('KidID')->on('kid');
            $table->foreign('Tipo_ActividadesID')->references('UniqueID')->on('tipos_actividades');
            $table->foreign('PictoID')->references('PictoID')->on('pictograma');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('actividades');
    }
};