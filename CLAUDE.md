# CLAUDE.md

Angular 22 micro-frontend workspace (Native Federation, esbuild). Backend and functional spec live in the sibling folder and `../spec.md`; API docs in `../API_ENDPOINTS.md`.

## State

`projects/shell` (dynamic host) plus four remotes: `employee-directory` (4201), `skills-matrix` (4202), `learning-goals` (4203), `project-management` (4204). Each remote exposes `./routes`; `employee-directory` (mock data in `employee.mock.ts`), `skills-matrix` (mock data in `skill-matrix.mock.ts`, built on `app-data-grid`) and `learning-goals` (mock data in `learning-goals.mock.ts`, local signal state) have static-data UIs with no API yet, and `project-management` (mock data in `project-management.mock.ts`, readiness maths in `project-management.model.ts`) has a static-data UI too; the shell registers them in `public/federation.manifest.json` and lazy-loads them in `app.routes.ts`. The shell has the top nav (`layout/nav`); no auth yet. See README.md.

Shared UI library: `projects/ui-kit` (alias `@app/ui-kit`, prefix `app`; the built components and the plan for the rest are in `docs/reusable-components.md`). The alias maps to source in `tsconfig.json` `paths`, so Native Federation shares it as a singleton automatically; build alone with `npm run build:ui-kit`.

## Commands

`npm start` (shell only, :4200), `npm run start:all` (shell + remotes), `npm run build:all`, `npm test` (apps only; `ui-kit` is tested through its stories). Library: `npm run build:ui-kit`; Storybook for `ui-kit`: `npm run storybook` (:6006), `npm run build-storybook`, `npm run test:stories` (stories run as Vitest browser tests with a11y checks; needs `npx playwright install chromium` once).

## Conventions

- Standalone components, SCSS, signals. Prefix `app`.
- `main.ts` only calls `initFederation`; app bootstrap lives in `bootstrap.ts`.
- Keep Angular and rxjs shared as singletons (see `federation.config.mjs`) so remotes reuse the shell's instance.
- Every `ui-kit` component ships a `*.stories.ts` next to it (stories are excluded from the library build).
- Theme: colors come only from the `--app-color-*` CSS variables in `projects/ui-kit/src/styles/_tokens.scss`; never hard-code hex values in components. Each app's `styles.scss` does `@use '../../ui-kit/src/styles'`.
- API base URL comes from `environments/environment.ts`.
