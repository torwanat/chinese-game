FROM php:8.2-apache

RUN apt-get update     && apt-get install -y --no-install-recommends gettext     && docker-php-ext-install gettext mysqli     && a2enmod rewrite     && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html
COPY ./backend/ /var/www/html/

EXPOSE 80
