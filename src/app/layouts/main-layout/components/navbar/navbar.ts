import { Component, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LogoutConfirmModalComponent } from '../../../../features/auth/components/logout-confirm-modal/logout-confirm-modal';
import { User } from '../../../../features/auth/models/user';
@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule,LogoutConfirmModalComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  /** Signal-based inputs */
  user = input<User | null>();
  showLogoutModal = signal(false);

  /** Signal-based outputs */
  toggleSidebar = output<void>();
  logout = output<void>();

  dropdownOpen = signal(false);

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  onToggleDropdown() {
    this.dropdownOpen.update(v => !v);
  }

  onLogout() {
    this.logout.emit();
    this.showLogoutModal.set(false);
  }
}