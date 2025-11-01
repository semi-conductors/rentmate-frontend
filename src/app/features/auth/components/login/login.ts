import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { DeliveryListComponent } from '../../../delivery/components/delivery-list/delivery-list.component';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule, RouterLink, CommonModule ],
  templateUrl: './login.html',
})
export class LoginComponent {
  email = signal('');
  password = signal('');
  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');

  private auth = inject(AuthService);
  private router = inject(Router);

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onLogin() {
    this.errorMessage.set('');

    if (!this.email() || !this.password()) {
      this.errorMessage.set('Email and password are required');
      return;
    }

    this.isLoading.set(true);
    this.auth.login(this.email(), this.password()).subscribe({
      next: () => {
        this.isLoading.set(false);
        // المفروض اتشيك هنا ع الرول
        const user = this.auth.userSignal();
        const role = user?.role;
          if(role === 'DELIVERY_GUY') {
          this.router.navigate(['/deliveries']); // Changed from '/delivery-list'
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);

        if (err.status === 401 && err.error?.detail) {
          this.errorMessage.set(err.error.detail);
        } else {
          this.errorMessage.set('Login failed. Please try again.');
        }
      },
    });
  }
}
