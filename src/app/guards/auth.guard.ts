import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // Check if user is authenticated and token is valid
    const isAuthenticated = this.authService.isAuthenticated();
    
    if (isAuthenticated && this.authService.isTokenValid()) {
      return true;
    } else {
      // Clear invalid auth data and redirect to login
      if (isAuthenticated) {
        // Token might be expired or invalid, clear it
        this.authService.logout();
      }
      this.router.navigate(['/login']);
      return false;
    }
  }
} 
