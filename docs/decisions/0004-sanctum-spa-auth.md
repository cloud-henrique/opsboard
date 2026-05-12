# ADR 0004: Sanctum SPA Authentication

## Status

Accepted.

## Context

The frontend is a first-party Angular SPA and the backend is a Laravel API. Authentication should avoid storing long-lived browser tokens.

## Decision

Use Laravel Sanctum SPA authentication with cookies, sessions, and CSRF protection.

## Consequences

- The SPA first calls `GET /sanctum/csrf-cookie`.
- Login uses `POST /login` and Laravel's session guard.
- Authenticated API calls use cookies and CSRF instead of JWT in `localStorage`.
- Backend routes remain protected with `auth:sanctum`.
