import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
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

  constructor(
    private router: Router,
    private menuService: MenuService,
    private authService: AuthService
  ) {}

  ngOnInit() {
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
          this.menuService.updateMenu(user.userType);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
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
}
