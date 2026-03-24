import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./performance-showcase/performance-showcase.component').then(
        (m) => m.PerformanceShowcaseComponent,
      ),
  },
];
