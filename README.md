# Chinese game

The classic Chinese board game, written in Angular with PHP backend. The application is production-ready and contenerized, with frontend and backend images available at [Dockerhub][https://hub.docker.com/repositories/torwanat]. It is also hosted at [https://chinese.torvan.eu/].

# Features

- Up to 4 players multiplayer experience
- Automatic mathcmaking and lobby management
- Multi language support
- Time limited moves to prevent stalling the game
- Highliting of available moves
- Session persistence 
- And more!

# Prerequisites

- Docker Engine with Docker Compose installed

# Usage

1. Copy `docker-compose.yml` and  `docker/init.sql` into your desired directory.
2. Edit the `.env` file (from `env.example`) and set the desired application version and database credentials.
3. Pull the published images `docker compose pull`
4. Start the applications `docker compose up`

---

- To stop the applications, use `docker compose down`
- To reset the database, use `docker compose down -v` (Initialization scripts in `docker/init.sql` run only when the database is created for the first time with a fresh volume!)

# Updating to a new release

The application is updated periodically. To update deployed containers to a new version, change `APP_VERSION` in `.env` to the desired one, and then pull and recreate the containers:

```bash
docker compose pull
docker compose up -d
```

# Technologies used

- **Frontend**: Angular 22, TypeScript 6, RxJS 7.8
- **Backend**: PHP 8.2
- **Localization**: gettext (PO/MO files)
- **Build**: Angular CLI 22

