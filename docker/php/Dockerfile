FROM php:8.3-cli

# Herramientas de sistema que necesita Composer
RUN apt-get update \
 && apt-get install -y --no-install-recommends git unzip \
 && rm -rf /var/lib/apt/lists/*

# Extensiones PHP (pdo_mysql para MySQL, gd para imágenes, pcntl para schedule:work)
COPY --from=mlocati/php-extension-installer:2 /usr/bin/install-php-extensions /usr/local/bin/
RUN install-php-extensions pdo_mysql zip intl bcmath gd pcntl

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

# Permitir subir fotos de perfil de más de 2 MB
RUN printf "upload_max_filesize=10M\npost_max_size=12M\nmemory_limit=512M\n" > "$PHP_INI_DIR/conf.d/spectbloom.ini"

# Usuario con tu mismo UID para que los archivos creados (vendor, storage...) sean tuyos y no de root
ARG UID=1000
ARG GID=1000
RUN groupadd -g "${GID}" app 2>/dev/null || true \
 && useradd -m -u "${UID}" -g "${GID}" -s /bin/bash app

COPY entrypoint.sh /usr/local/bin/entrypoint
RUN chmod +x /usr/local/bin/entrypoint

USER app
WORKDIR /var/www/html
ENTRYPOINT ["entrypoint"]
CMD ["serve"]
