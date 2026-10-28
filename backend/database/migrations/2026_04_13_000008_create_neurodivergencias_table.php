<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('neurodivergencias', function (Blueprint $table) {
            $table->integer('NeuroID')->primary();
            $table->string('Nombre', 100);
            $table->text('Descripcion')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('neurodivergencias');
    }
};