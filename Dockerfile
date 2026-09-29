# Use a base image with PHP, Nginx, and Alpine Linux.
# Use fixed version tags for stability.
FROM serversideup/php:8.4.11-fpm-nginx-alpine3.21-v3.6.0 AS development

# Switch to root to install dependencies
USER root

# Install any needed PHP extensions
# intl, bcmath, exif are hard `require`s of filament/support, lunarphp/core
# and spatie/laravel-medialibrary respectively (composer install fails without
# them); gd is needed at runtime for Lunar's product image conversions.
RUN install-php-extensions intl bcmath exif gd

# Defaults
ARG USER_ID=1000
ARG GROUP_ID=1000

RUN docker-php-serversideup-set-id www-data $USER_ID:$GROUP_ID \
    && docker-php-serversideup-set-file-permissions --owner $USER_ID:$GROUP_ID --service nginx


# Install Node (for building assets)
# This is quick and dirty, we'll fix it in the multi-stage version
RUN apk add --no-cache nodejs npm
USER www-data

# Copy composer files first
COPY --chown=www-data:www-data composer.json composer.lock /var/www/html/
RUN composer install --optimize-autoloader --no-interaction

# Copy package files for frontend
COPY --chown=www-data:www-data package.json package-lock.json /var/www/html/
RUN npm ci --omit=optional

# Copy rest of the app
COPY --chown=www-data:www-data . /var/www/html/

# Build frontend assets (as www-data to avoid permission issues)
RUN npm run build

# Publish Filament's (and its plugins') own static JS/CSS assets
# (Alpine components like filamentTable, filamentDropdown, etc. live here;
# without this they 404 and every Alpine directive that references them throws).
RUN php artisan filament:assets

# Run the application
EXPOSE 8080

# The base image's default entrypoint handles starting PHP-FPM and Nginx
# No CMD needed - the base image will handle it