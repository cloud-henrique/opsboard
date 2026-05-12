# OpsBoard Agents Guide

## Project overview

- Name: OpsBoard.
- Type: demonstrative fullstack application.
- Domain: internal operational request management.
- Portfolio goal: demonstrate product engineering, Angular, Laravel, PostgreSQL, Docker, authentication, permissions, audit logging, documentation, and real maintenance practices.

## Tech stack

- Angular 21 when available in the local environment.
- Angular Material 21 with Material Design 3.
- Laravel 13.
- PostgreSQL.
- Laravel Sanctum SPA authentication with cookies, sessions, and CSRF.
- Docker Compose for local development.
- Basic backend and frontend tests.
- Technical documentation in `docs/`.

## Repository structure

- `frontend/`: Angular SPA, UI routes, Material theme, feature services, and authenticated layout.
- `backend/`: Laravel API, domain models, policies, migrations, seeders, tests, and Sanctum configuration.
- `docs/`: product specs, API docs, ADRs, screenshots, final audit, and preserved implementation prompts.
- `docker/`: Dockerfiles and local service configuration for backend, frontend, nginx, and PostgreSQL support files.

## Development rules

- Consult official documentation before using APIs that depend on framework versions.
- Avoid overengineering and avoid adding libraries without a clear justification.
- Keep code, API names, and technical documents in English.
- Keep user-facing interface text in Portuguese.
- Use English entity names in code.
- Prioritize readability, maintenance, and consistency over cleverness.
- Treat this as a technical portfolio project: README and documentation matter as much as the code.
- Do not hide build or test failures. Register them clearly with likely cause and impact.

## UI and visual direction

Base palette:

- Terracotta/copper: `#A94726`
- Burnt orange: `#C65A2E`
- Reddish brown: `#6E2D1D`
- Graphite: `#15171C`
- Off-white: `#F4E8DE`

Direction:

- sober internal operations interface;
- clean, trustworthy, and organized;
- no childish visual language;
- restrained motion;
- Material Design 3 when supported;
- custom Angular Material theme and SCSS tokens.

## Validation commands

```bash
docker compose up -d
docker compose down
cd frontend && npm run build
cd frontend && npm run test
cd backend && php artisan test
cd backend && php artisan migrate:fresh --seed
```
