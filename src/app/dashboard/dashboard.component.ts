import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HighchartsChartModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  Highcharts: typeof Highcharts = Highcharts;

  metrics = [
    { title: 'Overall Visitors', value: '1,210', subtext: 'Data for 1 month' },
    { title: 'Total Patients', value: '871', subtext: 'As of Jan 20, 2025' },
    { title: 'Book Appointments', value: '291', subtext: 'As of Jan 20, 2025' },
    {
      title: 'Room Availability',
      value: '50/100',
      subtext: 'As of Jan 20, 2025',
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
