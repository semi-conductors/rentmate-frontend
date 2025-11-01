import { Component, effect, HostListener, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { UserSummary } from '../../models/user.summary';
import { Router } from '@angular/router';
import { SpaceifyPipe } from '../../../../core/pipes/specify-pipe';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, SpaceifyPipe],
  templateUrl: './user-management.html',
})
export class UserManagementComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  // Signals for state
  users = signal<UserSummary[]>([]);
  loading = signal(false);
  page = signal(1);
  totalPages = signal(1);
  totalItems = signal(0);
  limit = signal(10);

  // Filters and search
  role = signal<string | null>(null);
  status = signal<string | null>(null);
  isVerified = signal<boolean | null>(null);
  search = signal<string>('');

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.loading.set(true);


    const params = {
      page: this.page(),
      limit: this.limit(),
      role: this.role(),
      status: this.status(),
      isVerified: this.isVerified(),
      search: this.search().length >= 2 ? this.search() : undefined,
    };

    console.log('loaded users with ' + JSON.stringify(params));


    this.userService.getAllUsers(params).subscribe({
      next: (res) => {
        this.users.set(res.items);
        this.totalPages.set(res.totalPages);
        this.totalItems.set(res.totalItems);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  // Available options
  roleOptions = [
    { label: 'All Roles', value: null },
    { label: 'User', value: 'USER' },
    { label: 'Delivery Guy', value: 'DELIVERY_GUY' },
    { label: 'Admin', value: 'ADMIN' },
    { label: 'Manager', value: 'MANAGER' },
  ];

  statusOptions = [
    { label: 'All Statuses', value: null },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' },
    { label: 'Pending Report Review', value: 'PENDING_REPORT_REVIEW' },
    { label: 'Suspended by Admin', value: 'SUSPENDED_BY_ADMIN' },
  ];

  verificationOptions = [
    { label: 'All', value: null },
    { label: 'Verified', value: true },
    { label: 'Not Verified', value: false },
  ];

  // Dropdown open state
  dropdownOpen = signal<'role' | 'status' | 'verified' | null>(null);

  toggleDropdown(type: 'role' | 'status' | 'verified') {
    this.dropdownOpen.update((current) => (current === type ? null : type));
  }

  // Handle selections
  applyRoleFilter(role: string | null) {
    this.role.set(role);
    this.page.set(1);
    this.dropdownOpen.set(null);
    this.loadUsers();
  }

  applyStatusFilter(status: string | null) {
    this.status.set(status);
    this.page.set(1);
    this.dropdownOpen.set(null);
    this.loadUsers();
  }

  applyVerificationFilter(value: boolean | null) {
    this.isVerified.set(value);
    this.page.set(1);
    this.dropdownOpen.set(null);
    this.loadUsers();
  }

  onSearch(term: string) {
    this.search.set(term);
    this.page.set(1);
    this.loadUsers();
  }

  nextPage() {
    if (this.page() < this.totalPages()) {
      this.page.update((p) => p + 1);
      this.loadUsers();
    }
  }

  prevPage() {
    if (this.page() > 1) {
      this.page.update((p) => p - 1);
      this.loadUsers();
    }
  }

  manageUser(user: UserSummary) {
    this.router.navigate(['/admin/users', user.id]);
  }

  onCreateStuffAccountClick(){
    this.router.navigate(['/create-staff-account']);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.dropdownOpen.set(null);
    }
  }
}