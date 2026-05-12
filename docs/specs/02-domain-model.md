# Domain Model

## User

Fields:

- `id`
- `name`
- `email`
- `password`
- `role`
- `active`
- `created_at`
- `updated_at`

Roles:

- `admin`
- `manager`
- `operator`
- `viewer`

## OperationalRequest

Fields:

- `id`
- `title`
- `description`
- `category_id`
- `status`
- `priority`
- `requester_id`
- `assignee_id`
- `due_date`
- `resolved_at`
- `cancelled_at`
- `created_at`
- `updated_at`

Statuses:

| Value | UI label |
|---|---|
| `open` | Aberta |
| `in_review` | Em análise |
| `in_progress` | Em andamento |
| `waiting_response` | Aguardando retorno |
| `resolved` | Resolvida |
| `cancelled` | Cancelada |

Priorities:

| Value | UI label |
|---|---|
| `low` | Baixa |
| `medium` | Média |
| `high` | Alta |
| `critical` | Crítica |

## Category

Fields:

- `id`
- `name`
- `description`
- `active`
- `created_at`
- `updated_at`

## AuditLog

Fields:

- `id`
- `auditable_type`
- `auditable_id`
- `user_id`
- `action`
- `old_values`
- `new_values`
- `metadata`
- `created_at`

Actions:

- `request_created`
- `request_updated`
- `status_changed`
- `priority_changed`
- `assignee_changed`
- `request_resolved`
- `request_cancelled`
- `category_created`
- `category_updated`
- `user_created`
- `user_updated`
