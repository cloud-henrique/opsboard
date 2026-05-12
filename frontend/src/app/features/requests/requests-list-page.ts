import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { PermissionService } from '../../core/auth/permission.service';
import { CategoriesService } from '../categories/categories.service';
import { UsersService } from '../users/users.service';
import { priorityClass, priorityLabels, statusClass, statusLabels } from '../../shared/labels';
import { Category, OperationalRequest, RequestPriority, RequestStatus, User } from '../../shared/models';
import { RequestFilters, RequestsService } from './requests.service';

@Component({
  selector: 'app-requests-list-page',
  imports: [
    DatePipe,
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSelectModule,
    MatTableModule
  ],
  templateUrl: './requests-list-page.html',
  styleUrl: './requests-list-page.scss'
})
export class RequestsListPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly requestsService = inject(RequestsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly usersService = inject(UsersService);
  readonly permissions = inject(PermissionService);
  readonly statusLabels = statusLabels;
  readonly priorityLabels = priorityLabels;
  readonly statusClass = statusClass;
  readonly priorityClass = priorityClass;
  readonly statusOptions = Object.entries(statusLabels);
  readonly priorityOptions = Object.entries(priorityLabels);
  readonly displayedColumns = ['title', 'status', 'priority', 'category', 'assignee', 'due_date', 'actions'];
  readonly requests = signal<OperationalRequest[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly users = signal<User[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly total = signal(0);
  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);

  readonly filters = this.fb.group({
    search: [''],
    status: [''],
    priority: [''],
    category_id: [''],
    assignee_id: [''],
    date_from: [''],
    date_to: ['']
  });

  ngOnInit(): void {
    this.loadOptions();
    this.loadRequests();
  }

  loadRequests(page = this.pageIndex()): void {
    this.loading.set(true);
    this.error.set('');
    this.pageIndex.set(page);

    this.requestsService.list(this.currentFilters()).pipe(
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (response) => {
        this.requests.set(response.data);
        this.total.set(response.meta?.total ?? response.data.length);
      },
      error: () => this.error.set('Não foi possivel carregar as solicitações.')
    });
  }

  applyFilters(): void {
    this.loadRequests(0);
  }

  clearFilters(): void {
    this.filters.reset({
      search: '',
      status: '',
      priority: '',
      category_id: '',
      assignee_id: '',
      date_from: '',
      date_to: ''
    });
    this.loadRequests(0);
  }

  pageChanged(event: PageEvent): void {
    this.pageSize.set(event.pageSize);
    this.loadRequests(event.pageIndex);
  }

  exportCsv(): void {
    this.requestsService.export(this.currentFilters()).subscribe((blob) => {
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `opsboard-requests-${new Date().toISOString().slice(0, 10)}.csv`;
      anchor.click();
      URL.revokeObjectURL(url);
    });
  }

  statusLabel(status: RequestStatus): string {
    return this.statusLabels[status];
  }

  priorityLabel(priority: RequestPriority): string {
    return this.priorityLabels[priority];
  }

  private loadOptions(): void {
    this.categoriesService.list(true).subscribe((response) => this.categories.set(response.data));
    this.usersService.list(true).subscribe((response) => this.users.set(response.data));
  }

  private currentFilters(): RequestFilters {
    const raw = this.filters.getRawValue();

    return {
      search: raw.search ?? '',
      status: raw.status as RequestStatus | '',
      priority: raw.priority as RequestPriority | '',
      category_id: raw.category_id,
      assignee_id: raw.assignee_id,
      date_from: raw.date_from ?? '',
      date_to: raw.date_to ?? '',
      page: this.pageIndex() + 1,
      per_page: this.pageSize(),
      sort: 'created_at',
      direction: 'desc'
    };
  }
}
