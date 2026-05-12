import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Category, ImportSummary, ResourceResponse } from '../../shared/models';

export interface CategoryPayload {
  name: string;
  description?: string | null;
  active: boolean;
}

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private readonly http = inject(HttpClient);

  list(active?: boolean): Observable<{ data: Category[] }> {
    return active === undefined
      ? this.http.get<{ data: Category[] }>('/api/categories')
      : this.http.get<{ data: Category[] }>('/api/categories', { params: { active } });
  }

  create(payload: CategoryPayload): Observable<ResourceResponse<Category>> {
    return this.http.post<ResourceResponse<Category>>('/api/categories', payload);
  }

  update(id: number, payload: Partial<CategoryPayload>): Observable<ResourceResponse<Category>> {
    return this.http.put<ResourceResponse<Category>>(`/api/categories/${id}`, payload);
  }

  import(file: File): Observable<ImportSummary> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<ImportSummary>('/api/categories/import', formData);
  }
}
