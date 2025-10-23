import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';


@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  email = signal('');
  password = signal('');
  showPassword = signal(false);
  isLoading = signal(false);

  private auth = inject(AuthService);
  private router = inject(Router);

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onLogin() {
    if (!this.email() || !this.password()) return;

    this.isLoading.set(true);
    this.auth.login(this.email(),this.password() ).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/']);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }
}
