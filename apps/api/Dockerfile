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

WORKDIR /repo/apps/api

EXPOSE 8000

# Source is volume-mounted at runtime. Run composer install + migrate eenmalig.
CMD ["php", "artisan", "serve", "--host=0.0.0.0"]
