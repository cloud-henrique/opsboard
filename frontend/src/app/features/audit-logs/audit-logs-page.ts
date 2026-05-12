import { DatePipe, JsonPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

import { auditActionLabels } from '../../shared/labels';
import { AuditLog, User } from '../../shared/models';
import { UsersService } from '../users/users.service';
import { AuditLogsService } from './audit-logs.service';

@Component({
  selector: 'app-audit-logs-page',
  imports: [
    DatePipe,
    JsonPipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSelectModule,
    MatTableModule
  ],
  templateUrl: './audit-logs-page.html',
  styleUrl: './audit-logs-page.scss'
})
export class AuditLogsPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(AuditLogsService);
  private readonly usersService = inject(UsersService);
  readonly logs = signal<AuditLog[]>([]);
  readonly users = signal<User[]>([]);
  readonly loading = signal(true);
  readonly total = signal(0);
  readonly pageIndex = signal(0);
  readonly pageSize = signal(20);
  readonly auditActionLabels = auditActionLabels;
  readonly actionOptions = Object.entries(auditActionLabels);
  readonly displayedColumns = ['action', 'user', 'created_at', 'values'];

  readonly filters = this.fb.group({
    action: [''],
    user_id: [''],
    date_from: [''],
    date_to: ['']
  });

  ngOnInit(): void {
    this.usersService.list(true).subscribe((response) => this.users.set(response.data));
    this.load();
  }

  load(page = this.pageIndex()): void {
    this.pageIndex.set(page);
    this.loading.set(true);
    this.service.list({
      ...this.filters.getRawValue(),
      page: this.pageIndex() + 1,
      per_page: this.pageSize()
    }).subscribe({
      next: (response) => {
        this.logs.set(response.data);
        this.total.set(response.meta?.total ?? response.data.length);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  clear(): void {
    this.filters.reset({ action: '', user_id: '', date_from: '', date_to: '' });
    this.load(0);
  }

  pageChanged(event: PageEvent): void {
    this.pageSize.set(event.pageSize);
    this.load(event.pageIndex);
  }

  actionLabel(action: string): string {
    return this.auditActionLabels[action] ?? action;
  }
}
