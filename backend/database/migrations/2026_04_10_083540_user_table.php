<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user', function (Blueprint $table) {
            $table->id();  
            $table->string('nombre', 100);
            $table->string('email', 255)->unique();
            $table->string('password', 255);
            $table->string('rol', 50);
            $table->string('fotoPerfil', 500)->nullable();
            $table->rememberToken();
            $table->timestamps(); // Opcional pero recomendado
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user');
    }
};