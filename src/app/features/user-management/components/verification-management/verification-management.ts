import { Component, signal, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VerificationService } from '../../services/verification.service';
import { VerificationDetailResponse } from '../../models/veriifcation.details.response';
import { CommonModule, DatePipe, NgClass, NgComponentOutlet } from '@angular/common';
import { FormsModule, NgForm, NgModel } from '@angular/forms';

@Component({
  selector: 'app-verification-management',
  standalone: true,
  imports: [NgClass, DatePipe, FormsModule],
  templateUrl: './verification-management.html',
})
export class VerificationManagementComponent {
  private route = inject(ActivatedRoute);
  private service = inject(VerificationService);

  verification = signal<VerificationDetailResponse | null>(null);
  loading = signal(true);
  rejectionReason = '';

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) await this.loadVerification(id);
  }

  async loadVerification(id: number) {
    this.loading.set(true);
    try {
      const data = await this.service.getVerificationById(id);
      this.verification.set(data);
    } finally {
      this.loading.set(false);
    }
  }

  async approveRequest() {
    if (!this.verification()) return;
    await this.service.approveVerification(this.verification()!.id);
    await this.loadVerification(this.verification()!.id);
  }

  async rejectRequest() {
    if (!this.verification()) return;
    if (!this.rejectionReason.trim()) {
      alert('Rejection reason is required.');
      return;
    }
    await this.service.rejectVerification(this.verification()!.id, this.rejectionReason);
    await this.loadVerification(this.verification()!.id);
  }
}