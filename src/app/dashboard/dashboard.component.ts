import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as Highcharts from 'highcharts';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HighchartsChartModule, FormsModule], // Add FormsModule here
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  Highcharts: typeof Highcharts = Highcharts;
  incomeChartOptions: Highcharts.Options = {};
  isBrowser = false;
  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (isPlatformBrowser(this.platformId)) {
      this.incomeChartOptions = {
        chart: {
          type: 'column',
          height: null,
        },
        title: { text: 'Income Overview' },
        xAxis: {
          categories:
            this.incomeFilter === '7days'
              ? ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7']
              : [
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
        series: [
          {
            name: 'Income',
            data: this.getIncomeData(),
            type: 'column',
          },
        ],
      };
    }
  }

  // Add new income metric
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
    { title: 'Book Appointments', value: '291', subtext: 'As of Jan 20, 2025' },
    {
      title: 'Room Availability',
      value: '50/100',
      subtext: 'As of Jan 20, 2025',
      increment: '-2%',
    },
    // New income metric
    {
      title: 'Total Income',
      value: '$120,000',
      subtext: 'As of Jan 20, 2025',
      increment: '+10%',
    },
  ];
  // Filter options for income

  // Income data for the last 7 days and monthly income
  dailyIncome: number[] = [1000, 1200, 10, 1300, 1100, 1400, 3600]; // Example daily income for the last 7 days
  monthlyIncome: number[] = [
    5000, 5300, 5400, 5600, 5900, 6100, 6200, 6400, 6500, 6700, 6900, 7100,
  ]; // Example monthly income
  totalIncome: number = this.dailyIncome.reduce(
    (sum, income) => sum + income,
    0
  ); // Sum of daily income

  // Selected filter value
  incomeFilter: string = '7days';

  // Method to update the chart and data based on the selected filter
  getIncomeData() {
    if (this.incomeFilter === '7days') {
      return this.dailyIncome;
    } else if (this.incomeFilter === 'monthly') {
      return this.monthlyIncome;
    }
    return [];
  }

  // Component logic in TypeScript
  searchQuery = '';
  statusFilter = '';
  visitTypeFilter = '';

  appointments: Appointment[] = [
    {
      name: 'Jonny Wilson',
      visitType: 'Initial visit',
      symptoms: 'Headache',
      status: 'Confirmed',
    },
    {
      name: 'Albert Flores',
      visitType: 'Follow-up visit',
      symptoms: 'Fever',
      status: 'Pending',
    },
    {
      name: 'Floyd Miles',
      visitType: 'Revisit',
      symptoms: 'Cough',
      status: 'Confirmed',
    },
    {
      name: 'Marvin McKinney',
      visitType: 'Emergency visit',
      symptoms: 'Back Pain',
      status: 'Cancelled',
    },
    {
      name: 'Jonny Wilson',
      visitType: 'Initial visit',
      symptoms: 'Headache',
      status: 'Confirmed',
    },
    {
      name: 'Albert Flores',
      visitType: 'Follow-up visit',
      symptoms: 'Fever',
      status: 'Pending',
    },
    {
      name: 'Floyd Miles',
      visitType: 'Revisit',
      symptoms: 'Cough',
      status: 'Confirmed',
    },
    {
      name: 'Marvin McKinney',
      visitType: 'Emergency visit',
      symptoms: 'Back Pain',
      status: 'Cancelled',
    },
  ];

  filteredAppointments(): Appointment[] {
    return this.appointments.filter((appointment) => {
      const matchesSearch =
        appointment.name
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase()) ||
        appointment.visitType
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase()) ||
        appointment.status
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase()) ||
        appointment.symptoms
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase());
      const matchesStatus =
        !this.statusFilter || appointment.status === this.statusFilter;
      const matchesVisitType =
        !this.visitTypeFilter || appointment.visitType === this.visitTypeFilter;
      return matchesSearch && matchesStatus && matchesVisitType;
    });
  }

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
        color: '#95b1fd',
        fillColor: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, '#95b1fd'],
            [1, '#d4f5ef'],
          ],
        },
        threshold: null,
        marker: {
          lineWidth: 1,
          lineColor: '#95b1fd',
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

  schedule = {
    available: 45,
    unavailable: 21,
    leave: 10,
  };

  doctors: Doctor[] = [
    {
      name: 'Nirmala Doke',
      specialization: 'Allergy Testing',
      status: 'Available',
    },
    { name: 'John Doe', specialization: 'Cardiology', status: 'Unavailable' },
    { name: 'Jane Smith', specialization: 'Neurology', status: 'Available' },
  ];

  appointmentColumnDefs: ColDef[] = [
    { field: 'name', headerName: 'Patient Name', sortable: true, filter: true },
    { field: 'date', headerName: 'Date In', sortable: true, filter: true },
    { field: 'symptoms', headerName: 'Symptoms', sortable: true, filter: true },
    {
      field: 'status',
      headerName: 'Status',
      cellClassRules: {
        'status-confirmed': (params) => params.value === 'Confirmed',
        'status-pending': (params) => params.value === 'Pending',
        'status-cancelled': (params) => params.value === 'Cancelled',
      },
    },
  ];

  doctorColumnDefs: ColDef[] = [
    { field: 'name', headerName: 'Doctor Name', sortable: true, filter: true },
    {
      field: 'specialization',
      headerName: 'Specialization',
      sortable: true,
      filter: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      cellClassRules: {
        'status-available': (params) => params.value === 'Available',
        'status-unavailable': (params) => params.value === 'Unavailable',
        'status-leave': (params) => params.value === 'On Leave',
      },
    },
  ];
}

interface Appointment {
  name: string;
  visitType: string;
  symptoms: string;
  status: string;
}

interface Doctor {
  name: string;
  specialization: string;
  status: string;
}
