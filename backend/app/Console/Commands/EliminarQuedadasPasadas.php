<?php

namespace App\Console\Commands;

use App\Models\Quedada;
use Illuminate\Console\Command;

class EliminarQuedadasPasadas extends Command
{
    protected $signature = 'quedadas:limpiar';
    protected $description = 'Elimina quedadas cuya fecha y hora ya han pasado';

    public function handle()
    {
        $eliminadas = Quedada::where('Fecha', '<', now()->toDateString())
            ->orWhere(function($q) {
                $q->where('Fecha', now()->toDateString())
                  ->where('Hora', '<=', now()->format('H:i'));
            })->delete();

        $this->info("Quedadas eliminadas: $eliminadas");
    }
}