import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import type { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HighchartsChartModule, AgGridAngular],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  Highcharts: typeof Highcharts = Highcharts;
  color: any = 'green';
  metrics = [
    {
      title: 'Overall Visitors',
      value: '1,210',
      subtext: 'Data for 1 month',
      increment: '+5%',
    },
    {
      title: 'Total Patients',
      value: '871',
      subtext: 'As of Jan 20, 2025',
      increment: '+3%',
    },
    { title: 'Book Appointments', value: '291', subtext: 'As of Jan 20, 2025' }, // No increment
    {
      title: 'Room Availability',
      value: '50/100',
      subtext: 'As of Jan 20, 2025',
      increment: '-2%',
    },
  ];

  visitChartOptions: Highcharts.Options = {
    title: { text: 'Patient Visits' },
    xAxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    },
    plotOptions: {
      areaspline: {
        color: '#009479',
        fillColor: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, '#009479'],
            [1, '#d4f5ef'],
          ],
        },
        threshold: null,
        marker: {
          lineWidth: 1,
          lineColor: '#009479',
          fillColor: 'white',
        },
      },
    },
    series: [
      {
        type: 'areaspline',
        name: 'Visits',
        data: [120, 200, 150, 80, 70, 110, 130, 190, 230, 210, 150, 100],
      },
    ],
  };

  defaultColDef: ColDef = {
    flex: 1,
  };

  appointments = [
    {
      name: 'Jonny Wilson',
      date: 'Dec 18, 2021',
      symptoms: 'Geriatrician',
      status: 'Confirmed',
    },
    {
      name: 'Albert Flores',
      date: 'Dec 18, 2021',
      symptoms: 'Internist',
      status: 'Pending',
    },
    {
      name: 'Floyd Miles',
      date: 'Dec 18, 2021',
      symptoms: 'Urogynecologist',
      status: 'Confirmed',
    },
    {
      name: 'Marvin McKinney',
      date: 'Dec 18, 2021',
      symptoms: 'Cardiologist',
      status: 'Cancelled',
    },
  ];

  // Column Definitions: Defines the columns to be displayed.
  colDefs: ColDef[] = [
    {
      field: 'status',
      headerName: 'Status',
      cellRenderer: (params: any) => {
        if (params.value === 'Confirmed') {
          this.color = 'green';
        } else if (params.value === 'Cancelled') {
          this.color = 'red';
        } else {
          this.color = 'orange';
        }
        return `
        <span style="
          padding: 0.5em 1em;
          font-size: 12px;
          font-weight: 500;
          color: ${this.color};
          background-color: rgba(0, 123, 255, 0.1);
          border: 1px solid ${this.color};
          border-radius: 12px;
        ">
          ${params.value}
        </span>
      `;
      },
    },
    { field: 'name', headerName: 'Name', filter: 'agTextColumnFilter' },
    { field: 'date', headerName: 'Date' },
    { field: 'symptoms', headerName: 'Symptoms' },
  ];

  schedule = {
    available: 45,
    unavailable: 21,
    leave: 10,
  };

  doctors = [
    {
      name: 'Nirmala Doke',
      specialization: 'Allergy Testing',
      status: 'Available',
    },
    {
      name: 'Nirmala Doke',
      specialization: 'Allergy Testing',
      status: 'Unavailable',
    },
    {
      name: 'Nirmala Doke',
      specialization: 'Allergy Testing',
      status: 'Unavailable',
    },
    {
      name: 'Nirmala Doke',
      specialization: 'Allergy Testing',
      status: 'Available',
    },
  ];
}
