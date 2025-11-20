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
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Check authentication state synchronously first
    this.isAuthenticated = this.authService.isAuthenticated();
    // Get initial route - handle both absolute and relative paths
    // Only access window if in browser (not during SSR)
    const initialUrl = this.router.url || (isPlatformBrowser(this.platformId) ? window.location.pathname : '/');
    this.currentRoute = initialUrl;
    
    if (this.isAuthenticated) {
      const user = this.authService.getCurrentUser();
      this.userType = user?.userType || null;
    }

    // Subscribe to auth state changes
    this.authService.currentUser$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => {
      const wasAuthenticated = this.isAuthenticated;
      this.isAuthenticated = !!user;
      this.userType = user?.userType || null;
      
      // Update current route in case it changed
      this.currentRoute = this.router.url || (isPlatformBrowser(this.platformId) ? window.location.pathname : '/');
      
      // Force change detection to update viewMode
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

    // Listen to route changes to prevent showing login when authenticated
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event) => {
      this.currentRoute = event.url;
      
      // Force change detection to update viewMode
      this.cdr.detectChanges();
      
      // If user is authenticated and tries to access login, redirect to dashboard
      if ((event.url === '/login' || event.url.startsWith('/login')) && this.authService.isAuthenticated()) {
        const userType = this.authService.getUserType();
        if (userType === 'HOSPITAL') {
          this.router.navigate(['/admin-dashboard']);
        } else if (userType === 'DOCTOR') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      }
      
      // If user is not authenticated and on a protected route, let guards handle redirect
      // But ensure we're showing the correct view
      if (!this.isAuthenticated && event.url !== '/login' && !event.url.startsWith('/login')) {
        // Guards will redirect, but ensure viewMode is correct
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Get the current view mode
   * Returns 'login' or 'main' to ensure only one view is rendered
   */
  get viewMode(): 'login' | 'main' {
    // Explicitly check route first
    const isLoginRoute = this.currentRoute === '/login' || this.currentRoute.startsWith('/login');
    
    // ONLY show login view if we're actually on the login route
    // This ensures the router-outlet renders the correct component
    if (isLoginRoute) {
      // If authenticated and on login route, guards will redirect, but show main layout
      // If not authenticated and on login route, show login
      return this.isAuthenticated ? 'main' : 'login';
    }
    
    // For all other routes (including protected routes), show main layout
    // Route guards will handle authentication checks and redirects
    // This prevents showing login view with wrong component during hot reload
    return 'main';
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
