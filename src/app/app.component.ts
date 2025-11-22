import { Component, OnInit, OnDestroy, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { TopbarComponent } from './layout/topbar/topbar.component';
import { RightSidebarComponent } from './layout/right-sidebar/right-sidebar.component';
import { AuthService } from './services/auth.service';
import { Subject, takeUntil, filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent, TopbarComponent, RightSidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Shree Clinic Management System';
  sidebarCollapsed = false;
  rightSidebarOpened = false;
  isAuthenticated = false;
  userType: string | null = null;
  currentRoute = '';
  isAuthInitialized = false; // Track if auth state has been initialized
  viewMode: 'login' | 'main' = 'login'; // Explicit property instead of getter
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Get initial route
    const initialUrl = this.router.url || (isPlatformBrowser(this.platformId) ? window.location.pathname : '/');
    this.currentRoute = initialUrl;
    
    // Check storage directly to avoid timing issues with state initialization
    // This prevents the login flash on page refresh
    const token = this.authService.getStoredToken();
    const user = this.authService.getStoredUser();
    const hasStoredAuth = !!(token && user);
    this.isAuthenticated = hasStoredAuth;
    
    if (this.isAuthenticated) {
      this.userType = user?.userType || null;
    }

    // Set initial view mode synchronously to prevent both views showing
    const isLoginRoute = initialUrl === '/login' || initialUrl.startsWith('/login');
    if (isLoginRoute && !hasStoredAuth) {
      this.viewMode = 'login';
    } else {
      this.viewMode = 'main';
    }
    
    // Update view mode after initial setup (will be called again when state initializes)
    this.updateViewMode();

    // Subscribe to auth state changes
    this.authService.authState$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(state => {
      // Mark as initialized after first state update
      if (!this.isAuthInitialized) {
        this.isAuthInitialized = true;
      }
      
      const wasAuthenticated = this.isAuthenticated;
      this.isAuthenticated = state.isAuthenticated;
      this.userType = state.currentUser?.user?.userType || null;
      
      // Update current route
      this.currentRoute = this.router.url || (isPlatformBrowser(this.platformId) ? window.location.pathname : '/');
      
      // Update view mode when auth state changes
      this.updateViewMode();
      
      // Force change detection
      this.cdr.detectChanges();
      
      // If authentication state changed, handle navigation
      if (wasAuthenticated !== this.isAuthenticated) {
        if (!this.isAuthenticated) {
          // User logged out, ensure we're on login page
          const currentUrl = this.router.url || (isPlatformBrowser(this.platformId) ? window.location.pathname : '/');
          if (!currentUrl.includes('/login')) {
            this.router.navigate(['/login']);
          }
        }
      }
    });

    // Listen to route changes
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event) => {
      this.currentRoute = event.url;
      
      // Check authentication from storage to avoid timing issues
      const token = this.authService.getStoredToken();
      const user = this.authService.getStoredUser();
      const hasStoredAuth = !!(token && user);
      
      // Use stored auth during initialization, state after
      const isAuth = this.isAuthInitialized ? this.isAuthenticated : hasStoredAuth;
      
      // If user is authenticated and tries to access login, redirect to dashboard
      if ((event.url === '/login' || event.url.startsWith('/login')) && isAuth) {
        const userType = user?.userType || this.authService.getUserType();
        if (userType === 'HOSPITAL') {
          this.router.navigate(['/admin-dashboard']);
        } else if (userType === 'DOCTOR') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/dashboard']);
        }
        return; // Don't update viewMode yet, wait for navigation
      }
      
      // Update view mode when route changes
      this.updateViewMode();
      
      // Force change detection
      this.cdr.detectChanges();
    });
  }

  /**
   * Update the view mode based on current route and authentication state
   * This ensures only one view is rendered at a time
   */
  private updateViewMode(): void {
    // Explicitly check route first
    const isLoginRoute = this.currentRoute === '/login' || this.currentRoute.startsWith('/login');
    
    // Check storage directly to avoid timing issues during initialization
    const token = this.authService.getStoredToken();
    const user = this.authService.getStoredUser();
    const hasStoredAuth = !!(token && user);
    
    // Determine authentication status
    // During initialization, use stored auth data
    // After initialization, use the state (which may have been updated by token refresh)
    const isAuth = this.isAuthInitialized 
      ? this.isAuthenticated 
      : hasStoredAuth;
    
    // ONLY show login view if we're actually on the login route AND not authenticated
    if (isLoginRoute) {
      // If authenticated and on login route, show main layout (guards will redirect)
      // If not authenticated and on login route, show login
      this.viewMode = isAuth ? 'main' : 'login';
    } else {
      // For all other routes, always show main layout
      // Route guards will handle authentication checks and redirects
      this.viewMode = 'main';
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  openPatientQueue(event: any) {
    this.rightSidebarOpened = true;
  }

  closeRightSidebar() {
    this.rightSidebarOpened = false;
  }
}
