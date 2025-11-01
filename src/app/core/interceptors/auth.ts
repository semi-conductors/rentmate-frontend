export interface Auth {
}
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const accessToken = auth.getAccessToken();

  // skip adding header if this is the refresh request
  if (req.url.includes('/auth/refresh')) {
    return next(req);
  }

  // Attach token
  let cloned = req;
  if (accessToken) {
    cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });
  }

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
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
          }),
          catchError((refreshErr) => {
            auth.logout();
            return throwError(() => refreshErr);
          })
        );
      }

      return throwError(() => error);
    })
  );
};