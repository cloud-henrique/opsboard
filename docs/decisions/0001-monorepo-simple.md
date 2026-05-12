# ADR 0001: Simple Monorepo

## Status

Accepted.

## Context

OpsBoard is a portfolio project with one Angular frontend, one Laravel backend, local Docker infrastructure, and concise documentation.

## Decision

Use a simple monorepo with `frontend/`, `backend/`, `docker/`, and `docs/` directories. Do not add Turborepo or another workspace orchestrator.

## Consequences

- The repository remains easy to inspect for recruiters and maintainers.
- Commands are explicit and close to each framework default.
- Cross-application coordination is documented instead of hidden behind extra tooling.
- If the project grows into multiple apps or packages, workspace tooling can be reconsidered.
