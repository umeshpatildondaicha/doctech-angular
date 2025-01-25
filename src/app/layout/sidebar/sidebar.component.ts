import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../services/sidebar.service';

@Component({
    selector: 'app-sidebar',
    imports: [CommonModule],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isPinned = false;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit(): void {
    // Subscribe to the pinned state from the service
    this.sidebarService.isPinned$.subscribe((isPinned) => {
      this.isPinned = isPinned;
    });
  }

  onHoverStart() {
    this.sidebarService.setHoverState(true);
  }

  onHoverEnd() {
    this.sidebarService.setHoverState(false);
  }

  togglePinSidebar() {
    this.sidebarService.setPinnedState(!this.isPinned);
  }

  isSubmenuOpen = false;

  toggleSubmenu(event: Event): void {
    event.preventDefault();
    this.isSubmenuOpen = !this.isSubmenuOpen;
  }
  logout(): void {
    console.log("User logged out");
  }
}
