# Product Overview

OpsBoard is a demonstrative fullstack application for managing internal operational requests.

The system simulates a company workflow where people register demands, prioritize requests, assign owners, monitor deadlines, review indicators, and preserve a history of changes for audit purposes.

The goal is to demonstrate a realistic web architecture focused on product thinking, business rules, maintenance, documentation, and fullstack best practices.

## Fictional audience

- Internal operations teams.
- Managers who need visibility over requests and bottlenecks.
- Operators responsible for execution.
- Viewers who need read-only operational context.

## Simulated problem

Operational requests often arrive through fragmented channels. OpsBoard centralizes the work queue, creates a shared source of truth, and makes changes traceable.

## Main flows

- Log in with a role-based demo account.
- Create and classify a request.
- Assign a responsible operator.
- Change status and priority during the request lifecycle.
- Resolve or cancel requests.
- Filter requests and export CSV data.
- Import category data from CSV.
- Review dashboard indicators and audit history.

## In scope

- Authentication with Sanctum SPA flow.
- Dashboard metrics.
- Request, category, user, and audit APIs.
- Role-based permissions enforced by the backend.
- Angular UI with Material components.
- CSV import/export.
- Docker local setup.
- Documentation and basic tests.

## Out of scope

- Real notifications.
- Multi-tenant organizations.
- Billing.
- External integrations.
- Production deployment.
- Complex workflow automation.

## Project status

In development as a portfolio-grade demonstration project.

## Portfolio positioning

OpsBoard should be presented as a product engineering case: a realistic internal operations panel with fullstack architecture, documented decisions, and maintainable implementation choices.
