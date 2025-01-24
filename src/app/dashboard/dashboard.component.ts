import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';


@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent {
  Highcharts = Highcharts;

  metrics = [
    { title: 'Overall Visitors', value: '1,210', subtext: 'Data for 1 month' },
    { title: 'Total Patients', value: '871', subtext: 'As of Jan 20, 2025' },
    { title: 'Book Appointments', value: '291', subtext: 'As of Jan 20, 2025' },
    { title: 'Room Availability', value: '50/100', subtext: 'As of Jan 20, 2025' },
  ];

  visitChartOptions = {
    title: { text: 'Patient Visits' },
    xAxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
    series: [
      {
        type: 'line',
        name: 'Visits',
        data: [120, 200, 150, 80, 70, 110, 130, 190, 230, 210, 150, 100]
      }
    ]
  };

  appointments = [
    { name: 'Jonny Wilson', date: 'Dec 18, 2021', symptoms: 'Geriatrician', status: 'Confirmed' },
    { name: 'Albert Flores', date: 'Dec 18, 2021', symptoms: 'Internist', status: 'Pending' },
    { name: 'Floyd Miles', date: 'Dec 18, 2021', symptoms: 'Urogynecologist', status: 'Confirmed' },
    { name: 'Marvin McKinney', date: 'Dec 18, 2021', symptoms: 'Cardiologist', status: 'Cancelled' },
  ];

  schedule = {
    available: 45,
    unavailable: 21,
    leave: 10,
  };

  doctors = [
    { name: 'Nirmala Doke', specialization: 'Allergy Testing', status: 'Available' },
    { name: 'Nirmala Doke', specialization: 'Allergy Testing', status: 'Unavailable' },
    { name: 'Nirmala Doke', specialization: 'Allergy Testing', status: 'Unavailable' },
    { name: 'Nirmala Doke', specialization: 'Allergy Testing', status: 'Available' },
  ];
}
