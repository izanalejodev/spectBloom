<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('estado_kid', function (Blueprint $table) {
            $table->unsignedInteger('KidID');
            $table->integer('TipoEstadoID');
            $table->date('Fecha');

            $table->primary(['KidID', 'TipoEstadoID']);

            $table->foreign('KidID')
                  ->references('KidID')
                  ->on('kid');
            
            $table->foreign('TipoEstadoID')
                  ->references('UniqueID')
                  ->on('tipos_estado');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('estado_kid');
    }
};