<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kid_neurodivergencia', function (Blueprint $table) {
            $table->unsignedInteger('KidID');
            $table->integer('NeuroID');

            $table->primary(['KidID', 'NeuroID']);

            $table->foreign('KidID')
                  ->references('KidID')
                  ->on('kid');
            
            $table->foreign('NeuroID')
                  ->references('NeuroID')
                  ->on('neurodivergencias');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kid_neurodivergencia');
    }
};