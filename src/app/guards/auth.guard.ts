import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // Check storage directly to avoid timing issues with state initialization
    const token = this.authService.getStoredToken();
    const user = this.authService.getStoredUser();
    const refreshToken = this.authService.getStoredRefreshToken();
    
    // Must have both token and user data to be considered authenticated
    if (!token || !user) {
      this.router.navigate(['/login']);
      return false;
    }
    
    // Check if token is valid
    const isTokenValid = this.authService.isTokenValid(token);
    
    if (isTokenValid) {
      return true;
    }
    
    // Token is expired - check if we have a refresh token
    if (refreshToken) {
      // Allow access - token refresh will happen in background via initializeAuthState
      return true;
    }
    
    // Token is expired and no refresh token
    // Don't redirect immediately - let initializeAuthState handle it
    // This prevents race conditions where guard runs before state is initialized
    // If state initialization clears data, the next navigation will redirect
    console.warn('Token expired and no refresh token found. Access may be denied after state initialization.');
    
    // Check auth state as fallback (in case initializeAuthState already ran)
    const isAuthenticated = this.authService.isAuthenticated();
    if (!isAuthenticated) {
      this.router.navigate(['/login']);
      return false;
    }
    
    // If authenticated in state but token expired and no refresh token, allow for now
    // The HTTP interceptor will handle 401 errors
    return true;
  }
} 
