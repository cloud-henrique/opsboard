# ADR 0005: Angular Material Theme

## Status

Accepted.

## Context

OpsBoard should feel like a sober internal system and avoid building a design system from scratch.

## Decision

Use Angular Material 21 with Material Design 3 theming and project-level SCSS tokens based on the OpsBoard palette.

## Consequences

- Components remain accessible and familiar.
- The UI receives a custom product identity without adding Tailwind or another UI framework.
- Visual polish focuses on spacing, contrast, layout, loading states, and operational clarity.
