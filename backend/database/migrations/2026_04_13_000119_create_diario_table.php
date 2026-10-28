<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('diario', function (Blueprint $table) {
    $table->id('DiarioID');
    $table->unsignedBigInteger('user_id');
    $table->unsignedBigInteger('kid_id')->nullable();
    $table->string('estado', 20)->default('bien');
    $table->date('Fecha');
    $table->text('Contenido')->nullable();
    $table->text('comportamientos')->nullable();
    $table->string('logros', 500)->nullable();
    $table->string('notas', 500)->nullable();

    $table->foreign('user_id')->references('id')->on('user')->onDelete('cascade');
    
});
    }

    public function down(): void
    {
        Schema::dropIfExists('diario');
    }
};