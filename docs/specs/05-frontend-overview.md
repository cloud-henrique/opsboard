# Frontend Overview

## Screens

- Login.
- Dashboard.
- Requests list.
- Request detail.
- Request create/edit form.
- Categories.
- Users.
- Audit logs.
- Simple profile/settings area through authenticated layout context.

## UX requirements

- Internal layout with sidebar and topbar.
- KPI cards on the dashboard.
- Tables with filters and pagination.
- Loading, error, success, and empty states.
- Handling for `401`, `403`, and `419`.
- User-facing text in Portuguese.
- Angular Material 21 with Material Design 3 where viable.

## Structure

- `core/auth`: authentication state, guards, and login flow.
- `core/http`: API URL and interceptors.
- `core/layout`: authenticated shell.
- `features/*`: feature pages and services.
- `shared`: reusable interfaces, labels, and utilities.

## Permission UX

Frontend permissions are role-based helpers used to hide or disable controls. They do not replace backend authorization.
