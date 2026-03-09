# Contributing to Arkite UI

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

```bash
git clone git@gitlab.com:foson.co/arkite-ui.git
cd arkite-ui
npm install
npm run storybook    # Preview components at http://localhost:6006
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Watch mode (rebuild on change) |
| `npm run build` | Production build |
| `npm run storybook` | Launch Storybook |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Lint source code |
| `npm run typecheck` | TypeScript type check |

## Adding a New Component

1. Create a directory under `src/components/<component-name>/`
2. Create the component file (e.g., `MyComponent.tsx`) and an `index.ts` barrel export
3. Export from `src/index.ts`
4. Add a Storybook story under `src/stories/<category>/`
5. Add unit tests (`MyComponent.test.tsx`)

## Code Style

- TypeScript strict mode
- ESLint 9 flat config with react-hooks and jsx-a11y
- Tailwind CSS utility classes via `cn()` helper
- HSL CSS Variables for theming (see `src/styles/index.css`)
- `forwardRef` for all primitive components
- Export types alongside components

## Testing

We use Vitest + @testing-library/react. Tests live next to their component files:

```
src/components/button/
├── Button.tsx
├── Button.test.tsx
└── index.ts
```

Run tests: `npm run test`

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
3. Ensure `npm run lint && npm run typecheck && npm run test` pass
4. Open a merge request on GitLab

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
