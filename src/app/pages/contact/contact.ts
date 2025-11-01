import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-contact',
  template: `
    <div class="bg-secondary-dark p-6 rounded-lg">
      <h1 class="text-2xl font-bold mb-4">Contact Us</h1>
      <p class="text-gray-300">
        Get in touch with our team for any questions or support. We're here to help you with your rental needs.
      </p>
    </div>
  `
})
export class ContactComponent {}
