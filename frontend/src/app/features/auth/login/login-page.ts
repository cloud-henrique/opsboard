import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss'
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  readonly auth = inject(AuthService);
  readonly demoAccounts = [
    'admin@opsboard.test / password',
    'manager@opsboard.test / password',
    'operator@opsboard.test / password',
    'viewer@opsboard.test / password'
  ];

  error = '';
  loading = false;
  passwordVisible = false;
  form = this.fb.nonNullable.group({
    email: ['admin@opsboard.test', [Validators.required, Validators.email]],
    password: ['password', [Validators.required]]
  });

  submit(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    this.error = '';
    this.loading = true;
    this.auth.login(this.form.getRawValue())
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => this.router.navigateByUrl('/app/dashboard'),
        error: () => this.error = 'Credenciais inválidas ou sessão indisponível.'
      });
  }
}
