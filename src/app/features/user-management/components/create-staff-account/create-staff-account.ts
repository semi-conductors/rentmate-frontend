import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-staff-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-staff-account.html',
})
export class CreateStaffAccountComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);

  loading = signal(false);
  serverError = signal<string | null>(null);
  showPassword = signal(false);
  showConfirm = signal(false);
  success = signal(false);

  roles = [
    { label: 'Admin', value: 'ADMIN' },
    { label: 'Delivery Guy', value: 'DELIVERY_GUY' },
  ];

  form = this.fb.group(
    {
      role: ['ADMIN', Validators.required],
      firstName: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
      ],
      lastName: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
      ],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]*$/),
          Validators.minLength(11),
          Validators.maxLength(11),
        ],
      ],
      password: [
        '',
        [Validators.required, Validators.minLength(6), Validators.maxLength(100)],
      ],
      confirmPassword: ['', Validators.required],
    },
    { validators: [passwordMatchValidator] }
  );

  // derived signals
  passwordMismatch = computed(() => {
    const errors = this.form.errors as ValidationErrors | null;
    return errors?.['passwordMismatch'] ?? false;
  });

  toggle(field: 'password' | 'confirm') {
    if (field === 'password') this.showPassword.update((v) => !v);
    else this.showConfirm.update((v) => !v);
  }

  submit() {
    this.serverError.set(null);
    this.success.set(false);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { confirmPassword, ...body } = this.form.value;
    this.loading.set(true);

    this.userService.createStaffAccount(body).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.success.set(true);
        setTimeout(() => this.router.navigate(['/users']), 2000);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.serverError.set(err.error?.detail || 'Failed to create account.');
      },
    });
  }

  get f() {
    return this.form.controls;
  }
}


function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const pass = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return pass && confirm && pass !== confirm ? { passwordMismatch: true } : null;
}