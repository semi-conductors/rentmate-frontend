import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReportService } from '../../services/report.service';
import { ReportResponse } from '../../models/report.response';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-report-dashboard',
  standalone: true,
  imports: [NgClass, DatePipe],
  templateUrl: './report-dashboard.html',
})
export class ReportDashboardComponent {
  private reportService = inject(ReportService);
  private router = inject(Router);

  reports = signal<ReportResponse[]>([]);
  loading = signal(true);
  dropdownOpen = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  claiming = signal<number | null>(null); // Track current claim attempt

  // Pagination and filters
  page = signal(1);
  totalPages = signal(1);
  totalItems = signal(0);
  limit = 10;
  selectedStatus: string | null = null;
  selectedType: string | null = null;

  statusOptions = [
    { label: 'All Statuses', value: null },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Under Review', value: 'UNDER_REVIEW' },
    { label: 'Resolved', value: 'RESOLVED' },
    { label: 'Dismissed', value: 'DISMISSED' },
  ];

  typeOptions = [
    { label: 'All Types', value: null },
    { label: 'Fraud', value: 'FRAUD' },
    { label: 'Damage', value: 'DAMAGE' },
    { label: 'Overdue', value: 'OVERDUE' },
    { label: 'Fake User', value: 'FAKE_USER' },
    { label: 'Thieving', value: 'THIEVING' },
  ];

  async ngOnInit() {
    await this.loadReports();
  }

  toggleDropdown(type: string) {
    this.dropdownOpen.set(this.dropdownOpen() === type ? null : type);
  }

  applyStatusFilter(status: string | null) {
    this.selectedStatus = status;
    this.dropdownOpen.set(null);
    this.page.set(1);
    this.loadReports();
  }

  applyTypeFilter(type: string | null) {
    this.selectedType = type;
    this.dropdownOpen.set(null);
    this.page.set(1);
    this.loadReports();
  }

  async loadReports() {
    this.loading.set(true);
    try {
      const response = await this.reportService.getAvailableReports({
        page: this.page(),
        limit: this.limit,
        status: this.selectedStatus,
        type: this.selectedType,
      });
      this.reports.set(response.items);
      this.totalPages.set(response.totalPages);
      this.totalItems.set(response.totalItems);
    } finally {
      this.loading.set(false);
    }
  }

  nextPage() {
    if (this.page() < this.totalPages()) {
      this.page.update(v => v + 1);
      this.loadReports();
    }
  }

  prevPage() {
    if (this.page() > 1) {
      this.page.update(v => v - 1);
      this.loadReports();
    }
  }

  async viewReport(id: number) {
    this.claiming.set(id);
    this.errorMessage.set(null);
    try {
      await this.reportService.claimReport(id);
      this.router.navigate(['/admin/reports', id]); // Proceed to management page
    } catch (error: any) {
      this.errorMessage.set(error.error.detail || 'Unable to claim this report.');     
      setTimeout(() => this.errorMessage.set(null), 5000);
    } finally {
      this.claiming.set(null);
    }
  }
}