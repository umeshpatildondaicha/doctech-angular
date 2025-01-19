import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],  
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})

export class SidebarComponent {
  // Toggle Submenu Visibility
  isPinned = false; 
  togglePinSidebar() {
    this.isPinned = !this.isPinned;
  }

  isSubmenuOpen = false;

  toggleSubmenu(event: Event): void {
    event.preventDefault();
    this.isSubmenuOpen = !this.isSubmenuOpen;
  }

}

