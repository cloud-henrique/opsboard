# ADR 0003: PostgreSQL

## Status

Accepted.

## Context

OpsBoard needs a relational database suitable for internal operational data and local Docker development.

## Decision

Use PostgreSQL as the primary database.

## Consequences

- Relational constraints fit users, categories, requests, and audit logs.
- PostgreSQL works well with Docker Compose.
- The stack demonstrates range beyond the common Laravel + MySQL pairing.
- SQLite remains useful for fast automated tests.
