import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
  ],
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.css'],
})
export class PatientProfileComponent implements OnInit {
  activeTab: string = 'profile';

  quickLinks = [
    { title: 'Prescriptions', icon: 'medication' },
    { title: 'Lab Reports', icon: 'science' },
    { title: 'Billing', icon: 'receipt' },
    { title: 'Appointments', icon: 'calendar_today' },
  ];
  displayedColumns: string[] = [
    'reportType',
    'date',
    'description',
    'status',
    'actions',
  ];

  medicalHistory = [
    {
      condition: 'Hypertension',
      date: new Date(2020, 0, 10),
      status: 'Resolved',
    },
    { condition: 'Diabetes', date: new Date(2021, 4, 15), status: 'Ongoing' },
  ];

  appointments = [
    {
      date: new Date(2024, 3, 10),
      doctor: 'Dr. Smith',
      purpose: 'Routine Checkup',
    },
    {
      date: new Date(2024, 3, 15),
      doctor: 'Dr. Johnson',
      purpose: 'Follow-up',
    },
  ];

  medications = [
    { medicine: 'Metformin', dosage: '500mg', status: 'Active' },
    { medicine: 'Lisinopril', dosage: '10mg', status: 'Active' },
  ];

  vitals = [
    {
      date: new Date(2024, 2, 1),
      bloodPressure: '120/80',
      heartRate: '72',
      temperature: '98.6°F',
    },
    {
      date: new Date(2024, 2, 15),
      bloodPressure: '118/78',
      heartRate: '70',
      temperature: '98.4°F',
    },
  ];

  patientStats = [
    {
      label: 'BMI',
      value: '25.5',
      unit: '',
      change: '0.5',
    },
    {
      label: 'Height',
      value: '175',
      unit: 'cm',
      change: '0.5',
    },
    {
      label: 'Weight',
      value: '70',
      unit: 'kg',
      change: '0.5',
    },
    {
      label: 'BP',
      value: '120/80',
      unit: 'mmHg',
      change: '0.5',
    },
  ];

  patient = {
    id: '#P7085',
    name: 'Umesh Patil',
    gender: 'Male',
    age: '41 years 0 months 3 days',
    mobile: '+811 847-4958',
    dob: new Date(1980, 7, 10),
    bed: '104 - VIP Ward - 1st Floor',
    email: 'info@softnio.com',
    consultant: 'Ernesto Vargas',
    patientType: 'In Patient',
    country: 'United State',
    nationality: 'United State',
    photo: './assets/default-avatar.jpg',
    phone: '+811 847-4958',
    doctorsNote:
      'Aproin at metus et dolor tincidunt feugiat eu id quam. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aenean sollicitudin non nunc vel pharetra.',
    noteAddedOn: new Date(2019, 10, 18, 17, 34),
  };

  diagnosis = [
    {
      reportType: 'CT Scan',
      date: new Date(2020, 1, 10),
      description:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Modi ipsam molestiae aut.',
      status: 'Done',
    },
    {
      reportType: 'Blood Test',
      date: new Date(2020, 1, 11),
      description:
        'Dolor sit amet consectetur adipisicing elit. Modi ipsam molestiae aut.',
      status: 'Pending',
    },
    {
      reportType: 'Blood Analysis',
      date: new Date(2020, 1, 11),
      description:
        'Tempore aut incidunt accusamus accusantium deleniti? Labore odio aperiam mollitia quaerat quos!',
      status: 'Pending',
    },
    {
      reportType: 'Vascular Sonography',
      date: new Date(2020, 1, 10),
      description:
        'Lquia soluta illo sed veniam repudiandae esse sequi qui impedit facilis laboriosam sapiente suscipit!',
      status: 'Done',
    },
  ];

  prescriptions = [
    {
      medicine: 'Erovit plus',
      category: 'Capsule',
      dosage: '1 - 0 - 1',
      instruction: 'Take after full meal for 7 days.',
      prescribedBy: 'Ernesto Vargas',
      status: 'Active',
    },
    {
      medicine: 'Napa Extra',
      category: 'Tablet',
      dosage: '1 - 1 - 1',
      instruction: 'Take after full meal for 3 days.',
      prescribedBy: 'Ernesto Vargas',
      status: 'Active',
    },
    {
      medicine: 'Sergel',
      category: 'Capsule',
      dosage: '1 - 0 - 1',
      instruction: 'Take before meal for 15 days.',
      prescribedBy: 'Ernesto Vargas',
      status: 'Active',
    },
  ];

  charges = [
    {
      date: new Date(2020, 1, 10),
      category: 'Eye Check',
      chargesType: 'Procedures',
      standardCharges: 35,
      tpaCharges: 0,
      applied: 35,
    },
    {
      date: new Date(2020, 1, 10),
      category: 'Blood Analysis',
      chargesType: 'Procedures',
      standardCharges: 65,
      tpaCharges: 0,
      applied: 65,
    },
  ];

  payments = [
    {
      date: new Date(2020, 1, 10),
      paymentMethod: 'Cash',
      amount: 200,
      status: 'Paid',
    },
    {
      date: new Date(2020, 1, 11),
      paymentMethod: 'Cash',
      amount: 1923,
      status: 'Due',
    },
  ];

  parseNumber(value: any): number {
    return parseFloat(value);
  }

  constructor() {}

  ngOnInit(): void {}
}
