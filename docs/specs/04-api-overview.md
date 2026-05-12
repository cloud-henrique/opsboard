# API Overview

## Authentication

- `GET /sanctum/csrf-cookie`
- `POST /login`
- `POST /logout`
- `GET /api/me`

The SPA uses Sanctum first-party authentication. It does not store access tokens in `localStorage`.

## System

- `GET /api/health`
- `GET /api/protected-health`

## Dashboard

- `GET /api/dashboard`

## Requests

- `GET /api/requests`
- `POST /api/requests`
- `GET /api/requests/{id}`
- `PUT /api/requests/{id}`
- `PATCH /api/requests/{id}/status`
- `PATCH /api/requests/{id}/assign`
- `POST /api/requests/{id}/resolve`
- `POST /api/requests/{id}/cancel`
- `GET /api/requests/{id}/audit-logs`
- `GET /api/requests/export`

## Categories

- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/{id}`
- `POST /api/categories/import`

## Users

- `GET /api/users`
- `POST /api/users`
- `PUT /api/users/{id}`

## Audit

- `GET /api/audit-logs`

## Common errors

- `401`: unauthenticated.
- `403`: authenticated but not authorized.
- `419`: session expired or CSRF token mismatch.
- `422`: validation error.
- `500`: unexpected server error.
