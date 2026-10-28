<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pictograma', function (Blueprint $table) {
            $table->increments('PictoID');
            $table->string('Titulo', 255);
            $table->string('URL', 500);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pictograma');
    }
};