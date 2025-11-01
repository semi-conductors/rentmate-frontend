import { Injectable, signal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, of, switchMap, tap } from 'rxjs';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth.response';
import { RegisterRequest } from '../models/register.request';
import { AppConfig } from '../../../core/config/app.config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly ACCESS_KEY = 'access_token';
  private readonly REFRESH_KEY = 'refresh_token';
  private readonly USER_KEY = 'auth_user';


  private accessToken = signal<string | null>(null);
  private refreshToken = signal<string | null>(null);
  private user = signal<User | null>(null);

  readonly isAuthenticated = computed(() => !!this.accessToken());
  readonly currentUser = computed(() => this.user());

  private readonly baseUrl = `${AppConfig.userService}/auth`;


  constructor(private http: HttpClient, private router: Router) {
    // Load stored tokens and user
    this.accessToken.set(localStorage.getItem(this.ACCESS_KEY));
    this.refreshToken.set(localStorage.getItem(this.REFRESH_KEY));
    const storedUser = localStorage.getItem(this.USER_KEY);
    if (storedUser) this.user.set(JSON.parse(storedUser));

    // Keep storage in sync with signals
    effect(() => {
      const access = this.accessToken();
      const refresh = this.refreshToken();
      const usr = this.user();

      if (access) localStorage.setItem(this.ACCESS_KEY, access);
      else localStorage.removeItem(this.ACCESS_KEY);

      if (refresh) localStorage.setItem(this.REFRESH_KEY, refresh);
      else localStorage.removeItem(this.REFRESH_KEY);

      if (usr) localStorage.setItem(this.USER_KEY, JSON.stringify(usr));
      else localStorage.removeItem(this.USER_KEY);
    });
  }

  updateLocalStorageUser(username: string, phoneNumber: string){
    const storedUser = this.user();
    storedUser!.username = username;
    storedUser!.phoneNumber = phoneNumber;
    this.user.set(storedUser);
    localStorage.setItem(this.USER_KEY, JSON.stringify(storedUser));
  }

  /** LOGIN **/
  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/login`, { email, password })
      .pipe(
        tap((res) => {
          this.accessToken.set(res.accessToken);
          this.refreshToken.set(res.refreshToken);
          this.user.set(res.user);
          this.router.navigate(['/']);
        })
      );
  }


  logout() {
    const refreshToken = this.refreshToken();
    return this.http.post(this.baseUrl + '/logout', { refreshToken }).pipe(
      tap(() => {
          this.localLogout();
          this.router.navigate(['/']);
      }),
      catchError((err) => {
        console.error('Logout failed', err);
        this.localLogout();
        return of(null);
      }
    ));
  }


  refreshAccessToken() {
    const refresh = this.refreshToken();
    if (!refresh) return of(null);

    return this.http
      .post<{ accessToken: string }>(`${this.baseUrl}/refresh`, {
        refreshToken: refresh,
      })
      .pipe(
        tap((res) => {
          this.accessToken.set(res.accessToken);
        }),
        catchError((err) => {
          console.error('Token refresh failed', err);
          this.logout();
          return of(null);
        })
      );
  }


  register(payload: RegisterRequest) {
    return this.http.post<AuthResponse>(this.baseUrl+'/register', payload)
      .pipe(
        tap((res) => {
          // auto-login user after registration
          this.accessToken.set(res.accessToken);
          this.refreshToken.set(res.refreshToken);
          this.user.set(res.user);
          this.router.navigate(['/']);
        }),
        catchError((err) => {
          console.error('Registration failed:', err);
          throw err;
        })
      );
  }

  requestPasswordReset(email: string) {
    return this.http.post(`${this.baseUrl}/password-reset/token`, { email });
  }

  confirmPasswordReset(token: string, newPassword: string) {
    return this.http.post(`${this.baseUrl}/password-reset/confirm`, { token, newPassword });
  }

  localLogout(){
    this.accessToken.set(null);
    this.refreshToken.set(null);
    this.user.set(null);
  }

  getAccessToken() {
    return this.accessToken();
  }

  getRefreshToken() {
    return this.refreshToken();
  }
  userSignal() {
  return this.user();
}
}
