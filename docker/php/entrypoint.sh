#!/usr/bin/env bash
# Prepara Laravel la primera vez y arranca el servidor.
# Con cualquier otro comando (p. ej. schedule:work) solo lo ejecuta.
set -e
cd /var/www/html

if [ "$1" = "serve" ]; then
  if [ ! -f .env ]; then
    echo "→ No hay .env: copiando .env.docker"
    cp .env.docker .env
  fi

  if [ ! -f vendor/autoload.php ]; then
    echo "→ Instalando dependencias de Composer (la primera vez tarda un poco)"
    composer install --no-interaction --prefer-dist
  fi

  if ! grep -qE '^APP_KEY=.+' .env; then
    echo "→ Generando APP_KEY"
    php artisan key:generate --force
  fi

  # Si quedó una caché de config de Laragon, ignoraría las variables de Docker
  php artisan config:clear >/dev/null

  echo "→ Ejecutando migraciones"
  php artisan migrate --force

  [ -L public/storage ] || php artisan storage:link

  touch /tmp/ready
  echo "→ Laravel listo en http://localhost:8000"
    exec php artisan serve --host=0.0.0.0 --port=8000 --no-reload
fi

exec "$@"
