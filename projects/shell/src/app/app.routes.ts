import { loadRemoteModule } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';

const remoteRoutes = (remoteName: string) => () =>
  loadRemoteModule(remoteName, './routes').then((m) => m.ROUTES);

export const routes: Routes = [
  { path: 'employees', loadChildren: remoteRoutes('employee-directory') },
  { path: 'skills', loadChildren: remoteRoutes('skills-matrix') },
  { path: 'learning-goals', loadChildren: remoteRoutes('learning-goals') },
  { path: 'projects', loadChildren: remoteRoutes('project-management') },
];
