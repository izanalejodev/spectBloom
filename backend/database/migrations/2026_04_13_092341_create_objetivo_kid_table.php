<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('objetivo_kid', function (Blueprint $table) {
            $table->unsignedInteger('ObjetivoID');
            $table->unsignedInteger('KidID');

            $table->primary(['ObjetivoID', 'KidID']);

            $table->foreign('ObjetivoID')
                  ->references('ObjetivoID')
                  ->on('objetivo');
            
            $table->foreign('KidID')
                  ->references('KidID')
                  ->on('kid');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('objetivo_kid');
    }
};