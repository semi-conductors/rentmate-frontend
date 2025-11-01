import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../core/config/app.config';
import { Observable, catchError, throwError } from 'rxjs';
import { UserProfile } from '../models/user.profile';
import { UpdateUserProfileRequest } from '../models/update.user.profile';
import { PublicUserProfile } from '../models/public.user.profile';
import { UserSummary } from '../models/user.summary';
import { RatingListResponse } from '../../rating/models/rating.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = AppConfig.userService;

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/profile`).pipe(
      catchError(err => {
        if (err.status === 404) {
          return throwError(() => new Error('Profile not found'));
        }
        return throwError(() => new Error('Failed to load profile'));
      })
    );
  }
  
  updateProfile(request: UpdateUserProfileRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.baseUrl}/profile`, request);
  }

  getPublicProfile(userId: number): Observable<PublicUserProfile> {
    return this.http.get<PublicUserProfile>(`${this.baseUrl}/${userId}`);
  }

  deactivateProfile(): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/profile`);
  }

  getAllUsers(params: {
    page?: number;
    limit?: number;
    role?: string | null;
    status?: string | null;
    isVerified?: boolean | null;
    search?: string | undefined;
  }) {
    const cleanParams: any = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== null && v !== undefined) cleanParams[k] = v;
    }
    return this.http.get<{
      items: UserSummary[];
      totalPages: number;
      totalItems: number;
    }>(`${this.baseUrl}`, { params: cleanParams });
  }

  createStaffAccount(body: any) {
    return this.http.post(this.baseUrl, body);
  }

  getUserById(userId: number) {
    return this.http.get<UserProfile>(`${this.baseUrl}/${userId}/details`);
  }

  getUserRatings(userId: number, page = 1, limit = 10) {
    const params: any = { page, limit };
    return this.http.get<RatingListResponse>(`${this.baseUrl}/${userId}/ratings`, { params });
  }

  changeUserStatus(userId: number, status: string, reason?: string): Observable<UserProfile> {
    return this.http.patch<UserProfile>(`${this.baseUrl}/${userId}/status`, { status, reason });
  }

  changeUserRole(userId: number, role: string): Observable<UserProfile> {
    return this.http.patch<UserProfile>(`${this.baseUrl}/${userId}/role`, { role });
  }
}