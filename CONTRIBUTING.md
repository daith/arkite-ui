# Contributing to Arkite UI

Thanks for your interest in contributing! Here's how to get started.

## Design Principle

Arkite UI is a **pure UI component library**. We do not include business logic, auth stores, permission hooks, or domain-specific behavior. Every component must be reusable across multiple projects without modification.

## Development Setup

```bash
git clone git@gitlab.com:foson.co/arkite-ui.git
cd arkite-ui
pnpm install
pnpm storybook       # Preview components at http://localhost:6006
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Watch mode (rebuild on change) |
| `pnpm build` | Production build (tsup) |
| `pnpm storybook` | Launch Storybook |
| `pnpm test` | Run unit tests (412 tests) |
| `pnpm test:watch` | Tests in watch mode |
| `pnpm test:coverage` | Tests with coverage report |
| `pnpm lint` | Lint source code (ESLint 9) |
| `pnpm typecheck` | TypeScript type check |
| `pnpm size` | Check bundle size budget |
| `pnpm chromatic` | Visual regression testing |
| `pnpm changeset` | Add a changeset for your MR |

## Adding a New Component

1. Create a directory under `src/components/<component-name>/`
2. Create the component file (e.g., `MyComponent.tsx`) and an `index.ts` barrel export
3. Add JSDoc comment on the exported component function
4. Export from `src/index.ts`
5. Add a Storybook story under `src/stories/<category>/`
6. Add unit tests (`MyComponent.test.tsx`)
7. Add a changeset: `pnpm changeset`

### Component Checklist

- [ ] Uses `forwardRef` for DOM element forwarding
- [ ] Accepts `className` prop merged via `cn()` helper
- [ ] Spreads `...props` for HTML attribute passthrough
- [ ] Follows density system for interactive components (sm=h-8, md=h-10, lg=h-12)
- [ ] Has JSDoc on the exported component
- [ ] Has unit tests
- [ ] Has Storybook story with controls

## Code Style

- TypeScript strict mode
- ESLint 9 flat config with `react-hooks` and `jsx-a11y`
- Tailwind CSS v4 utility classes via `cn()` helper
- HSL CSS Variables for theming (see `src/styles/index.css`)
- `forwardRef` for all primitive components
- Export types alongside components

## Density System

All interactive components follow a consistent sizing pattern:

| Size | Height | Usage |
|------|--------|-------|
| `sm` | `h-8` (32px) | Compact UIs, table cells |
| `md` | `h-10` (40px) | Default |
| `lg` | `h-12` (48px) | Touch targets, hero forms |

Components using density: Button, Input, Select, SearchInput, Combobox, DatePicker, Textarea.

## Testing

We use **Vitest + @testing-library/react**. Tests live next to their component files:

```
src/components/button/
├── Button.tsx
├── Button.test.tsx
└── index.ts
```

Run tests: `pnpm test`

### What to Test

- Rendering with default props
- All variants/sizes render correctly
- User interactions (click, type, toggle)
- Accessibility (roles, aria attributes, keyboard)
- Edge cases (empty state, error state, disabled)

## Changesets

We use [changesets](https://github.com/changesets/changesets) for versioning. **Every MR that changes the public API must include a changeset.**

```bash
# Add a changeset (interactive prompt)
pnpm changeset

# This creates a file in .changeset/ describing the change
# Commit it with your MR
```

CI will warn if a merge request is missing a changeset.

### Changeset Types

- `major` — Breaking changes (removed exports, renamed props)
- `minor` — New features (new components, new props)
- `patch` — Bug fixes, internal refactors

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` new feature
- `fix:` bug fix
- `refactor:` code refactoring
- `docs:` documentation
- `test:` test changes
- `chore:` maintenance

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes with tests
3. Add a changeset: `pnpm changeset`
4. Ensure `pnpm lint && pnpm typecheck && pnpm test` pass
5. Open a merge request on GitLab
6. CI runs lint, typecheck, test, size check, changeset check, and Chromatic

## Bundle Size Budget

We enforce bundle size budgets via [size-limit](https://github.com/ai/size-limit):

- `dist/index.js` < 300 KB
- `dist/tailwind-preset.js` < 10 KB

If your changes cause the bundle to exceed the budget, consider:
- Tree-shaking unused dependencies
- Lazy-loading heavy components
- Moving optional features behind peer dependencies

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
