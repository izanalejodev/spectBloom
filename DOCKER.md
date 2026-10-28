# SpectBloom con Docker

Sustituye a Laragon. Funciona igual en Linux, macOS y Windows (con Docker Desktop).

## 1. Instalar Docker en Fedora (solo una vez)

```bash
sudo dnf -y install dnf-plugins-core
sudo dnf config-manager addrepo --from-repofile=https://download.docker.com/linux/fedora/docker-ce.repo
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker
sudo usermod -aG docker $USER     # para no usar sudo con docker
```

Cierra sesión y vuelve a entrar (o reinicia) para que se aplique el grupo `docker`.
Comprueba con `docker run hello-world`.
Guía oficial: https://docs.docker.com/engine/install/fedora/

## 2. Colocar los archivos

Copia esto en la raíz del proyecto, junto a `backend/` y `frontend/`:

```
SpectBloom/
├── docker-compose.yml
├── DOCKER.md
├── docker/php/Dockerfile
├── docker/php/entrypoint.sh
├── backend/.env.docker
├── backend/
└── frontend/
```

> Si el proyecto viene de Windows con `backend/vendor` o `frontend/node_modules` ya creados, bórralos.
> Tienen binarios de Windows y en Linux fallan. Docker los vuelve a instalar.

## 3. Arrancar

```bash
docker compose up -d --build
```

La primera vez tarda unos minutos (descarga imágenes, `composer install`, `npm install`, migraciones).
Para ver cómo va: `docker compose logs -f backend frontend`

Cargar los datos de prueba (solo la primera vez):

```bash
docker compose exec backend php artisan db:seed
```

| Qué | Dónde |
|---|---|
| Web (Angular en desarrollo) | http://localhost:4200 |
| API Laravel | http://localhost:8000/api |
| phpMyAdmin | http://localhost:8080 |
| MySQL desde fuera | `localhost:3307`, usuario `spectbloom` / `spectbloom` |

## 4. Chat de IA (opcional)

Ollama pesa varios GB y va mucho mejor con GPU, por eso no arranca por defecto.

```bash
docker compose --profile ia up -d
docker compose exec ollama ollama pull mistral
```

Si ya tienes Ollama instalado directamente en Fedora, no uses el perfil y arranca así:

```bash
OLLAMA_BASE_URL=http://host.docker.internal:11434 docker compose up -d
```

(En ese caso Ollama tiene que escuchar en todas las interfaces: `OLLAMA_HOST=0.0.0.0`.)

Sin Ollama, todo funciona menos el chat, que devolverá un error.

## Comandos del día a día

```bash
docker compose up -d                          # arrancar
docker compose down                           # parar
docker compose logs -f backend                # ver logs de Laravel
docker compose exec backend php artisan ...   # cualquier comando artisan
docker compose exec backend composer require paquete
docker compose exec frontend npm install paquete
docker compose exec backend php artisan migrate:fresh --seed   # reiniciar la BD con datos de prueba
docker compose down -v                        # parar Y BORRAR la base de datos
```

## Problemas típicos

- **"permission denied" al escribir en `storage/`**: tu usuario no tiene el UID 1000. Mira `id -u` y arranca con
  `HOST_UID=$(id -u) HOST_GID=$(id -g) docker compose up -d --build`.
- **El puerto ya está en uso**: cambia el número de la izquierda en `ports:` (p. ej. `"8001:8000"`).
- **Login con Google**: rellena `GOOGLE_CLIENT_ID` y los demás en `backend/.env` y asegúrate de que
  `http://localhost:4200` está en los orígenes autorizados de Google Cloud Console.
