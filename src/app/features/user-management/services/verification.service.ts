import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CloudinaryUploadInfo } from '../models/cloudinary.upload';
import { CloudinaryUploadUrlResponse } from '../models/cloudinary.upload';
import { VerificationRequest } from '../models/verification.request';
import { VerificationResponse } from '../models/verification.response';
import { AppConfig } from '../../../core/config/app.config';
import { firstValueFrom, Observable } from 'rxjs';
import { VerificationDetailResponse } from '../models/veriifcation.details.response';

@Injectable({ providedIn: 'root' })
export class VerificationService {
  private http = inject(HttpClient);
  private readonly baseUrl = AppConfig.userService ;

  async getSignedUploadUrls(): Promise<CloudinaryUploadUrlResponse> {
    return await firstValueFrom(
      this.http.get<CloudinaryUploadUrlResponse>(
        `${this.baseUrl}/verifications/upload-urls`
      )
    );
  }

  async uploadToCloudinary(file: File,
    uploadInfo: { folder: string; signature: string; api_key: string; public_id: string; timestamp: number }
  ): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', uploadInfo.folder);
    formData.append('api_key', uploadInfo.api_key);
    formData.append('timestamp', uploadInfo.timestamp.toString());
    formData.append('public_id', uploadInfo.public_id);
    formData.append('signature', uploadInfo.signature);

    const cloudinaryUrl = AppConfig.cloudinaryUploadUrl;

    const response = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Cloudinary upload failed');
    }

    const data = await response.json();
    return data.secure_url; // Cloudinary returns the hosted image URL
  }


  async submitVerification(payload: VerificationRequest): Promise<VerificationResponse> {
    return await firstValueFrom(
      this.http.post<VerificationResponse>(`${this.baseUrl}/verifications`, payload)
    );
  }

  getMyVerifications(): Observable<VerificationResponse[]> {
    return this.http.get<VerificationResponse[]>(`${this.baseUrl}/verifications/my-requests`);
  }

  canSubmitVerification(): Observable<{ canSubmit: boolean }> {
    return this.http.get<{ canSubmit: boolean }>(`${this.baseUrl}/verifications/can-submit`);
  }

  async getVerifications(
    page = 1, limit = 10, status?: string | null, sortBy: string = 'createdAt', sortOrder: string = 'desc'
  ) {
    const params: any = { page, limit, sortBy, sortOrder };
    if (status) params.status = status;

    const response = await firstValueFrom(
      this.http.get<any>(`${this.baseUrl}/verifications`, { params })
    );
    return response;
  }

  async getVerificationById(id: number) {
    return firstValueFrom(this.http.get<VerificationDetailResponse>(`${this.baseUrl}/verifications/${id}`));
  }

  async approveVerification(id: number) {
    return firstValueFrom(this.http.patch<VerificationResponse>(`${this.baseUrl}/verifications/${id}/approval`, {}));
  }

  async rejectVerification(id: number, reason: string) {
    return firstValueFrom(
      this.http.patch<VerificationResponse>(`${this.baseUrl}/verifications/${id}/rejection`, {}, { params: { reason } })
    );
  }
}