import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';

import { roleLabels } from '../../shared/labels';
import { User, UserRole } from '../../shared/models';
import { UsersService } from './users.service';

@Component({
  selector: 'app-users-page',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTableModule
  ],
  templateUrl: './users-page.html',
  styleUrl: './users-page.scss'
})
export class UsersPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(UsersService);
  private readonly snackBar = inject(MatSnackBar);
  readonly users = signal<User[]>([]);
  readonly editing = signal<User | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly roleLabels = roleLabels;
  readonly roleOptions = Object.entries(roleLabels);
  readonly displayedColumns = ['name', 'email', 'role', 'active', 'actions'];

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    role: ['operator' as UserRole, [Validators.required]],
    active: [true]
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.service.list().subscribe({
      next: (response) => {
        this.users.set(response.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  edit(user: User): void {
    this.editing.set(user);
    this.form.patchValue({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      active: user.active
    });
  }

  reset(): void {
    this.editing.set(null);
    this.form.reset({
      name: '',
      email: '',
      password: '',
      role: 'operator',
      active: true
    });
  }

  submit(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    const editing = this.editing();
    const payload = this.form.getRawValue();
    const request$ = editing
      ? this.service.update(editing.id, payload)
      : this.service.create({ ...payload, password: payload.password || 'password' });

    this.saving.set(true);
    request$.subscribe({
      next: () => {
        this.snackBar.open('Usuário salvo.', 'Fechar', { duration: 3000 });
        this.saving.set(false);
        this.reset();
        this.load();
      },
      error: () => this.saving.set(false)
    });
  }

  roleLabel(role: UserRole): string {
    return this.roleLabels[role];
  }
}
