import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { AuditLog, PaginatedResponse } from '../../shared/models';

export interface AuditFilters {
  action?: string | null;
  user_id?: number | string | null;
  date_from?: string | null;
  date_to?: string | null;
  page?: number;
  per_page?: number;
}

@Injectable({ providedIn: 'root' })
export class AuditLogsService {
  private readonly http = inject(HttpClient);

  list(filters: AuditFilters = {}): Observable<PaginatedResponse<AuditLog>> {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<PaginatedResponse<AuditLog>>('/api/audit-logs', { params });
  }
}
