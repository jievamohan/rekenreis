# API runtime image for CI. Source is baked in; no volume mount in PR gate.
FROM php:8.4-cli-alpine

RUN apk add --no-cache \
    git \
    unzip \
    libzip-dev \
    icu-dev \
    oniguruma-dev \
    curl \
    && docker-php-ext-install -j$(nproc) pdo_mysql zip intl mbstring

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-interaction --prefer-dist --no-scripts

COPY . .
RUN composer dump-autoload
EXPOSE 8000

RUN adduser -D -g '' appuser && chown -R appuser:appuser /app
USER appuser

CMD ["sh", "-c", "sleep 5 && php artisan migrate --force && exec php artisan serve --host=0.0.0.0"]
