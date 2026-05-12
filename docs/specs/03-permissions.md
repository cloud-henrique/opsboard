# Permissions

Backend policies, gates, and middleware are the source of truth. Frontend role checks are only a UX layer for hiding controls and avoiding dead-end actions.

| Action | Admin | Manager | Operator | Viewer |
|---|---:|---:|---:|---:|
| View dashboard | Yes | Yes | Yes | Yes |
| Create request | Yes | Yes | Yes | No |
| View all requests | Yes | Yes | Yes | Yes |
| Edit any request | Yes | Yes | No | No |
| Edit assigned request | Yes | Yes | Yes | No |
| Change status | Yes | Yes | Yes, if assigned | No |
| Assign responsible user | Yes | Yes | No | No |
| Manage categories | Yes | Yes | No | No |
| Manage users | Yes | No | No | No |
| View full audit log | Yes | Yes | No | No |
| Export CSV | Yes | Yes | Yes | No |
| Import CSV | Yes | Yes | No | No |

## Backend implementation notes

- Request permissions live in `OperationalRequestPolicy`.
- Category permissions live in `CategoryPolicy`.
- User management permissions live in `UserPolicy`.
- Audit permissions live in `AuditLogPolicy`.
- Dashboard, CSV export, and CSV import use gates where a full policy method would add noise.
