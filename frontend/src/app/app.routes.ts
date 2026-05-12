import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';
import { AppLayout } from './core/layout/app-layout';
import { LoginPage } from './features/auth/login/login-page';
import { AuditLogsPage } from './features/audit-logs/audit-logs-page';
import { CategoriesPage } from './features/categories/categories-page';
import { DashboardPage } from './features/dashboard/dashboard-page';
import { RequestDetailPage } from './features/requests/request-detail-page';
import { RequestFormPage } from './features/requests/request-form-page';
import { RequestsListPage } from './features/requests/requests-list-page';
import { UsersPage } from './features/users/users-page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'app/dashboard' },
  { path: 'login', component: LoginPage },
  {
    path: 'app',
    component: AppLayout,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardPage },
      { path: 'requests', component: RequestsListPage },
      { path: 'requests/new', component: RequestFormPage },
      { path: 'requests/:id/edit', component: RequestFormPage },
      { path: 'requests/:id', component: RequestDetailPage },
      { path: 'categories', component: CategoriesPage },
      { path: 'users', component: UsersPage, canActivate: [roleGuard], data: { roles: ['admin'] } },
      { path: 'audit-logs', component: AuditLogsPage, canActivate: [roleGuard], data: { roles: ['admin', 'manager'] } }
    ]
  },
  { path: '**', redirectTo: 'app/dashboard' }
];
