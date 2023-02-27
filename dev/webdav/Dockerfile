FROM nginx
RUN apt-get update && apt-get dist-upgrade -y && apt-get install -y nginx-extras apache2-utils
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/sites-enabled/*
RUN mkdir /srv/webdav
RUN chown -R www-data: /srv/webdav
