FROM php:8.2-apache

RUN apt-get update \
	&& apt-get install -y --no-install-recommends gettext locales \
	&& sed -i 's/^# *pl_PL.UTF-8 UTF-8/pl_PL.UTF-8 UTF-8/' /etc/locale.gen \
	&& sed -i 's/^# *en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen \
	&& locale-gen pl_PL.UTF-8 en_US.UTF-8 \
	&& docker-php-ext-install gettext mysqli \
	&& a2enmod rewrite \
	&& rm -rf /var/lib/apt/lists/*

ENV LANG=pl_PL.UTF-8
ENV LANGUAGE=pl_PL:pl
ENV LC_ALL=pl_PL.UTF-8

WORKDIR /var/www/html
COPY ./backend/ /var/www/html/

EXPOSE 80
