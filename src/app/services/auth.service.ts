/**
 * Authentication Service for Shree Clinic Management System
 * Following enterprise-level standards with proper error handling, state management, and security
 */

import { Injectable, inject, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, tap, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { 
  LoginRequest, 
  AuthResponse, 
  UserInfo, 
  CurrentUser, 
  AuthState, 
  UserType,
  AccountStatus 
} from '../interfaces/auth.interface';

/**
 * Service responsible for handling all authentication-related operations
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // Private subjects for state management
  private readonly _authState = new BehaviorSubject<AuthState>({
    currentUser: null,
    isLoading: false,
    error: null,
    isAuthenticated: false
  });

  // Public observables for components to subscribe to
  public readonly authState$ = this._authState.asObservable();
  public readonly currentUser$ = this.authState$.pipe(map(state => state.currentUser));
  public readonly isAuthenticated$ = this.authState$.pipe(map(state => state.isAuthenticated));
  public readonly isLoading$ = this.authState$.pipe(map(state => state.isLoading));
  public readonly error$ = this.authState$.pipe(map(state => state.error));

  // Constants
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user_data';
  private readonly REMEMBER_ME_KEY = 'remember_me';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.initializeAuthState();
  }

  /**
   * Initialize authentication state from stored data
   */
  private initializeAuthState(): void {
    try {
      const token = this.getStoredToken();
      const user = this.getStoredUser();
      const rememberMe = this.getRememberMeStatus();

              if (token && user && this.isTokenValid(token)) {
          const currentUser: CurrentUser = {
            user,
            token,
            tokenExpiresAt: this.getTokenExpiration(token),
            isAuthenticated: true,
            userType: user.userType
          };

        this.updateAuthState({
          currentUser,
          isLoading: false,
          error: null,
          isAuthenticated: true
        });
      } else {
        this.clearStoredAuthData();
        this.updateAuthState({
          currentUser: null,
          isLoading: false,
          error: null,
          isAuthenticated: false
        });
      }
    } catch (error) {
      console.error('Error initializing auth state:', error);
      this.clearStoredAuthData();
      this.updateAuthState({
        currentUser: null,
        isLoading: false,
        error: 'Failed to restore authentication state',
        isAuthenticated: false
      });
    }
  }

  /**
   * Authenticate user with email, password, and user type
   */
  public login(loginRequest: LoginRequest, rememberMe: boolean = false): Observable<boolean> {
    this.updateAuthState({ ...this._authState.value, isLoading: true, error: null });

    return this.http.post<any>(`${environment.apiUrl}/api/auth/login`, loginRequest).pipe(
      tap((response: any) => {
        console.log('Backend response:', response);
        console.log('Response type:', typeof response);
        console.log('Response keys:', Object.keys(response));
        this.handleSuccessfulLogin(response, rememberMe);
      }),
      map((): boolean => true),
      catchError((error: HttpErrorResponse) => {
        console.error('Login error:', error);
        
        // Check if it's a connection error and try mock login
        if (error.status === 0 || error.status === 502 || error.status === 503) {
          console.log('Backend server unavailable, attempting mock login...');
          return this.handleMockLogin(loginRequest, rememberMe);
        }
        
        const errorMessage = this.handleLoginError(error);
        this.updateAuthState({ 
          ...this._authState.value, 
          isLoading: false, 
          error: errorMessage 
        });
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Handle successful login response
   */
  private handleSuccessfulLogin(response: any, rememberMe: boolean): void {
    console.log('Processing login response:', response);
    
    // Handle different response structures
    let user: UserInfo;
    let token: string;
    let expiresIn: number = 3600; // Default 1 hour
    let userType: string;
    
    // Check if response has a nested user object or if user data is at root level
    if (response.user) {
      user = response.user;
      token = response.accessToken || response.token;
      expiresIn = response.expiresIn || 3600;
      userType = response.user.userType || response.userType;
    } else if (response.data && response.data.user) {
      // Handle nested data structure
      user = response.data.user;
      token = response.data.token || response.data.accessToken;
      expiresIn = response.data.expiresIn || 3600;
      userType = response.data.user.userType || response.data.userType;
    } else {
      // If user data is at root level (common in some APIs)
      user = {
        id: response.userId || response.registrationNumber || response.hospitalId || response.doctorId || response.patientId || '1',
        email: response.email,
        fullName: response.displayName || response.name || response.fullName || response.firstName + ' ' + response.lastName,
        userType: response.userType || 'HOSPITAL',
        profilePicture: response.profilePicture || response.hospitalLogo || 'assets/avatars/default-avatar.jpg',
        phoneNumber: response.contactNumber || response.phoneNumber,
        role: response.role || 'ADMIN',
        permissions: response.permissions || [],
        createdAt: response.createdDate || new Date().toISOString(),
        lastLoginAt: response.loginTime || new Date().toISOString(),
        status: response.active ? 'ACTIVE' : 'INACTIVE'
      };
      token = response.accessToken || response.token;
      expiresIn = response.expiresIn || 3600;
      userType = response.userType || 'HOSPITAL';
    }

    console.log('Extracted user type:', userType);
    console.log('Full user object:', user);

    const currentUser: CurrentUser = {
      user,
      token: token || 'dummy-token', // Fallback token
      tokenExpiresAt: Date.now() + (expiresIn * 1000),
      isAuthenticated: true,
      userType
    };

    console.log('Created current user:', currentUser);

    // Store authentication data
    this.storeAuthData(token || 'dummy-token', response.refreshToken, user, rememberMe);

    // Update state
    this.updateAuthState({
      currentUser,
      isLoading: false,
      error: null,
      isAuthenticated: true
    });

    // Navigate based on user type
    console.log('About to navigate for user type:', userType);
    setTimeout(() => {
      this.navigateAfterLogin(userType);
    }, 100);
  }

  /**
   * Handle login errors and return appropriate error messages
   */
  private handleLoginError(error: HttpErrorResponse): string {
    console.error('Login error details:', {
      status: error.status,
      statusText: error.statusText,
      message: error.message,
      url: error.url,
      error: error.error
    });

    if (error.status === 0) {
      return 'Unable to connect to the server. Please check if the backend server is running on port 8080.';
    }

    // Check if it's a network error
    if (error.error instanceof ErrorEvent) {
      return 'Network error occurred. Please check your internet connection and ensure the backend server is running.';
    }

    switch (error.status) {
      case 400:
        return 'Invalid login credentials. Please check your email and password.';
      case 401:
        return 'Invalid email or password. Please try again.';
      case 403:
        return 'Account is suspended or inactive. Please contact support.';
      case 404:
        return 'User account not found. Please check your email and user type.';
      case 429:
        return 'Too many login attempts. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      case 502:
        return 'Backend server is not responding. Please ensure the server is running on port 8080.';
      case 503:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return `Server error (${error.status}). Please try again or contact support if the problem persists.`;
    }
  }

  /**
   * Handle mock login when backend is unavailable
   */
  private handleMockLogin(loginRequest: LoginRequest, rememberMe: boolean): Observable<boolean> {
    // Mock credentials for demo purposes
    const mockCredentials = {
      [UserType.HOSPITAL]: { email: 'admin@shreephysio.com', password: 'Pass@123' },
      [UserType.DOCTOR]: { email: 'u513107@gmail.com', password: 'Umesh@123' },
      [UserType.PATIENT]: { email: 'patient@shreephysio.com', password: 'Patient@123' }
    };

    const expectedCredentials = mockCredentials[loginRequest.userType];
    
    if (expectedCredentials && 
        loginRequest.email === expectedCredentials.email && 
        loginRequest.password === expectedCredentials.password) {
      
      console.log('Mock login successful for:', loginRequest.userType);
      
      // Create mock response
      const getUserInfo = (userType: string) => {
        switch (userType) {
          case UserType.DOCTOR:
            return {
              id: 'DOC-12332',
              fullName: 'Dr. Umesh Patil',
              phoneNumber: '8788802334'
            };
          case UserType.HOSPITAL:
            return {
              id: 'ADMIN-001',
              fullName: 'Hospital Admin',
              phoneNumber: '+91-22-12345678'
            };
          case UserType.PATIENT:
            return {
              id: 'PAT-001',
              fullName: 'John Doe',
              phoneNumber: '+91-9876543210'
            };
          default:
            return {
              id: 'USER-001',
              fullName: 'Demo User',
              phoneNumber: '+91-0000000000'
            };
        }
      };

      const userInfo = getUserInfo(loginRequest.userType);
      
      const mockResponse = {
        success: true,
        message: 'Login successful (Demo Mode)',
        data: {
          token: 'mock-jwt-token-' + Date.now(),
          refreshToken: 'mock-refresh-token-' + Date.now(),
          user: {
            id: userInfo.id,
            email: loginRequest.email,
            fullName: userInfo.fullName,
            userType: loginRequest.userType,
            status: 'ACTIVE',
            phoneNumber: userInfo.phoneNumber,
            profilePicture: 'assets/avatars/default-avatar.jpg',
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString()
          }
        }
      };
      
      this.handleSuccessfulLogin(mockResponse, rememberMe);
      return of(true);
    } else {
      const errorMessage = 'Invalid email or password. Please try again. (Demo Mode)';
      this.updateAuthState({ 
        ...this._authState.value, 
        isLoading: false, 
        error: errorMessage 
      });
      return throwError(() => new Error(errorMessage));
    }
  }

  /**
   * Navigate user to appropriate dashboard after successful login
   */
          private navigateAfterLogin(userType: string): void {
          console.log('Navigating for user type:', userType);
          switch (userType) {
            case 'HOSPITAL':
              console.log('Navigating to admin dashboard');
              this.router.navigate(['/admin-dashboard']);
              break;
            case 'DOCTOR':
              console.log('Navigating to doctor dashboard');
              this.router.navigate(['/dashboard']);
              break;
            case 'PATIENT':
              console.log('Navigating to patient dashboard');
              this.router.navigate(['/patient-dashboard']);
              break;
            default:
              console.log('Default navigation to dashboard');
              this.router.navigate(['/dashboard']);
          }
        }

  /**
   * Logout user and clear all authentication data
   */
  public logout(): void {
    // Clear stored data
    this.clearStoredAuthData();

    // Update state
    this.updateAuthState({
      currentUser: null,
      isLoading: false,
      error: null,
      isAuthenticated: false
    });

    // Navigate to login
    this.router.navigate(['/login']);
  }

  /**
   * Refresh authentication token
   */
  public refreshToken(): Observable<boolean> {
    const refreshToken = this.getStoredRefreshToken();
    
    if (!refreshToken) {
      return of(false);
    }

    return this.http.post<AuthResponse>(`${environment.apiUrl}/api/auth/refresh`, { refreshToken }).pipe(
      tap((response: AuthResponse) => {
        this.handleSuccessfulLogin(response, this.getRememberMeStatus());
      }),
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        console.error('Token refresh failed:', error);
        this.logout();
        return of(false);
      })
    );
  }

  /**
   * Check if current token is valid
   */
  public isTokenValid(token?: string): boolean {
    const tokenToCheck = token || this.getStoredToken();
    
    if (!tokenToCheck) {
      return false;
    }

    try {
      const expiration = this.getTokenExpiration(tokenToCheck);
      return Date.now() < expiration;
    } catch {
      return false;
    }
  }

  /**
   * Get token expiration time
   */
  private getTokenExpiration(token: string): number {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000;
    } catch {
      return 0;
    }
  }

  /**
   * Get current user information
   */
  public getCurrentUser(): UserInfo | null {
    return this._authState.value.currentUser?.user || null;
  }

  /**
   * Get current user type
   */
  public getUserType(): string | null {
    return this._authState.value.currentUser?.user.userType || null;
  }

  /**
   * Check if user has specific permission
   */
  public hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    return user?.permissions?.includes(permission) || false;
  }

  /**
   * Check if user is of specific type
   */
  public isUserType(userType: UserType): boolean {
    return this.getUserType() === userType;
  }

  /**
   * Check if user is hospital admin
   */
  public isHospitalAdmin(): boolean {
    return this.isUserType(UserType.HOSPITAL);
  }

  /**
   * Check if user is doctor
   */
  public isDoctor(): boolean {
    return this.isUserType(UserType.DOCTOR);
  }

  /**
   * Check if user is patient
   */
  public isPatient(): boolean {
    return this.isUserType(UserType.PATIENT);
  }

  /**
   * Update authentication state
   */
  private updateAuthState(newState: Partial<AuthState>): void {
    const currentState = this._authState.value;
    const updatedState = { ...currentState, ...newState };
    console.log('Updating auth state:', { currentState, newState, updatedState });
    this._authState.next(updatedState);
  }

  /**
   * Store authentication data in storage
   */
  private storeAuthData(token: string, refreshToken: string | undefined, user: UserInfo, rememberMe: boolean): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Skip localStorage/sessionStorage operations during SSR
    }
    
    try {
      if (rememberMe) {
        localStorage.setItem(this.TOKEN_KEY, token);
        if (refreshToken) {
          localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
        }
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        localStorage.setItem(this.REMEMBER_ME_KEY, 'true');
      } else {
        sessionStorage.setItem(this.TOKEN_KEY, token);
        if (refreshToken) {
          sessionStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
        }
        sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
        sessionStorage.setItem(this.REMEMBER_ME_KEY, 'false');
      }
    } catch (error) {
      console.error('Error storing auth data:', error);
    }
  }

  /**
   * Clear all stored authentication data
   */
  private clearStoredAuthData(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Skip localStorage/sessionStorage operations during SSR
    }
    
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.REMEMBER_ME_KEY);
      
      sessionStorage.removeItem(this.TOKEN_KEY);
      sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
      sessionStorage.removeItem(this.USER_KEY);
      sessionStorage.removeItem(this.REMEMBER_ME_KEY);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }

  /**
   * Get stored authentication token
   */
  private getStoredToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null; // Return null during SSR
    }
    
    try {
      return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
    } catch {
      return null;
    }
  }

  /**
   * Get stored refresh token
   */
  private getStoredRefreshToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null; // Return null during SSR
    }
    
    try {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY) || sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  /**
   * Get stored user data
   */
  private getStoredUser(): UserInfo | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null; // Return null during SSR
    }
    
    try {
      const userData = localStorage.getItem(this.USER_KEY) || sessionStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  /**
   * Get remember me status
   */
  private getRememberMeStatus(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false; // Return false during SSR
    }
    
    try {
      return localStorage.getItem(this.REMEMBER_ME_KEY) === 'true' || 
             sessionStorage.getItem(this.REMEMBER_ME_KEY) === 'true';
    } catch {
      return false;
    }
  }

  /**
   * Check if user is currently authenticated (synchronous method for guards)
   */
  public isAuthenticated(): boolean {
    return this._authState.value.isAuthenticated;
  }

  /**
   * Get authentication headers for HTTP requests
   */
  public getAuthHeaders(): { [key: string]: string } {
    const token = this.getStoredToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
} 