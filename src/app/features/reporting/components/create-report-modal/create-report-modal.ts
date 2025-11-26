import { Component, signal, computed, inject, input, output, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-report-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-report-modal.html',
  styleUrls: ['./create-report-modal.css']
})
export class CreateReportModalComponent {
  private reportService = inject(ReportService);
  private authService = inject(AuthService);


  // --- Inputs ---
  relatedRentalId = input<number | null>(null);
  relatedDeliveryId = input<number | null>(null);

  // --- State signals ---
  reportType = signal<'FRAUD' | 'DAMAGE' | 'OVERDUE' | 'FAKE_USER' | null>(null);
  details = signal('');
  damagePercentage = signal<number | null>(null);
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  // --- Control signals for modal state ---
  //isOpen = signal(false);
  submitted = signal(false);



  // --- Computed validation ---
  minLength = computed(() =>
    ['FRAUD', 'DAMAGE'].includes(this.reportType() ?? '') ? 60 : 20
  );

  isValid = computed(() => {
    const type = this.reportType();
    const text = this.details().trim();

    if (!type || text.length < this.minLength()) return false;
    if (type === 'DAMAGE') {
      const dmg = this.damagePercentage();
      if (dmg == null || dmg < 0 || dmg > 100) return false;
    }
    return true;
  });

  // --- Submit logic (delegated to ReportService) ---
  submit(): void {
    if (!this.isValid()) return;

    const reporter = this.authService.currentUser();
    if (!reporter?.id) {
      this.errorMessage.set('You must be logged in to submit a report.');
      return;
    }

    const payload = {
      reportType: this.reportType(),
      details: this.details().trim(),
      relatedRentalId: this.relatedRentalId(),
      relatedDeliveryId: this.relatedDeliveryId(),
      damagePercentage: this.reportType() === 'DAMAGE' ? this.damagePercentage() : null
    };

    this.loading.set(true);
    this.errorMessage.set(null);

    this.reportService.createReport(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.submitted.set(true);
        this.isOpen.set(false);
      },
      error: (err) => {
        console.error('Report creation failed:', err);
        this.loading.set(false);
        this.errorMessage.set(err?.error?.detail || 'Failed to submit report. Please try again.');
      }
    });
  }

  isOpen = model(false); // or use input/output pair
  
  close(): void {
    this.isOpen.set(false);
  }
  
  open(data?: { relatedRentalId?: number; relatedDeliveryId?: number }) {
    this.isOpen.set(true);
    this.submitted.set(false);
    this.reportType.set(null);
    this.details.set('');
    this.damagePercentage.set(null);
    this.errorMessage.set(null);
  }


  setType(type: 'FRAUD' | 'DAMAGE' | 'OVERDUE' | 'FAKE_USER' ): void {
    this.reportType.set(type);
    if (type !== 'DAMAGE') this.damagePercentage.set(null);
  }

  updateDetails(value: string): void {
    this.details.set(value);
  }

  updateDamage(value: string): void {
    const num = Number(value);
    this.damagePercentage.set(isNaN(num) ? null : num);
  }
}
