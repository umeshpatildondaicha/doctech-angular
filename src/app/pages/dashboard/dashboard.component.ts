import { Component, OnInit, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DashboardDetailsComponent } from '../dashboard-details/dashboard-details.component';
import { MatDialog } from '@angular/material/dialog';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DashboardDetailsComponent, HighchartsChartModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  isBrowser = false;

  constructor(
    private dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.initializeChart();
    }
  }

  ngAfterViewInit() {
    // Ensure chart is initialized after view is ready
    if (this.isBrowser && !this.chartOptions.chart) {
      setTimeout(() => {
        this.initializeChart();
      }, 0);
    }
  }

  initializeChart() {
    this.chartOptions = {
      chart: {
        type: 'spline',
        backgroundColor: 'transparent',
        height: 120,
        spacing: [10, 10, 10, 10],
        events: {
          load: function() {
            // Chart loaded successfully
          }
        }
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        labels: {
          style: {
            fontSize: '10px',
            color: '#64748b'
          }
        },
        lineColor: '#e2e8f0',
        tickColor: '#e2e8f0'
      },
      yAxis: {
        title: {
          text: ''
        },
        labels: {
          style: {
            fontSize: '10px',
            color: '#64748b'
          }
        },
        gridLineColor: '#f1f5f9',
        gridLineWidth: 1
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        spline: {
          lineWidth: 3,
          color: '#10b3b3',
          marker: {
            enabled: false
          },
          states: {
            hover: {
              lineWidth: 4
            }
          }
        }
      },
      series: [{
        name: 'Patient Visits',
        type: 'spline',
        data: [80, 40, 60, 90, 50, 70, 30, 60, 40, 80, 60, 75]
      }],
      tooltip: {
        backgroundColor: '#ffffff',
        borderColor: '#e2e8f0',
        borderRadius: 8,
        borderWidth: 1,
        shadow: true,
        style: {
          fontSize: '12px'
        },
        formatter: function() {
          return `<b>${this.x}</b><br/>
                  <span style="color: #10b3b3">●</span> Patient Visits: <b>${this.y}</b>`;
        }
      }
    };
  }

  openDetails(cardType: 'patients' | 'appointments' | 'billing', event?: Event) {
    if (event && event.target instanceof HTMLElement) {
      event.target.blur();
    }
    this.dialog.open(DashboardDetailsComponent, {
      data: { cardType },
      width: '900px',
      autoFocus: false
    });
  }

  getDialogTitle(cardType: 'patients' | 'appointments' | 'billing'): string {
    switch (cardType) {
      case 'patients': return 'Patient Details';
      case 'appointments': return 'Appointment Details';
      case 'billing': return 'Billing Details';
      default: return 'Details';
    }
  }
}
