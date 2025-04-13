import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../services/sidebar.service';
import { isPlatformBrowser } from '@angular/common';
import * as Highcharts from 'highcharts';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isPinned = false;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

  constructor(private sidebarService: SidebarService, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    // Subscribe to the pinned state from the service
    this.sidebarService.isPinned$.subscribe((isPinned) => {
      this.isPinned = isPinned;
    });

    if (isPlatformBrowser(this.platformId)) {
      this.initializeChart();
    }
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

  initializeChart(): void {
    this.chartOptions = {
      // Your Highcharts configuration
    };
  }
}
