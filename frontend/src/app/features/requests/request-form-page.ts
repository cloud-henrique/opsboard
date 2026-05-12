import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { priorityLabels } from '../../shared/labels';
import { Category, RequestPriority, User } from '../../shared/models';
import { CategoriesService } from '../categories/categories.service';
import { UsersService } from '../users/users.service';
import { RequestsService } from './requests.service';

@Component({
  selector: 'app-request-form-page',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule
  ],
  templateUrl: './request-form-page.html',
  styleUrl: './request-form-page.scss'
})
export class RequestFormPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly requestsService = inject(RequestsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly usersService = inject(UsersService);
  readonly priorityLabels = priorityLabels;
  readonly priorityOptions = Object.entries(priorityLabels);
  readonly categories = signal<Category[]>([]);
  readonly users = signal<User[]>([]);
  readonly requestId = signal<number | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal('');

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(160)]],
    description: ['', [Validators.required]],
    category_id: [0, [Validators.required, Validators.min(1)]],
    priority: ['medium' as RequestPriority, [Validators.required]],
    assignee_id: [null as number | null],
    due_date: ['']
  });

  ngOnInit(): void {
    this.categoriesService.list(true).subscribe((response) => this.categories.set(response.data));
    this.usersService.list(true).subscribe((response) => this.users.set(response.data));

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.requestId.set(id);
      this.loading.set(true);
      this.requestsService.get(id).pipe(finalize(() => this.loading.set(false))).subscribe({
        next: ({ data }) => this.form.patchValue({
          title: data.title,
          description: data.description,
          category_id: data.category_id,
          priority: data.priority,
          assignee_id: data.assignee_id ?? null,
          due_date: data.due_date ? data.due_date.slice(0, 10) : ''
        }),
        error: () => this.error.set('Não foi possivel carregar a solicitação.')
      });
    }
  }

  submit(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.form.getRawValue(),
      due_date: this.form.controls.due_date.value || null
    };
    const id = this.requestId();
    const request$ = id
      ? this.requestsService.update(id, payload)
      : this.requestsService.create(payload);

    this.saving.set(true);
    request$.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: ({ data }) => {
        this.snackBar.open('Solicitação salva.', 'Fechar', { duration: 3500 });
        this.router.navigate(['/app/requests', data.id]);
      },
      error: () => this.error.set('Revise os campos e tente novamente.')
    });
  }
}
