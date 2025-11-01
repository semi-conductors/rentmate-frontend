import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  template: `
    <div class="bg-secondary-dark p-6 rounded-lg">
      <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
      <p class="text-gray-300 mb-4">
        Welcome to RentMate! This is the main dashboard where you can manage your rental properties and bookings.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="bg-primary-dark p-4 rounded-lg">
          <h3 class="text-lg font-semibold text-text-light mb-2">Total Properties</h3>
          <p class="text-3xl font-bold text-primary-accent">12</p>
        </div>
        <div class="bg-primary-dark p-4 rounded-lg">
          <h3 class="text-lg font-semibold text-text-light mb-2">Active Bookings</h3>
          <p class="text-3xl font-bold text-primary-accent">8</p>
        </div>
        <div class="bg-primary-dark p-4 rounded-lg">
          <h3 class="text-lg font-semibold text-text-light mb-2">Monthly Revenue</h3>
          <p class="text-3xl font-bold text-primary-accent">$2,450</p>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {}
