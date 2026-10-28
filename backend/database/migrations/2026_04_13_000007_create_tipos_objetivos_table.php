<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tipos_objetivos', function (Blueprint $table) {
            $table->increments('UniqueID');
            $table->unsignedBigInteger('id');
            $table->string('Nombre', 100);

            $table->foreign('id')
                  ->references('id')
                  ->on('user');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tipos_objetivos');
    }
};