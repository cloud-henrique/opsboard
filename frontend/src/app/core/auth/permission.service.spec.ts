import { TestBed } from '@angular/core/testing';

import { OperationalRequest, User } from '../../shared/models';
import { AuthService } from './auth.service';
import { PermissionService } from './permission.service';

describe('PermissionService', () => {
  const operator: User = {
    id: 7,
    name: 'Operator',
    email: 'operator@opsboard.test',
    role: 'operator',
    active: true
  };

  function setup(user: User | null) {
    TestBed.configureTestingModule({
      providers: [
        PermissionService,
        {
          provide: AuthService,
          useValue: {
            currentUser: () => user,
            hasRole: (role: string) => user?.role === role
          }
        }
      ]
    });

    return TestBed.inject(PermissionService);
  }

  it('allows operators to edit assigned requests', () => {
    const service = setup(operator);
    const request = { assignee_id: operator.id, status: 'open' } as OperationalRequest;

    expect(service.canEditRequest(request)).toBe(true);
  });

  it('does not allow operators to export if no user is authenticated', () => {
    const service = setup(null);

    expect(service.canExportRequests()).toBe(false);
  });
});
