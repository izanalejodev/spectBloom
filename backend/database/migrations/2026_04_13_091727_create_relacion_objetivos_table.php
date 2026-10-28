<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('relacion_objetivos', function (Blueprint $table) {
            $table->unsignedInteger('ObjetivoID');
            $table->unsignedInteger('TipoOID');

            $table->primary(['ObjetivoID', 'TipoOID']);

            $table->foreign('ObjetivoID')
                  ->references('ObjetivoID')
                  ->on('objetivo');
            
            $table->foreign('TipoOID')
                  ->references('UniqueID')
                  ->on('tipos_objetivos');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('relacion_objetivos');
    }
};