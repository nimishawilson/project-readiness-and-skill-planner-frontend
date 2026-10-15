# Project Readiness & Skill Planner — Frontend

Angular micro-frontend workspace using [Native Federation](https://www.npmjs.com/package/@angular-architects/native-federation). The `shell` host and four remotes exist; the remotes only contain placeholder pages so far.

## Commands

```bash
npm install
npm start          # serve the shell only on http://localhost:4200
npm run start:all  # serve the shell and all four remotes together
npm run build:all  # production build of all five apps
npm run build      # production build of the shell -> dist/shell/browser (includes remoteEntry.json)
npm test           # unit tests
```

The backend API is expected at `http://localhost:3000/api` (`projects/shell/src/environments/environment.ts`).

## Layout

```
projects/shell/
  federation.config.mjs          # shared deps (singletons)
  public/federation.manifest.json  # remote name -> remoteEntry.json URL (remote name -> remoteEntry.json URL, dev ports)
  src/main.ts                    # initFederation, then imports bootstrap.ts
  src/bootstrap.ts               # bootstrapApplication
  src/app/{core,layout,pages,shared}   # empty placeholders
```

## Remotes

| Remote             | Port | Shell route       |
| ------------------ | ---- | ----------------- |
| shell              | 4200 | (host)            |
| employee-directory | 4201 | `/employees`      |
| skills-matrix      | 4202 | `/skills`         |
| learning-goals     | 4203 | `/learning-goals` |
| project-management | 4204 | `/projects`       |

Each remote exposes `./routes` (its `<name>.routes.ts`, exporting `ROUTES`), which the shell loads lazily in `app.routes.ts` via `loadRemoteModule`. Open only the shell URL; remotes also run standalone on their own port. If a remote isn't running, its route renders blank (no error fallback yet).

## Adding a remote

```bash
ng g application <name> --style=scss --routing --ssr=false --prefix=app
ng add @angular-architects/native-federation --project <name> --type remote --port <port>
```

Then set `exposes: { './routes': ... }` in the remote's `federation.config.mjs`, register it in the shell's `public/federation.manifest.json`, add a route in the shell's `app.routes.ts`, and add the app to the `start:all` / `build:all` scripts.
