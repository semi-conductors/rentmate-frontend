import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})

export class ForgotPasswordComponent {
  email = signal('');
  isLoading = signal(false);
  private auth = inject(AuthService);
  private router = inject(Router);

  onSubmit() {
    if (!this.email()) return;
    this.isLoading.set(true);
    this.auth.requestPasswordReset(this.email()).subscribe({
      next: () => {
        this.isLoading.set(false);
        alert('Password reset link sent! Check your inbox.');
        this.router.navigate(['/reset-password']);
      },
      error: () => {
        this.isLoading.set(false);
        alert('Failed to send reset link, try again later.');
      },
    });
  }
}