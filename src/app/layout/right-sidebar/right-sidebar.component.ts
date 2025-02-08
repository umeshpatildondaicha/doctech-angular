import { Component } from '@angular/core';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './app-right-sidebar.component.html',
  styleUrls: ['./app-right-sidebar.component.scss'],
})
export class RightSidebarComponent {
  isExpanded = true; // Open by default

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }
}
