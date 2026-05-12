import { DatePipe, JsonPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { PermissionService } from '../../core/auth/permission.service';
import { auditActionLabels, priorityClass, priorityLabels, statusClass, statusLabels } from '../../shared/labels';
import { AuditLog, OperationalRequest, RequestStatus, User } from '../../shared/models';
import { UsersService } from '../users/users.service';
import { RequestsService } from './requests.service';

@Component({
  selector: 'app-request-detail-page',
  imports: [
    DatePipe,
    JsonPipe,
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule,
    MatSelectModule
  ],
  templateUrl: './request-detail-page.html',
  styleUrl: './request-detail-page.scss'
})
export class RequestDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly requestsService = inject(RequestsService);
  private readonly usersService = inject(UsersService);
  private readonly snackBar = inject(MatSnackBar);
  readonly permissions = inject(PermissionService);
  readonly request = signal<OperationalRequest | null>(null);
  readonly auditLogs = signal<AuditLog[]>([]);
  readonly users = signal<User[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly statusLabels = statusLabels;
  readonly priorityLabels = priorityLabels;
  readonly auditActionLabels = auditActionLabels;
  readonly statusClass = statusClass;
  readonly priorityClass = priorityClass;
  readonly statusOptions = Object.entries(statusLabels);

  readonly statusForm = this.fb.nonNullable.group({
    status: ['open' as RequestStatus]
  });
  readonly assignForm = this.fb.group({
    assignee_id: [null as number | null]
  });

  ngOnInit(): void {
    this.usersService.list(true).subscribe((response) => this.users.set(response.data));
    this.load();
  }

  load(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading.set(true);
    this.requestsService.get(id).subscribe({
      next: ({ data }) => {
        this.request.set(data);
        this.statusForm.patchValue({ status: data.status });
        this.assignForm.patchValue({ assignee_id: data.assignee_id ?? null });
        this.loadAudit(id);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Não foi possivel carregar a solicitação.');
        this.loading.set(false);
      }
    });
  }

  changeStatus(): void {
    const item = this.request();

    if (!item) {
      return;
    }

    this.requestsService.updateStatus(item.id, this.statusForm.getRawValue().status).subscribe({
      next: ({ data }) => {
        this.request.set(data);
        this.loadAudit(data.id);
        this.snackBar.open('Status atualizado.', 'Fechar', { duration: 3000 });
      }
    });
  }

  assign(): void {
    const item = this.request();

    if (!item) {
      return;
    }

    this.requestsService.assign(item.id, this.assignForm.value.assignee_id ?? null).subscribe({
      next: ({ data }) => {
        this.request.set(data);
        this.loadAudit(data.id);
        this.snackBar.open('Responsável atualizado.', 'Fechar', { duration: 3000 });
      }
    });
  }

  resolve(): void {
    const item = this.request();

    if (item && confirm('Resolver esta solicitação?')) {
      this.requestsService.resolve(item.id).subscribe(({ data }) => {
        this.request.set(data);
        this.loadAudit(data.id);
      });
    }
  }

  cancel(): void {
    const item = this.request();

    if (item && confirm('Cancelar esta solicitação?')) {
      this.requestsService.cancel(item.id).subscribe(({ data }) => {
        this.request.set(data);
        this.loadAudit(data.id);
      });
    }
  }

  actionLabel(action: string): string {
    return this.auditActionLabels[action] ?? action;
  }

  private loadAudit(id: number): void {
    this.requestsService.auditLogs(id).subscribe({
      next: (response) => this.auditLogs.set(response.data),
      error: () => this.auditLogs.set([])
    });
  }
}
