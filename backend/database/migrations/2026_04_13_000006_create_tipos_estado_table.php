<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tipos_estado', function (Blueprint $table) {
            $table->integer('UniqueID')->primary();
            $table->string('Nombre', 100);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tipos_estado');
    }
};