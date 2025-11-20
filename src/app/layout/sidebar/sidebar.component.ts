import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { IconComponent } from '../../tools/app-icon/icon.component';
import { SidebarMenuItem } from '../../interfaces/sidebarmenu.interface';
import { MenuService } from '../../services/menu.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() collapsed = false;
  @Output() toggle = new EventEmitter<void>();

  iconSizeOnCollapsed = 18;
  iconSizeOnExpanded = 20;

  menuList: SidebarMenuItem[] = [];
  private subscriptions = new Subscription();
  
  // Responsive properties
  isMobile = false;
  isTablet = false;
  screenWidth = 0;

  constructor(
    private router: Router,
    private menuService: MenuService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Initialize screen size
    this.checkScreenSize();
    
    // Subscribe to menu changes
    this.subscriptions.add(
      this.menuService.getMenu().subscribe(menu => {
        this.menuList = menu;
      })
    );

    // Subscribe to auth changes to update menu
    this.subscriptions.add(
      this.authService.currentUser$.subscribe(user => {
        if (user) {
          console.log('Sidebar received user:', user);
          // Map user types to menu service expected values
          let menuUserType: 'doctor' | 'admin';
          if (user.userType === 'HOSPITAL') {
            menuUserType = 'admin';
          } else if (user.userType === 'DOCTOR') {
            menuUserType = 'doctor';
          } else {
            menuUserType = 'doctor'; // Default fallback
          }
          console.log('Updating menu for user type:', menuUserType);
          this.menuService.updateMenu(menuUserType);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  getMenuItemsBySection(section: string): SidebarMenuItem[] {
    return this.menuList.filter(item => item.section === section);
  }

  getSectionTitle(section: string): string {
    const sectionTitles: { [key: string]: string } = {
      'main': 'Main',
      'management': 'Management',
      'services': 'Services',
      'administration': 'Administration',
      'tools': 'Tools'
    };
    return sectionTitles[section] || section;
  }

  // Screen size detection
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    // Only check screen size in browser (not during SSR)
    if (!isPlatformBrowser(this.platformId)) {
      // Default values for SSR
      this.screenWidth = 1024;
      this.isMobile = false;
      this.isTablet = false;
      return;
    }
    
    this.screenWidth = window.innerWidth;
    this.isMobile = this.screenWidth <= 768;
    this.isTablet = this.screenWidth > 768 && this.screenWidth <= 1024;
    
    // Auto-collapse on mobile/tablet
    if (this.isMobile || this.isTablet) {
      if (!this.collapsed) {
        this.toggle.emit();
      }
    }
  }

  // Get sidebar classes for responsive behavior
  getSidebarClasses(): string {
    let classes = 'sidebar';
    
    if (this.collapsed) {
      classes += ' collapsed';
    }
    
    if (this.isMobile) {
      classes += ' mobile-overlay';
    } else if (this.isTablet) {
      classes += ' tablet-overlay';
    } else {
      classes += ' desktop-sidebar';
    }
    
    return classes;
  }

  // Handle navigation with auto-close on mobile
  navigateTo(path: string) {
    this.router.navigate([path]);
    
    // Auto-close sidebar on mobile after navigation
    if (this.isMobile && !this.collapsed) {
      this.toggle.emit();
    }
  }

  // Handle backdrop click to close sidebar
  onBackdropClick() {
    if ((this.isMobile || this.isTablet) && !this.collapsed) {
      this.toggle.emit();
    }
  }
}
