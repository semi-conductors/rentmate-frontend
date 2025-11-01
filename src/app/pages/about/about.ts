import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-about',
  template: `
    <div class="bg-secondary-dark p-6 rounded-lg">
      <h1 class="text-2xl font-bold mb-4">About Us</h1>
      <p class="text-gray-300">
        RentMate is your trusted partner in finding and managing rental properties. We connect property owners with tenants through our innovative platform.
      </p>
    </div>
  `
})
export class AboutComponent {}
