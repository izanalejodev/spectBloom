<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('objetivo', function (Blueprint $table) {
            $table->increments('ObjetivoID');
            $table->unsignedInteger('KidID');
            $table->unsignedInteger('TipoObjetivoID')->nullable();
            $table->unsignedInteger('PictoID')->nullable();
            $table->unsignedInteger('PictoIDRecompensa')->nullable();
            $table->foreign('PictoIDRecompensa')->references('PictoID')->on('pictograma');
            $table->string('Titulo', 255);
            $table->text('Descripcion')->nullable();
            $table->string('Recompensa', 255)->nullable();
            $table->enum('Perfil', ['TEA', 'TDAH'])->nullable();
            $table->json('Marcas')->nullable();
            $table->string('RecompensaPequena', 255)->nullable();
            $table->string('RecompensaMediana', 255)->nullable();
            $table->string('RecompensaGrande', 255)->nullable();

            
            $table->foreign('KidID')
                ->references('KidID')
                ->on('kid');

            $table->foreign('TipoObjetivoID')
                ->references('UniqueID')
                ->on('tipos_objetivos');

            $table->foreign('PictoID')
                ->references('PictoID')
                ->on('pictograma');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('objetivo');
    }
};