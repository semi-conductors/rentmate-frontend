import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; 

import { Router } from '@angular/router';
@Component({
  selector: 'app-reset-password',
  imports: [FormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPasswordComponent {
  newPassword = signal('');
  confirmPassword = signal('');
  token = signal('');
  showPassword = signal(false);
  isLoading = signal(false);

  private auth = inject(AuthService);
  private router = inject(Router);

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onSubmit() {
    if (this.newPassword() !== this.confirmPassword()) {
      alert('Passwords do not match!');
      return;
    }

    this.isLoading.set(true);
    this.auth.confirmPasswordReset(this.token(), this.newPassword()).subscribe({
      next: () => {
        this.isLoading.set(false);
        alert('Password updated successfully! You can now log in.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 404) alert('Invalid or expired token.');
        else alert('Failed to reset password.');
      },
    });
  }
}