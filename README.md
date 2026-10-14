# Project Readiness & Skill Planner — Frontend

Angular micro-frontend workspace using [Native Federation](https://www.npmjs.com/package/@angular-architects/native-federation). Only the empty `shell` host exists so far; the feature remotes are added later.

## Commands

```bash
npm install
npm start          # serve the shell on http://localhost:4200
npm run build      # production build -> dist/shell/browser (includes remoteEntry.json)
npm test           # unit tests
```

The backend API is expected at `http://localhost:3000/api` (`projects/shell/src/environments/environment.ts`).

## Layout

```
projects/shell/
  federation.config.mjs          # shared deps (singletons)
  public/federation.manifest.json  # remote name -> remoteEntry.json URL ({} for now)
  src/main.ts                    # initFederation, then imports bootstrap.ts
  src/bootstrap.ts               # bootstrapApplication
  src/app/{core,layout,pages,shared}   # empty placeholders
```

## Planned remotes and ports

| App                | Port |
| ------------------ | ---- |
| shell              | 4200 |
| employee-directory | 4201 |
| skills-matrix      | 4202 |
| learning-goals     | 4203 |
| project-management | 4204 |

## Adding a remote

```bash
ng g application <name> --style=scss --routing --ssr=false --prefix=app
ng add @angular-architects/native-federation --project <name> --type remote --port <port>
```

Then expose its routes in the remote's `federation.config.mjs`, register it in the shell's `public/federation.manifest.json`, and add a `loadRemoteModule` route in `app.routes.ts`.
