import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private refreshing = false;
  private refreshSubject = new BehaviorSubject<string | null>(null);

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isAuthRequest = req.url.includes('/api/auth/login') || req.url.includes('/api/auth/refresh');
    const token = this.auth.accessToken;
    let authReq = req;
    if (token) {
      authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }

    return next.handle(authReq).pipe(
      catchError(err => {
        if (err instanceof HttpErrorResponse && err.status === 401 && !isAuthRequest) {
          return this.handle401(authReq, next);
        }
        return throwError(() => err);
      })
    );
  }

  private handle401(req: HttpRequest<any>, next: HttpHandler) {
    if (this.refreshing) {
      return this.refreshSubject.pipe(
        filter(t => t != null),
        take(1),
        switchMap((t) => next.handle(req.clone({ setHeaders: { Authorization: `Bearer ${t}` } })))
      );
    }

    this.refreshing = true;
    this.refreshSubject.next(null);

    const refreshToken = this.auth.refreshToken;
    if (!refreshToken) {
      this.refreshing = false;
      this.auth.logout();
      return throwError(() => new Error('No refresh token'));
    }

    return this.auth.refresh(refreshToken).pipe(
      switchMap(res => {
        this.refreshing = false;
        this.refreshSubject.next(res.accessToken);
        return next.handle(req.clone({ setHeaders: { Authorization: `Bearer ${res.accessToken}` } }));
      }),
      catchError(e => {
        this.refreshing = false;
        this.auth.logout();
        return throwError(() => e);
      })
    );
  }
}

export const AuthInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true
};
