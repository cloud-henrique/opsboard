import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { AuditLog, OperationalRequest, PaginatedResponse, RequestPriority, RequestStatus, ResourceResponse } from '../../shared/models';

export interface RequestFilters {
  search?: string | null;
  status?: RequestStatus | '' | null;
  priority?: RequestPriority | '' | null;
  category_id?: number | string | null;
  assignee_id?: number | string | null;
  requester_id?: number | string | null;
  date_from?: string | null;
  date_to?: string | null;
  page?: number;
  per_page?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
}

export interface RequestPayload {
  title: string;
  description: string;
  category_id: number;
  priority: RequestPriority;
  assignee_id?: number | null;
  due_date?: string | null;
}

@Injectable({ providedIn: 'root' })
export class RequestsService {
  private readonly http = inject(HttpClient);

  list(filters: RequestFilters = {}): Observable<PaginatedResponse<OperationalRequest>> {
    return this.http.get<PaginatedResponse<OperationalRequest>>('/api/requests', {
      params: this.params(filters)
    });
  }

  get(id: number): Observable<ResourceResponse<OperationalRequest>> {
    return this.http.get<ResourceResponse<OperationalRequest>>(`/api/requests/${id}`);
  }

  create(payload: RequestPayload): Observable<ResourceResponse<OperationalRequest>> {
    return this.http.post<ResourceResponse<OperationalRequest>>('/api/requests', payload);
  }

  update(id: number, payload: Partial<RequestPayload>): Observable<ResourceResponse<OperationalRequest>> {
    return this.http.put<ResourceResponse<OperationalRequest>>(`/api/requests/${id}`, payload);
  }

  updateStatus(id: number, status: RequestStatus): Observable<ResourceResponse<OperationalRequest>> {
    return this.http.patch<ResourceResponse<OperationalRequest>>(`/api/requests/${id}/status`, { status });
  }

  assign(id: number, assigneeId: number | null): Observable<ResourceResponse<OperationalRequest>> {
    return this.http.patch<ResourceResponse<OperationalRequest>>(`/api/requests/${id}/assign`, { assignee_id: assigneeId });
  }

  resolve(id: number): Observable<ResourceResponse<OperationalRequest>> {
    return this.http.post<ResourceResponse<OperationalRequest>>(`/api/requests/${id}/resolve`, {});
  }

  cancel(id: number): Observable<ResourceResponse<OperationalRequest>> {
    return this.http.post<ResourceResponse<OperationalRequest>>(`/api/requests/${id}/cancel`, {});
  }

  export(filters: RequestFilters = {}): Observable<Blob> {
    return this.http.get('/api/requests/export', {
      params: this.params(filters),
      responseType: 'blob'
    });
  }

  auditLogs(id: number): Observable<PaginatedResponse<AuditLog>> {
    return this.http.get<PaginatedResponse<AuditLog>>(`/api/requests/${id}/audit-logs`);
  }

  private params(filters: RequestFilters): HttpParams {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return params;
  }
}
