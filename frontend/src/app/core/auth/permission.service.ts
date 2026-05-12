import { Injectable, inject } from '@angular/core';

import { OperationalRequest, UserRole } from '../../shared/models';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private readonly auth = inject(AuthService);

  canCreateRequest(): boolean {
    return this.hasAny('admin', 'manager', 'operator');
  }

  canEditRequest(request: OperationalRequest): boolean {
    const user = this.auth.currentUser();

    if (!user) {
      return false;
    }

    if (this.hasAny('admin', 'manager')) {
      return true;
    }

    return user.role === 'operator'
      && request.assignee_id === user.id
      && request.status !== 'cancelled';
  }

  canChangeStatus(request: OperationalRequest): boolean {
    return this.canEditRequest(request);
  }

  canAssignRequest(): boolean {
    return this.hasAny('admin', 'manager');
  }

  canManageCategories(): boolean {
    return this.hasAny('admin', 'manager');
  }

  canManageUsers(): boolean {
    return this.hasAny('admin');
  }

  canViewAudit(): boolean {
    return this.hasAny('admin', 'manager');
  }

  canExportRequests(): boolean {
    return this.hasAny('admin', 'manager', 'operator');
  }

  canImportCategories(): boolean {
    return this.hasAny('admin', 'manager');
  }

  hasAny(...roles: UserRole[]): boolean {
    return roles.some((role) => this.auth.hasRole(role));
  }
}
