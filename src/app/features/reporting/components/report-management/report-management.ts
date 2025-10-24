import { Component, OnDestroy, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { ReportService } from '../../services/report.service';
import { ReportDetailsResponse } from '../../models/report.details.response';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-report-management',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './report-management.html',
})
export class ReportManagementComponent implements OnInit, OnDestroy {
  private reportService = inject(ReportService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  report = signal<ReportDetailsResponse | null>(null);
  loading = signal(true);
  errorMessage = signal<string | null>(null);
  message = signal('');
  lockRefresher?: Subscription;

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.errorMessage.set('Invalid report ID.');
      return;
    }

    await this.loadReport(id);

    // Every 25 minutes refresh lock
    this.lockRefresher = interval(25 * 60 * 1000).subscribe(() => {
      this.reportService.refreshLock(id).catch(() =>
        console.warn('Failed to refresh lock')
      );
    });

    // Release lock on page unload
    window.addEventListener('beforeunload', this.releaseLock);
  }

  async loadReport(id: number) {
    this.loading.set(true);
    try {
      const data = await this.reportService.getReportDetails(id);
      this.report.set(data);
    } catch {
      this.errorMessage.set('Failed to load report details.');
    } finally {
      this.loading.set(false);
    }
  }

  async onResolve() {
    if (!this.report()) return;
    try {
      await this.reportService.resolveReport(this.report()!.id, this.message());
      alert('Report resolved successfully.');
      this.router.navigate(['/admin/reports']);
    } catch {
      this.errorMessage.set('Failed to resolve report.');
    }
  }

  async onDismiss() {
    if (!this.report()) return;
    try {
      await this.reportService.dismissReport(this.report()!.id, this.message());
      alert('Report dismissed successfully.');
      this.router.navigate(['/admin/reports']);
    } catch {
      this.errorMessage.set('Failed to dismiss report.');
    }
  }

  async onSuspend() {
    if (!this.report()) return;
    alert('not implemented yet');
  }

  async onWithdraw() {
    if (!this.report()) return;
    alert('not implemented yet');
  }

  private releaseLock = async () => {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) await this.reportService.releaseLock(id).catch(() => {});
  };

  async ngOnDestroy() {
    this.lockRefresher?.unsubscribe();
    await this.releaseLock();
    window.removeEventListener('beforeunload', this.releaseLock);
  }
}