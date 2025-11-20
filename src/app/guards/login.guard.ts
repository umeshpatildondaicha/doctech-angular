import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // Check if user is authenticated and token is valid
    const isAuthenticated = this.authService.isAuthenticated();
    
    if (isAuthenticated && this.authService.isTokenValid()) {
      // User is already authenticated, redirect to appropriate dashboard
      const userType = this.authService.getUserType();
      
      if (userType === 'HOSPITAL') {
        this.router.navigate(['/admin-dashboard']);
      } else if (userType === 'DOCTOR') {
        this.router.navigate(['/dashboard']);
      } else if (userType === 'PATIENT') {
        this.router.navigate(['/patient-dashboard']);
      } else {
        // Default to dashboard
        this.router.navigate(['/dashboard']);
      }
      return false;
    } else {
      // Clear invalid auth data if exists
      if (isAuthenticated) {
        this.authService.logout();
      }
      // Allow access to login page
      return true;
    }
  }
} 
