import { Component, OnInit, input, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

export interface MenuItem {
  label: string;
  icon?: string;
  route?: string;
  roles?: string[];
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent implements OnInit {
  /** Signals-based inputs */
  open = input<boolean>(true);
  userRole = input<string | null | undefined>();

  /** Signal-based output */
  toggleMobile = output<void>();

  menu = signal<MenuItem[]>([]);

  ngOnInit(): void {
    this.menu.set([
      { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
      {
        label: 'User Management', 
        icon: 'group',
        route: '/users',
        roles: ['ADMIN', 'MANAGER'],
      },
      { label: 'Verification Queue', icon: 'verified_user', route: '/verifications' },
      { label: 'Reports Dashboard', icon: 'bar_chart', route: '/reports' },
    ]);
  }

  visible(item: MenuItem): boolean {
    const role = this.userRole();
    if (!item.roles || item.roles.length === 0) return true;
    if (!role) return false;
    return item.roles.includes(role);
  }

  onMobileToggle() {
    this.toggleMobile.emit();
  }
}