import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavItem } from '../../models/nav-item.model';

@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.css']
})
export class NavItemComponent {
  @Input() item!: NavItem;
  @Input() collapsed = false;
  @Input() level = 0;
  
  @Output() toggle = new EventEmitter<NavItem>();
  
  /**
   * Handle click on navigation item if it has an action instead of a route
   */
  onNavItemClick(): void {
    if (this.item.action) {
      this.toggle.emit(this.item);
    }
  }
  
  /**
   * Toggle expansion of a navigation item with children
   */
  toggleExpand(event: Event): void {
    if (this.item.children && this.item.children.length > 0) {
      event.preventDefault();
      this.item.active = !this.item.active;
      this.toggle.emit(this.item);
    }
  }
  
  get paddingLeft(): string {
    return this.collapsed ? '0' : `${this.level * 16}px`;
  }
} 