import { Component, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule ,  Validators, FormBuilder} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { catchError, throwError } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.html',
})
export class RegisterComponent {
  showPassword = false;
  loading = signal(false);

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      confirmPassword: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{11}$/)]],
    })
  }

  form: any;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  getError(controlName: string): string {
    const c = this.form.controls[controlName];
    if (c.errors?.['required']) return `${this.capitalize(controlName)} is required`;
    if (c.errors?.['email']) return 'Invalid email address';
    if (c.errors?.['minlength'])
      return `${this.capitalize(controlName)} must be at least ${c.errors['minlength'].requiredLength} characters`;
    if (c.errors?.['maxlength'])
      return `${this.capitalize(controlName)} must be less than ${c.errors['maxlength'].requiredLength} characters`;
    if (c.errors?.['pattern']) return 'Invalid phone number format';
    if (controlName === 'confirmPassword' && this.form.value.password !== c.value)
      return 'Passwords do not match';
    return '';
  }

  private capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  onSubmit() {
    if (this.form.invalid) return;
    const { confirmPassword, ...data } = this.form.value;

    this.loading.set(true);
    this.auth.register(data).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
  
  // onSubmit() {
  //   this.errorMsg.set(null);

  //   if (this.password() !== this.confirmPassword()) {
  //     this.errorMsg.set('Passwords do not match.');
  //     return;
  //   }

  //   this.isLoading.set(true);

  //   this.auth
  //     .register({
  //       firstName: this.firstName(),
  //       lastName: this.lastName(),
  //       email: this.email(),
  //       password: this.password(),
  //       phoneNumber: this.phoneNumber(),
  //     })
  //     .pipe(
  //       catchError((err) => {
  //         this.isLoading.set(false);
  //         if (err.status === 409) {
  //           this.errorMsg.set('An account with this email or phone already exists.');
  //         } else {
  //           this.errorMsg.set('Registration failed. Please try again later.');
  //         }
  //         return throwError(() => err);
  //       })
  //     )
  //     .subscribe(() => this.isLoading.set(false));
  // }
}