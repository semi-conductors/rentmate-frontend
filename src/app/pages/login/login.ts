import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-login',
  template: `
    <div class="bg-secondary-dark p-6 rounded-lg">
      <h1 class="text-2xl font-bold mb-4">Login</h1>
      <p class="text-gray-300">
        Sign in to your RentMate account to access your dashboard and manage your properties.
      </p>
    </div>
  `
})
export class LoginComponent {}
