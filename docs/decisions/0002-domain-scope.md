# ADR 0002: Domain Scope

## Status

Accepted.

## Context

The project needs to look like a real product without becoming a generic CRUD or an oversized ERP.

## Decision

OpsBoard focuses on internal operational requests: registering demands, prioritizing work, assigning owners, tracking deadlines, reviewing dashboard metrics, and preserving audit history.

## Consequences

- The domain is broad enough to demonstrate permissions, workflows, filters, dashboard metrics, and audit logs.
- It stays narrower than CRM, ERP, healthcare, or full operations suites.
- Product documentation can explain realistic business rules without creating unnecessary modules.
