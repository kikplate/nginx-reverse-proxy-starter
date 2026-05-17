# nginx-reverse-proxy-starter

[![View on KikPlate](https://img.shields.io/static/v1?label=KikPlate&message=nginx-reverse-proxy-starter&color=0366d6&style=flat-square)](https://kikplate.dev/plates/nginx-reverse-proxy-starter)

A production-oriented NGINX reverse proxy starter with a small Node.js upstream, explicit local and Docker entrypoints, health checks, security headers, and a rootless proxy container.

## Features

- NGINX reverse proxy in front of a Node.js backend
- Separate local and Docker NGINX entry configs
- WebSocket-ready proxy headers
- Security headers applied at the proxy layer
- Health checks for both proxy and upstream app
- Docker Compose stack for full local orchestration
- Rootless NGINX container listening on port 8080

## Architecture

Client -> NGINX :8080 -> Node.js app :3000

## Project Structure

```text
nginx-reverse-proxy-starter/
├── .dockerignore
├── .gitignore
├── Dockerfile
├── README.md
├── docker-compose.yml
├── mime.types
├── nginx.conf
├── nginx.docker.conf
├── app/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
└── conf.d/
	├── proxy.conf
	└── security.conf
```

## Quick Start

## Option A: Docker Compose

This is the fastest way to run the full reverse proxy stack.

```bash
docker compose up --build
```

Open http://localhost:8080

Useful checks:

```bash
curl http://localhost:8080/
curl http://localhost:8080/health
curl http://localhost:8080/nginx-health
```

Stop the stack:

```bash
docker compose down
```

## Option B: Native Local Development

Start the example backend:

```bash
cd app
npm install
npm start
```

In another terminal, from the project root, validate and start NGINX:

```bash
nginx -t -c $(pwd)/nginx.conf -p $(pwd)
nginx -c $(pwd)/nginx.conf -p $(pwd)
```

Reload after config changes:

```bash
nginx -t -c $(pwd)/nginx.conf -p $(pwd)
nginx -s reload -c $(pwd)/nginx.conf -p $(pwd)
```

Stop NGINX:

```bash
nginx -s stop -c $(pwd)/nginx.conf -p $(pwd)
```

## Configuration

- [nginx.conf](nginx.conf) is the native local entrypoint. It proxies to `127.0.0.1:3000`.
- [nginx.docker.conf](nginx.docker.conf) is the container entrypoint. It proxies to the Compose service `app:3000`.
- [conf.d/proxy.conf](conf.d/proxy.conf) contains the shared reverse proxy server block.
- [conf.d/security.conf](conf.d/security.conf) contains proxy-level security headers.
- [app/server.js](app/server.js) is the example upstream application.

## Best-Practice Notes

- The proxy listens on `8080` in both local and Docker modes so the public port stays consistent.
- The Docker image uses `nginxinc/nginx-unprivileged`, which avoids binding privileged ports as root.
- Access and error logs are sent to stdout and stderr, which works cleanly in both containers and local runs.
- The proxy exposes an internal `/nginx-health` endpoint while the application exposes `/health`.
- Upgrade and connection headers are configured so WebSocket-style traffic can be proxied correctly.

## Docker Files

Build the proxy image only:

```bash
docker build -t nginx-reverse-proxy-starter .
```

Build the backend image only:

```bash
docker build -t nginx-reverse-proxy-app ./app
```

## Extend This Starter

- Replace [app/server.js](app/server.js) with your real upstream service.
- Add TLS termination in NGINX if you want the proxy to own HTTPS.
- Add rate limiting, caching, or path-based routing in [conf.d/proxy.conf](conf.d/proxy.conf) as your traffic model becomes clearer.