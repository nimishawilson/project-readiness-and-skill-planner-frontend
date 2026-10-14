# CLAUDE.md

Angular 22 micro-frontend workspace (Native Federation, esbuild). Backend and functional spec live in the sibling folder and `../spec.md`; API docs in `../API_ENDPOINTS.md`.

## State
Only `projects/shell` (the dynamic host) exists, with empty placeholder folders and an empty `federation.manifest.json`. No features yet. Remotes (employee-directory, skills-matrix, learning-goals, project-management) are added as `projects/*`; see README.md for ports and steps.

## Commands
`npm start` (shell on :4200), `npm run build`, `npm test`.

## Conventions
- Standalone components, SCSS, signals. Prefix `app`.
- `main.ts` only calls `initFederation`; app bootstrap lives in `bootstrap.ts`.
- Keep Angular and rxjs shared as singletons (see `federation.config.mjs`) so remotes reuse the shell's instance.
- API base URL comes from `environments/environment.ts`.
