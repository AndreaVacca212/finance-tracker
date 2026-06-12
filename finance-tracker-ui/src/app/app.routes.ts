import { Routes } from '@angular/router';
import { Shell } from './layout/shell';

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'accounts',
        loadComponent: () => import('./pages/accounts/accounts').then(m => m.Accounts)
      },
      {
        path: 'transactions',
        loadComponent: () => import('./pages/transactions/transactions').then(m => m.Transactions)
      },
      {
        path: 'budget',
        loadComponent: () => import('./pages/budget/budget').then(m => m.Budget)
      }
    ]
  }
];