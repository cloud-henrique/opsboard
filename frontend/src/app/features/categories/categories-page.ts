import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';

import { PermissionService } from '../../core/auth/permission.service';
import { Category } from '../../shared/models';
import { CategoriesService } from './categories.service';

@Component({
  selector: 'app-categories-page',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatTableModule
  ],
  templateUrl: './categories-page.html',
  styleUrl: './categories-page.scss'
})
export class CategoriesPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(CategoriesService);
  private readonly snackBar = inject(MatSnackBar);
  readonly permissions = inject(PermissionService);
  readonly categories = signal<Category[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly editing = signal<Category | null>(null);
  readonly importMessage = signal('');
  readonly displayedColumns = ['name', 'description', 'active', 'actions'];

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: [''],
    active: [true]
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.service.list().subscribe({
      next: (response) => {
        this.categories.set(response.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  edit(category: Category): void {
    this.editing.set(category);
    this.form.patchValue({
      name: category.name,
      description: category.description ?? '',
      active: category.active
    });
  }

  reset(): void {
    this.editing.set(null);
    this.form.reset({ name: '', description: '', active: true });
  }

  submit(): void {
    if (this.form.invalid || this.saving() || !this.permissions.canManageCategories()) {
      this.form.markAllAsTouched();
      return;
    }

    const editing = this.editing();
    const request$ = editing
      ? this.service.update(editing.id, this.form.getRawValue())
      : this.service.create(this.form.getRawValue());

    this.saving.set(true);
    request$.subscribe({
      next: () => {
        this.snackBar.open('Categoria salva.', 'Fechar', { duration: 3000 });
        this.saving.set(false);
        this.reset();
        this.load();
      },
      error: () => this.saving.set(false)
    });
  }

  importCsv(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.service.import(file).subscribe({
      next: (summary) => {
        this.importMessage.set(`Importação concluida: ${summary.created} criadas, ${summary.updated} atualizadas, ${summary.failed} falhas.`);
        this.load();
        input.value = '';
      },
      error: () => this.importMessage.set('Não foi possivel importar o CSV.')
    });
  }
}
