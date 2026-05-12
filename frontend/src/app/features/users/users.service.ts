import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ResourceResponse, User, UserRole } from '../../shared/models';

export interface UserPayload {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  active: boolean;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);

  list(active?: boolean): Observable<{ data: User[] }> {
    return active === undefined
      ? this.http.get<{ data: User[] }>('/api/users')
      : this.http.get<{ data: User[] }>('/api/users', { params: { active } });
  }

  create(payload: UserPayload): Observable<ResourceResponse<User>> {
    return this.http.post<ResourceResponse<User>>('/api/users', payload);
  }

  update(id: number, payload: Partial<UserPayload>): Observable<ResourceResponse<User>> {
    return this.http.put<ResourceResponse<User>>(`/api/users/${id}`, payload);
  }
}
