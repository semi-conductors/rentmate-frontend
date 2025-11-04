import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { PagedReportsResponse } from '../models/paged.report';
import { AppConfig } from '../../../core/config/app.config';
import { ReportDetailsResponse } from '../models/report.details.response';
import { CreateReportRequest } from '../models/create.report';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private http = inject(HttpClient);
  private readonly baseUrl = AppConfig.userService + '/reports';

  async getAvailableReports(filters: {
    page?: number;
    limit?: number;
    status?: string | null;
    type?: string | null;
  }): Promise<PagedReportsResponse> {
    let params = new HttpParams()
      .set('page', filters.page?.toString() ?? '1')
      .set('limit', filters.limit?.toString() ?? '10');
    if (filters.status) params = params.set('status', filters.status);
    if (filters.type) params = params.set('type', filters.type);

    return await firstValueFrom(this.http.get<PagedReportsResponse>(`${this.baseUrl}`, { params }));
  }


  async claimReport(reportId: number): Promise<void> {
    await firstValueFrom(this.http.post<void>(`${this.baseUrl}/${reportId}/claim`, {}));
  }  

  getReportDetails(id: number): Promise<ReportDetailsResponse> {
    return firstValueFrom(this.http.get<ReportDetailsResponse>(`${this.baseUrl}/${id}`));
  }

  resolveReport(id: number, message: string): Promise<void> {
    return firstValueFrom(this.http.post<void>(`${this.baseUrl}/${id}/resolve`, { message }));
  }

  dismissReport(id: number, message: string): Promise<void> {
    return firstValueFrom(this.http.post<void>(`${this.baseUrl}/${id}/dismiss`, { message }));
  }

  refreshLock(id: number): Promise<void> {
    return firstValueFrom(this.http.post<void>(`${this.baseUrl}/${id}/refresh-lock`, {}));
  }

  releaseLock(id: number): Promise<void> {
    return firstValueFrom(this.http.post<void>(`${this.baseUrl}/${id}/release`, {}));
  }

  createReport(body: CreateReportRequest): Observable<any> {
    return this.http.post(this.baseUrl, body);
  }  
}