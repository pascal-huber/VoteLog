FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
        apache2 \
        libapache2-mod-auth-openidc \
    && rm -rf /var/lib/apt/lists/*

RUN a2enmod dav dav_fs auth_openidc headers proxy proxy_http rewrite

RUN mkdir -p /var/www/dav /var/lib/dav && \
    chown -R www-data:www-data /var/www/dav /var/lib/dav

COPY apache2.conf /etc/apache2/sites-available/000-default.conf

EXPOSE 80
CMD ["apachectl", "-D", "FOREGROUND"]
