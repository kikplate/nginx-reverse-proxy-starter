# nginx-reverse-proxy-starter

This repository is a Kikplate template for creating a production ready NGINX reverse proxy project with a Node.js upstream service.

The template is defined by plate.yaml values.yaml and files in templates with tmpl extensions. You can customize project name proxy and app ports container image names and optional modules through values.yaml.

## Build locally from this template

Run this command from the repository root.

```bash
kik generate --template . -f values.yaml --output-dir ./generated-project
```

This generates a project in generated-project using local template files and your current values.

## Generate from Kikplate server

Run this command when using the published template name.

```bash
kik generate nginx-reverse-proxy-starter -f values.yaml
```

This generates the same project shape using the remote template registry source.

## How to use the generated project

Run the generated reverse proxy stack with Docker Compose.

```bash
cd generated-project
docker compose up --build
```

Open http://localhost:8080 in your browser.