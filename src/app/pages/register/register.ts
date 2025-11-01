import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-register',
  template: `
    <div class="bg-secondary-dark p-6 rounded-lg">
      <h1 class="text-2xl font-bold mb-4">Register</h1>
      <p class="text-gray-300">
        Create a new RentMate account to start listing your properties or find your next rental.
      </p>
    </div>
  `
})
export class RegisterComponent {}
