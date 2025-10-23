import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-browse',
  template: `
    <div class="bg-secondary-dark p-6 rounded-lg">
      <h1 class="text-2xl font-bold mb-4">Browse Rentals</h1>
      <p class="text-gray-300">
        Discover amazing rental properties in your area. Use the filters to find the perfect place for your needs.
      </p>
    </div>
  `
})
export class BrowseComponent {}
