<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
{
    Schema::create('quedadas', function (Blueprint $table) {
        // CORRECCIÓN: Usamos id() o bigIncrements() para que sea compatible con unsignedBigInteger
        $table->id('QuedadaID'); 
        $table->unsignedBigInteger('id'); // creador (FK -> user.id)
        $table->string('Titulo', 255);
        $table->string('tipo', 100);
        $table->text('descripcion');
        $table->date('Fecha');
        $table->time('Hora')->nullable();
        $table->string('lugar', 500);
        $table->decimal('lat', 10, 7);
        $table->decimal('lng', 10, 7);
        $table->integer('MaxAsistentes')->default(10);
        $table->timestamps();

        $table->foreign('id')->references('id')->on('user')->onDelete('cascade');
    });
}

    public function down(): void
    {
        Schema::dropIfExists('quedadas');
    }
};