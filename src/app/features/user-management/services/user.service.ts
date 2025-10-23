import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../core/config/app.config';
import { Observable, catchError, throwError } from 'rxjs';
import { UserProfile } from '../models/user.profile';
import { UpdateUserProfileRequest } from '../models/update.user.profile';

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
}