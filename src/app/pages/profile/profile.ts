import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-profile',
  template: `
    <div class="bg-secondary-dark p-6 rounded-lg">
      <h1 class="text-2xl font-bold mb-4">My Profile</h1>
      <p class="text-gray-300">
        Manage your account settings, preferences, and personal information.
      </p>
    </div>
  `
})
export class ProfileComponent {}
