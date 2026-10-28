<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up(): void
{
      Schema::create('inscripcion_quedada', function (Blueprint $table) {
        $table->unsignedBigInteger('QuedadaID');
        $table->unsignedBigInteger('id');
        $table->date('Fecha_Inscripcion');
        $table->string('nombre_familiar')->nullable();
        $table->string('nombre_nino')->nullable();
        $table->integer('edad_nino')->nullable();
        $table->primary(['QuedadaID', 'id']);
    });
}

    public function down(): void
    {
        Schema::dropIfExists('inscripcion_quedada');
    }
};