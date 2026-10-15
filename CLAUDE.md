# CLAUDE.md

Angular 22 micro-frontend workspace (Native Federation, esbuild). Backend and functional spec live in the sibling folder and `../spec.md`; API docs in `../API_ENDPOINTS.md`.

## State
`projects/shell` (dynamic host) plus four remotes: `employee-directory` (4201), `skills-matrix` (4202), `learning-goals` (4203), `project-management` (4204). Each remote exposes `./routes` and currently renders a placeholder page; the shell registers them in `public/federation.manifest.json` and lazy-loads them in `app.routes.ts`. No real features, layout, or auth yet. See README.md.

Shared UI library: `projects/ui-kit` (alias `@app/ui-kit`, prefix `app`, no components yet). The alias maps to source in `tsconfig.json` `paths`, so Native Federation shares it as a singleton automatically; build alone with `npm run build:ui-kit`.

## Commands
`npm start` (shell only, :4200), `npm run start:all` (shell + remotes), `npm run build:all`, `npm test`.

## Conventions
- Standalone components, SCSS, signals. Prefix `app`.
- `main.ts` only calls `initFederation`; app bootstrap lives in `bootstrap.ts`.
- Keep Angular and rxjs shared as singletons (see `federation.config.mjs`) so remotes reuse the shell's instance.
- API base URL comes from `environments/environment.ts`.
