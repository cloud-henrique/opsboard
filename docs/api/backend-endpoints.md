# Backend API Endpoints

Base URL local: `http://localhost:8000`.

## Auth flow

1. `GET /sanctum/csrf-cookie`
2. `POST /login`
3. `GET /api/me`
4. Authenticated API calls with cookies and `X-XSRF-TOKEN`
5. `POST /logout`

### POST /login

Payload:

```json
{
  "email": "admin@opsboard.test",
  "password": "password"
}
```

Response:

```json
{
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@opsboard.test",
    "role": "admin",
    "active": true
  }
}
```

## Health

- `GET /api/health`: public service healthcheck.
- `GET /api/protected-health`: authenticated healthcheck.

## Dashboard

`GET /api/dashboard`

Returns totals, open/in-progress/overdue counts, resolved requests this month, average resolution hours, and grouped counts by status and priority.

## Requests

### GET /api/requests

Query filters:

- `search`
- `status`
- `priority`
- `category_id`
- `assignee_id`
- `requester_id`
- `date_from`
- `date_to`
- `page`
- `per_page`
- `sort`
- `direction`

### POST /api/requests

Payload:

```json
{
  "title": "Revisar política de reembolso",
  "description": "Atualizar regras operacionais.",
  "category_id": 1,
  "priority": "high",
  "assignee_id": 3,
  "due_date": "2026-05-20"
}
```

### Other request endpoints

- `GET /api/requests/{id}`
- `PUT /api/requests/{id}`
- `PATCH /api/requests/{id}/status`
- `PATCH /api/requests/{id}/assign`
- `POST /api/requests/{id}/resolve`
- `POST /api/requests/{id}/cancel`
- `GET /api/requests/{id}/audit-logs`

## Categories

- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/{id}`
- `POST /api/categories/import`

Import CSV format:

```csv
name,description,active
Financeiro,Solicitações financeiras,1
RH,Solicitações de recursos humanos,true
```

Existing categories are updated by name. Missing categories are created.

## Users

- `GET /api/users`
- `POST /api/users`
- `PUT /api/users/{id}`

Roles: `admin`, `manager`, `operator`, `viewer`.

## Audit logs

- `GET /api/audit-logs`

Filters:

- `action`
- `user_id`
- `date_from`
- `date_to`
- `page`
- `per_page`

## CSV export

`GET /api/requests/export`

Supports the same filters as `GET /api/requests` and returns `text/csv`.

CSV columns:

- ID
- Título
- Status
- Prioridade
- Categoria
- Solicitante
- Responsável
- Prazo
- Criada em
- Resolvida em
- Cancelada em

## Common errors

- `401`: unauthenticated.
- `403`: authenticated user does not have permission.
- `419`: CSRF token mismatch or expired session.
- `422`: validation error.
- `500`: unexpected server error.
