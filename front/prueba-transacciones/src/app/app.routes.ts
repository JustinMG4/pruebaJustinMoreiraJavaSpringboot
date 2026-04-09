import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/home/home').then(m => m.Home)
    },
    {
        path: 'clientes',
        loadComponent: () => import('./features/clients/client-list/client-list').then(m => m.ClientListComponent)
    },
    {
        path: 'clientes/:id',
        loadComponent: () => import('./features/clients/client-detail/client-detail').then(m => m.ClientDetailComponent)
    },
    {
        path: 'cuentas/:id/movimientos',
        loadComponent: () => import('./features/accounts/account-statement/account-statement').then(m => m.AccountStatementComponent)
    },
    {
        path: 'cuentas',
        loadComponent: () => import('./features/accounts/account-list/account-list').then(m => m.AccountListComponent)
    },
    { path: '**', redirectTo: '' }
];