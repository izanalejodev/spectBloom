<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('relacion_actividades', function (Blueprint $table) {
            $table->unsignedInteger('ActividadID');
            $table->unsignedInteger('TipoAID');
            $table->unsignedInteger('PictoID')->nullable();

            $table->primary(['ActividadID', 'TipoAID']);

            $table->foreign('ActividadID')
                  ->references('UniqueID')
                  ->on('actividades');
            
            $table->foreign('TipoAID')
                  ->references('UniqueID')
                  ->on('tipos_actividades');
            
            $table->foreign('PictoID')
                  ->references('PictoID')
                  ->on('pictograma');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('relacion_actividades');
    }
};