import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    RouterLink,
    NgFor
  ],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css'
})
export class PatientsComponent {
  // Example patient data - replace with actual data from your service
  patients = [
    { 
      id: '1', 
      name: 'John Doe', 
      age: 35, 
      condition: 'Hypertension',
      lastVisit: new Date('2024-03-15'),
      status: 'Active'
    },
    { 
      id: '2', 
      name: 'Jane Smith', 
      age: 42, 
      condition: 'Diabetes',
      lastVisit: new Date('2024-03-10'),
      status: 'Active'
    },
    { 
      id: '3', 
      name: 'Mike Johnson', 
      age: 28, 
      condition: 'Asthma',
      lastVisit: new Date('2024-03-05'),
      status: 'Active'
    },
    { 
      id: '4', 
      name: 'Sarah Wilson', 
      age: 45, 
      condition: 'Arthritis',
      lastVisit: new Date('2024-03-01'),
      status: 'Active'
    },
    { 
      id: '5', 
      name: 'David Brown', 
      age: 52, 
      condition: 'Heart Disease',
      lastVisit: new Date('2024-02-28'),
      status: 'Active'
    }
  ];

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}
