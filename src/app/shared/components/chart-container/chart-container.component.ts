import { Component, Input, isDevMode, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatCardModule } from '@angular/material/card';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-chart-container',
  standalone: true,
  imports: [
    CommonModule,
    HighchartsChartModule,
    MatCardModule
  ],
  templateUrl: './chart-container.component.html',
  styleUrls: ['./chart-container.component.css']
})
export class ChartContainerComponent {
  @Input() title: string = '';
  @Input() chartOptions: Highcharts.Options = {};
  @Input() height: string = '300px';
  @Input() showCard: boolean = true;
  
  // Make Highcharts available for the template
  Highcharts: typeof Highcharts = Highcharts;
  
  // Check if we're in the browser
  isBrowser: boolean = false;
  
  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    // Log a warning if we're in dev mode and not in a browser
    if (isDevMode() && !this.isBrowser) {
      console.warn('ChartContainerComponent: Highcharts may not render properly in SSR mode');
    }
  }
} 