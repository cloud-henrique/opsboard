import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, finalize, map, of, switchMap, tap } from 'rxjs';

import { ResourceResponse, User, UserRole } from '../../shared/models';

interface LoginResponse {
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly currentUserSignal = signal<User | null>(null);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
  readonly role = computed(() => this.currentUserSignal()?.role ?? null);
  readonly loading = signal(false);

  csrf(): Observable<unknown> {
    return this.http.get('/sanctum/csrf-cookie');
  }

  login(credentials: LoginCredentials): Observable<User> {
    this.loading.set(true);

    return this.csrf().pipe(
      switchMap(() => this.http.post<LoginResponse>('/login', credentials)),
      map((response) => response.user),
      tap((user) => this.currentUserSignal.set(user)),
      finalize(() => this.loading.set(false))
    );
  }

  loadCurrentUser(): Observable<User | null> {
    if (this.currentUserSignal()) {
      return of(this.currentUserSignal());
    }

    return this.http.get<ResourceResponse<User>>('/api/me').pipe(
      map((response) => response.data),
      tap((user) => this.currentUserSignal.set(user))
    );
  }

  logout(): void {
    this.http.post('/logout', {}).pipe(
      finalize(() => {
        this.currentUserSignal.set(null);
        this.router.navigateByUrl('/login');
      })
    ).subscribe();
  }

  hasRole(...roles: UserRole[]): boolean {
    const user = this.currentUserSignal();
    return !!user && roles.includes(user.role);
  }
}
