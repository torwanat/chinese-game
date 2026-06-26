# Running with Docker Compose

This project is distributed as two custom Docker Hub images for the application layer and the official MySQL image for the database layer.
The Docker Compose file should be kept in the source repository together with `.env.example`, initialization scripts, and usage instructions so that image tags and startup configuration stay in sync.

## Files included

- `docker-compose.yml` — starts the full stack: frontend, backend, and MySQL.
- `.env.example` — template for required environment variables and secrets.
- `docker/init.sql` — first-run database initialization script mounted into MySQL.

## Prerequisites

- Docker Engine with Docker Compose installed.
- A Docker Hub account since the application images are private.

## First-time setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Edit `.env` and set secure values for database credentials and the application version tag.
3. Log in to Docker Hub:
   ```bash
   docker login
   ```

## Start the stack

Pull the published images and start all services:

```bash
docker compose pull
docker compose up -d
```

This downloads the published frontend and backend images from Docker Hub and pulls `mysql:8.0` as the database image.

## Stop the stack

```bash
docker compose down
```

This stops the containers but keeps the named MySQL volume, so database data persists across restarts unless volumes are explicitly removed.

## Reset the database

To remove the database volume and recreate MySQL from scratch:

```bash
docker compose down -v
docker compose up -d
```

Initialization scripts in `/docker-entrypoint-initdb.d/` run only when the database is created for the first time with a fresh volume.

## Updating to a new release

1. Change `APP_VERSION` in `.env` to the new published version.
2. Pull the updated images:
   ```bash
   docker compose pull
   ```
3. Recreate the containers:
   ```bash
   docker compose up -d
   ```

