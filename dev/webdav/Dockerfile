FROM nginx:1.22
RUN apt-get update && apt-get install -y nginx-extras apache2-utils
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
RUN htpasswd -b -c /etc/nginx/dav_passwdfile cat dog
RUN rm /etc/nginx/sites-enabled/*
RUN mkdir /srv/webdav
RUN chown -R www-data: /srv/webdav
