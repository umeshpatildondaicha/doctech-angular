import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { SidebarService } from './layout/services/sidebar.service';
import { CommonModule } from '@angular/common'; // For Angular common directives/pipes
import { HighchartsChartModule } from 'highcharts-angular'; // Import HighchartsChartModule
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    RouterModule, // Import RouterModule
    CommonModule, // For ngIf, ngFor, async pipe, etc.
    HighchartsChartModule, // Add Highcharts module
    HeaderComponent, // Standalone HeaderComponent
    SidebarComponent, // Standalone SidebarComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'doctech-angular';
  isSidebarPinned = false;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit(): void {
    this.sidebarService.isPinned$.subscribe((isPinned) => {
      this.isSidebarPinned = isPinned;
    });
  }

  onSidebarHoverStart() {
    this.sidebarService.setHoverState(true);
  }

  onSidebarHoverEnd() {
    this.sidebarService.setHoverState(false);
  }
}
