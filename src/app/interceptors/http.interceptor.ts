import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  private readonly authService = inject(AuthService);
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get auth headers
    const authHeaders = this.authService.getAuthHeaders();
    
    // Clone the request and add headers
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...authHeaders
    };

    // Don't add Content-Type for FormData requests
    if (req.body instanceof FormData) {
      delete headers['Content-Type'];
    }

    const authReq = req.clone({
      setHeaders: headers
    });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP Error:', error);
        
        // Handle CORS errors specifically
        if (error.status === 0) {
          console.error('CORS Error: Unable to connect to server');
          return throwError(() => new Error('Unable to connect to server. Please check your network connection.'));
        }
        
        // Handle redirect errors
        if (error.status === 307 || error.status === 302) {
          console.error('Redirect Error:', error);
          return throwError(() => new Error('Server redirect error. Please check the API endpoint configuration.'));
        }

        // Handle 401 Unauthorized - token expired
        if (error.status === 401 && !req.url.includes('/api/auth/refresh') && !req.url.includes('/api/auth/login')) {
          return this.handle401Error(req, next);
        }
        
        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = this.authService.getStoredRefreshToken();
      
      if (refreshToken) {
        return this.authService.refreshToken().pipe(
          switchMap((success: boolean) => {
            this.isRefreshing = false;
            
            if (success) {
              this.refreshTokenSubject.next(success);
              // Retry the original request with new token
              const authHeaders = this.authService.getAuthHeaders();
              const headers: { [key: string]: string } = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                ...authHeaders
              };

              if (request.body instanceof FormData) {
                delete headers['Content-Type'];
              }

              const clonedRequest = request.clone({
                setHeaders: headers
              });
              
              return next.handle(clonedRequest);
            } else {
              // Refresh failed, logout user
              this.authService.logout();
              return throwError(() => new Error('Token refresh failed. Please login again.'));
            }
          }),
          catchError((err) => {
            this.isRefreshing = false;
            this.authService.logout();
            return throwError(() => err);
          })
        );
      } else {
        // No refresh token available
        this.isRefreshing = false;
        this.authService.logout();
        return throwError(() => new Error('No refresh token available. Please login again.'));
      }
    } else {
      // Token refresh is in progress, wait for it to complete
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(() => {
          const authHeaders = this.authService.getAuthHeaders();
          const headers: { [key: string]: string } = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            ...authHeaders
          };

          if (request.body instanceof FormData) {
            delete headers['Content-Type'];
          }

          const clonedRequest = request.clone({
            setHeaders: headers
          });
          
          return next.handle(clonedRequest);
        })
      );
    }
  }
}
