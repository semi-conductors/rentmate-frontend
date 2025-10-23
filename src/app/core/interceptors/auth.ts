export interface Auth {
}
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const accessToken = auth.getAccessToken();

  // Attach access token if exists
  let cloned = req;
  if (accessToken) {
    cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });
  }

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      // If unauthorized and refresh token exists, try refreshing
      if (error.status === 401 && auth.getRefreshToken()) {
        return auth.refreshAccessToken().pipe(
          switchMap((res) => {
            const newToken = res?.accessToken;
            if (newToken) {
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` },
              });
              return next(retryReq);
            } else {
              auth.logout();
              return throwError(() => error);
            }
          })
        );
      }
      return throwError(() => error);
    })
  );
};