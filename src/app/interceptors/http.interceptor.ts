import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request and add only necessary headers (NO CORS headers from client)
    const authReq = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
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
        
        return throwError(() => error);
      })
    );
  }
}
