# ADR 0006: Audit Logs

## Status

Accepted.

## Context

Operational systems need traceability for status, priority, assignment, and management changes.

## Decision

Implement a small internal `AuditLogger` service backed by an `audit_logs` table. Store old values, new values, and metadata as JSON.

## Consequences

- The project demonstrates auditability without adding an external package.
- Controllers can record meaningful domain actions explicitly.
- Audit records can be exposed both globally and on request details.
