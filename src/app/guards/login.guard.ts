import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      const userType = this.authService.getUserType();
      if (userType === 'doctor') {
        this.router.navigate(['/dashboard']);
      } else if (userType === 'admin') {
        this.router.navigate(['/admin-dashboard']);
      }
      return false;
    }
    return true;
  }
} 