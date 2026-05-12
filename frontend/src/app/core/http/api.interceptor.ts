import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);
  const isRelativeApi = request.url.startsWith('/api')
    || request.url.startsWith('/login')
    || request.url.startsWith('/logout')
    || request.url.startsWith('/sanctum');
  const xsrfToken = readCookie('XSRF-TOKEN');

  let headers = request.headers;

  if (xsrfToken && !['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    headers = headers.set('X-XSRF-TOKEN', xsrfToken);
  }

  const apiRequest = request.clone({
    url: isRelativeApi ? `${environment.apiUrl}${request.url}` : request.url,
    withCredentials: isRelativeApi || request.withCredentials,
    headers
  });

  return next(apiRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        router.navigateByUrl('/login');
      } else if (error.status === 403) {
        snackBar.open('Você não tem permissão para esta ação.', 'Fechar', { duration: 4500 });
      } else if (error.status === 419) {
        snackBar.open('Sessão expirada. Entre novamente.', 'Fechar', { duration: 4500 });
        router.navigateByUrl('/login');
      } else if (error.status >= 500) {
        snackBar.open('Não foi possível concluir a operação agora.', 'Fechar', { duration: 4500 });
      }

      return throwError(() => error);
    })
  );
};

function readCookie(name: string): string | null {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.split('=')[1] ?? '') : null;
}
