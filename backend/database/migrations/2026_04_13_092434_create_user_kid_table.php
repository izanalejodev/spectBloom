<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_kids', function (Blueprint $table) {
            $table->unsignedBigInteger('id');
            $table->unsignedInteger('KidID');

            $table->primary(['id', 'KidID']);

            $table->foreign('id')
                  ->references('id')
                  ->on('user');
            
            $table->foreign('KidID')
                  ->references('KidID')
                  ->on('kid');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_kids');
    }
};