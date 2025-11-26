import { Component, OnDestroy, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { ReportService } from '../../services/report.service';
import { ReportDetailsResponse } from '../../models/report.details.response';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgClass } from '@angular/common';
import { SpaceifyPipe } from '../../../../core/pipes/specify-pipe';

@Component({
  selector: 'app-report-management',
  standalone: true,
  imports: [FormsModule, DatePipe, NgClass, SpaceifyPipe],
  templateUrl: './report-management.html',
})
export class ReportManagementComponent implements OnInit, OnDestroy {
  private reportService = inject(ReportService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isLocked = signal(false); // UI lock state
  report = signal<ReportDetailsResponse | null>(null);
  loading = signal(true);
  errorMessage = signal<string | null>(null);
  message = signal('');
  lockRefresher?: Subscription;
  canReview = signal(true);

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.errorMessage.set('Invalid report ID.');
      return;
    }

    await this.loadReport(id);

    if(this.report()?.status !== 'PENDING') this.canReview.set(false);
    
    this.reportService.refreshLock(id).then(() => this.isLocked.set(true)).catch(() =>{
      console.warn('Failed to refresh lock');
      this.isLocked.set(false)
    });

    // Every 25 minutes refresh lock
    this.lockRefresher = interval(25 * 60 * 1000).subscribe(() => {
      this.reportService.refreshLock(id).then(() => this.isLocked.set(true)).catch(() =>{
        console.warn('Failed to refresh lock');
        this.isLocked.set(false)
      });
    });
  }

  async loadReport(id: number) {
    this.loading.set(true);
    try {
      const data = await this.reportService.getReportDetails(id);
      this.report.set(data);
      if (data.resolutionNotes) 
        this.message.set(data.resolutionNotes);
    } catch {
      this.errorMessage.set('Failed to load report details.');
    } finally {
      this.loading.set(false);
    }
  }

  async startReview() {
    const report = this.report();
    if (!report) return;

    try {
      await this.reportService.claimReport(report.id);
      this.isLocked.set(true);
      alert("You are now reviewing this report. It is locked for others.");
      await this.loadReport(report.id);
    } catch {
      this.errorMessage.set("Failed to claim report lock.");
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

  // private releaseLock = async () => {
  //   const id = Number(this.route.snapshot.paramMap.get('id'));
  //   if (id) await this.reportService.releaseLock(id).catch(() => {});
  // };

  async releaseReviewLock() {
    const report = this.report();
    if (!report) return;

    try {
      await this.reportService.releaseLock(report.id);
      this.isLocked.set(false);
      alert("You have released the lock.");
    } catch {
      this.errorMessage.set("Failed to release lock.");
    }
  }


  async ngOnDestroy() {
    this.lockRefresher?.unsubscribe();
    // await this.releaseLock();
    // window.removeEventListener('beforeunload', this.releaseLock);
  }

  viewProfile(userId: number | undefined) {
    if (!userId) return;
    this.router.navigate(['/admin/users', userId])
  }
  getStatusClass(status: string): string {
    const base = 'px-2.5 py-1 rounded-full text-xs font-bold';
    switch (status) {
      case 'PENDING': return `${base} bg-yellow-500/80 text-black`;
      case 'UNDER_REVIEW': return `${base} bg-blue-500/80 text-white`;
      case 'RESOLVED': return `${base} bg-green-600/80 text-white`;
      case 'DISMISSED': return `${base} bg-gray-500/80 text-white`;
      case 'ACTIVE': return `${base} bg-green-600/80 text-white`;
      case 'INACTIVE': return `${base} bg-gray-600/80 text-white`;
      case 'PENDING_REPORT_REVIEW': return `${base} bg-blue-500/80 text-white`;
      case 'SUSPENDED_BY_ADMIN': return `${base} bg-red-600/80 text-white`;
      default: return `${base} bg-neutral-600 text-white`;
    }
  }  
}