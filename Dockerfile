FROM nginxinc/nginx-unprivileged:stable-alpine

COPY mime.types /etc/nginx/mime.types
COPY nginx.docker.conf /etc/nginx/nginx.conf
COPY conf.d /etc/nginx/conf.d

RUN rm -f /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]