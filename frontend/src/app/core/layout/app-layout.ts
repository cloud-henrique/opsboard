import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { PermissionService } from '../auth/permission.service';
import { AuthService } from '../auth/auth.service';
import { roleLabels } from '../../shared/labels';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  visible: boolean;
}

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule
  ],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.scss'
})
export class AppLayout {
  readonly auth = inject(AuthService);
  private readonly permissions = inject(PermissionService);
  readonly roleLabels = roleLabels;

  readonly navItems = computed<NavItem[]>(() => [
    { label: 'Dashboard', icon: 'dashboard', route: '/app/dashboard', visible: true },
    { label: 'Solicitações', icon: 'assignment', route: '/app/requests', visible: true },
    { label: 'Categorias', icon: 'category', route: '/app/categories', visible: true },
    { label: 'Usuários', icon: 'group', route: '/app/users', visible: this.permissions.canManageUsers() },
    { label: 'Auditoria', icon: 'manage_search', route: '/app/audit-logs', visible: this.permissions.canViewAudit() }
  ]);

  logout(): void {
    this.auth.logout();
  }
}
