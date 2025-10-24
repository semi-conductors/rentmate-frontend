import { Component, inject, signal } from '@angular/core';
import { VerificationResponse } from '../../models/verification.response';
import { VerificationService } from '../../services/verification.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verification-queue',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './verification-queue.html',
})
export class VerificationQueueComponent {
  private service = inject(VerificationService)
  private router = inject(Router);

  verifications = signal<VerificationResponse[]>([]);
  page = signal(1);
  totalPages = signal(1);
  totalItems = signal(0);
  hasNext = signal(false);
  hasPrevious = signal(false);
  loading = signal(false);

  dropdownOpen = signal<string | null>(null);
  statusFilter = signal<'PENDING' | 'APPROVED' | 'REJECTED' | null>(null);
  sortBy = signal<'id' | 'createdAt' | 'reviewedAt'>('createdAt');
  sortOrder = signal<'asc' | 'desc'>('desc');

  statusOptions = [
    { label: 'All', value: null },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Rejected', value: 'REJECTED' },
  ];

  sortOptions = [
    { label: 'Newest First', value: { sortBy: 'createdAt', sortOrder: 'desc' } },
    { label: 'Oldest First', value: { sortBy: 'createdAt', sortOrder: 'asc' } },
    { label: 'By ID (Asc)', value: { sortBy: 'id', sortOrder: 'asc' } },
    { label: 'By ID (Desc)', value: { sortBy: 'id', sortOrder: 'desc' } },
  ];

  async ngOnInit() {
    await this.loadVerifications();
  }

  toggleDropdown(type: string) {
    this.dropdownOpen.set(this.dropdownOpen() === type ? null : type);
  }

  async applyStatusFilter(value: any) {
    this.statusFilter.set(value);
    this.dropdownOpen.set(null);
    await this.loadVerifications();
  }

  async applySort(value: any) {
    this.sortBy.set(value.sortBy);
    this.sortOrder.set(value.sortOrder);
    this.dropdownOpen.set(null);
    await this.loadVerifications();
  }

  async loadVerifications() {
    this.loading.set(true);
    try {
      const data = await this.service.getVerifications(
        this.page(),
        10,
        this.statusFilter(),
        this.sortBy(),
        this.sortOrder()
      );
      this.verifications.set(data.items);
      this.totalPages.set(data.totalPages);
      this.totalItems.set(data.totalItems);
      this.hasNext.set(data.hasNext);
      this.hasPrevious.set(data.hasPrevious);
    } finally {
      this.loading.set(false);
    }
  }

  async nextPage() {
    if (this.hasNext()) {
      this.page.update((p) => p + 1);
      await this.loadVerifications();
    }
  }

  async prevPage() {
    if (this.hasPrevious()) {
      this.page.update((p) => p - 1);
      await this.loadVerifications();
    }
  }

  viewVerification(v: VerificationResponse) {
      this.router.navigate(['/verification', v.id]);
  }
}
