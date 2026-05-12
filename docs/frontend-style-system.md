# Frontend style system

OpsBoard uses a small Sass style system to keep Angular component styles consistent without turning the demo into a heavy design-system project.

## Structure

```text
frontend/src/styles/
├── tokens/
│   ├── _breakpoints.scss
│   ├── _colors.scss
│   ├── _elevation.scss
│   ├── _radius.scss
│   ├── _spacing.scss
│   └── _typography.scss
├── mixins/
│   ├── _breakpoints.scss
│   ├── _elevation.scss
│   ├── _form-grid.scss
│   ├── _state-pill.scss
│   └── _surface.scss
├── theme/
│   └── _material-theme.scss
└── _index.scss
```

## Rules

- Keep user-facing text in Portuguese, but keep style token names and documentation in English.
- Put brand colors and runtime theme values in CSS custom properties through `tokens/_colors.scss`.
- Put build-time values such as spacing, radius, breakpoints, typography sizes, and shadows in Sass tokens.
- Mixins should consume tokens; component styles should consume mixins or token functions.
- Prefer existing shared classes such as `.surface`, `.content-section`, `.actions-row`, `.form-grid`, `.filters-grid`, `.status-pill`, and `.priority-pill` before adding component-specific patterns.
- Keep component-specific dimensions local when they describe actual layout structure, such as sidebar width, table side panel width, or chart column tracks.

## Component usage

Import the barrel from component SCSS files:

```scss
@use '../../../styles/index' as ops;
```

Nested feature paths may need one extra `../`, for example the login page:

```scss
@use '../../../../styles/index' as ops;
```

Use tokens for repeated values:

```scss
.example {
  gap: ops.space(16);
  border-radius: ops.radius(md);
  font-weight: ops.font-weight(medium);
}
```

Use breakpoint mixins instead of raw media queries:

```scss
@include ops.down(mobile) {
  .example {
    grid-template-columns: 1fr;
  }
}
```

Use grid mixins when building operational forms or filters. For desktop forms, keep common fields paired or grouped; reserve full-row layout for long text areas and deliberate action rows.
