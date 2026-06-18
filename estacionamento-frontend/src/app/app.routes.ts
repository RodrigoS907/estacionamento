import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell/shell.component').then(m => m.ShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'portaria' },
      {
        path: 'portaria',
        loadComponent: () => import('./features/portaria/portaria.component').then(m => m.PortariaComponent)
      },
      {
        path: 'veiculos',
        loadComponent: () => import('./features/veiculos/veiculos-list.component').then(m => m.VeiculosListComponent)
      },
      {
        path: 'veiculos/novo',
        loadComponent: () => import('./features/veiculos/veiculos-form.component').then(m => m.VeiculosFormComponent)
      },
      {
        path: 'veiculos/:id',
        loadComponent: () => import('./features/veiculos/veiculos-form.component').then(m => m.VeiculosFormComponent)
      },
      {
        path: 'mensalistas',
        canActivate: [adminGuard],
        loadComponent: () => import('./features/mensalistas/mensalistas-list.component').then(m => m.MensalistasListComponent)
      },
      {
        path: 'mensalistas/novo',
        canActivate: [adminGuard],
        loadComponent: () => import('./features/mensalistas/mensalistas-form.component').then(m => m.MensalistasFormComponent)
      },
      {
        path: 'mensalistas/:id',
        canActivate: [adminGuard],
        loadComponent: () => import('./features/mensalistas/mensalistas-form.component').then(m => m.MensalistasFormComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
