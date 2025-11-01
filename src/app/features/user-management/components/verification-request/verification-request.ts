import { Component, signal } from '@angular/core';
import { inject } from '@angular/core';
import { VerificationService } from '../../services/verification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verification-request',
  standalone: true,
  templateUrl: './verification-request.html',
})
export class VerificationRequestComponent {
  // Form signals
  idNumber = signal('');
  idFrontFile = signal<File | null>(null);
  idBackFile = signal<File | null>(null);
  isSubmitting = signal(false);

  private verificationService = inject(VerificationService);
  private router = inject(Router);

  onFileSelect(event: Event, type: 'front' | 'back') {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    if (file) {
      if (type === 'front') this.idFrontFile.set(file);
      else this.idBackFile.set(file);
    }
  }

  async onSubmit() {
    if (!this.idFrontFile() || !this.idBackFile() || !this.idNumber()) return;
    this.isSubmitting.set(true);

    try {
      // Get signed upload URLs from backend
      const uploadUrls = await this.verificationService.getSignedUploadUrls();

      // Upload both files to Cloudinary
      const [frontUrl, backUrl] = await Promise.all([
        this.verificationService.uploadToCloudinary(this.idFrontFile()!, uploadUrls.front),
        this.verificationService.uploadToCloudinary(this.idBackFile()!, uploadUrls.back),
      ]);

      // Submit verification request to backend
      const result = await this.verificationService.submitVerification({
        idFrontImageUrl: frontUrl,
        idBackImageUrl: backUrl,
        idNumber: this.idNumber(),
      });

      console.log('Verification submitted:', result);
      this.router.navigate(['/profile']);
    } catch (err) {
      console.error('Verification submission failed:', err);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  get isDisabled() {
    return (
      this.isSubmitting() ||
      !this.idFrontFile() ||
      !this.idBackFile() ||
      !this.idNumber() || this.idNumber().length <14
    );
  }
}