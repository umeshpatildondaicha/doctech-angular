import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Check authentication state synchronously first
    this.isAuthenticated = this.authService.isAuthenticated();
    this.currentRoute = this.router.url;
    
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
      
      // Force change detection to update viewMode
      this.cdr.detectChanges();
      
      // If authentication state changed, handle navigation
      if (wasAuthenticated !== this.isAuthenticated) {
        if (!this.isAuthenticated) {
          // User logged out, ensure we're on login page
          if (!this.currentRoute.includes('/login')) {
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
      
      if (event.url === '/login' && this.authService.isAuthenticated()) {
        // If user is authenticated and tries to access login, redirect to dashboard
        const userType = this.authService.getUserType();
        if (userType === 'HOSPITAL') {
          this.router.navigate(['/admin-dashboard']);
        } else if (userType === 'DOCTOR') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      }
    });
  }

  /**
   * Get the current view mode
   * Returns 'login' or 'main' to ensure only one view is rendered
   */
  get viewMode(): 'login' | 'main' {
    // Only show login if not authenticated AND on login route
    if (!this.isAuthenticated && this.currentRoute.includes('/login')) {
      return 'login';
    }
    // Show main layout if authenticated AND not on login route
    if (this.isAuthenticated && !this.currentRoute.includes('/login')) {
      return 'main';
    }
    // Default to login if not authenticated, main if authenticated
    return this.isAuthenticated ? 'main' : 'login';
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
