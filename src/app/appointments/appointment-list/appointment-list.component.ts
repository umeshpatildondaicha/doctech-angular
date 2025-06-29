import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no-show';

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  date: Date;
  time: string;
  type: string;
  status: AppointmentStatus;
  doctor: string;
}

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ]
})
export class AppointmentListComponent implements OnInit {
  @Input() view: 'upcoming' | 'past' | 'all' = 'upcoming';
  
  displayedColumns: string[] = ['date', 'time', 'patientName', 'type', 'doctor', 'status', 'actions'];
  appointments: Appointment[] = [];

  constructor() {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    // TODO: Load from service
    this.appointments = [
      {
        id: '1',
        patientName: 'John Doe',
        patientId: 'P001',
        date: new Date(),
        time: '09:00',
        type: 'Check-up',
        status: 'scheduled',
        doctor: 'Dr. Smith'
      },
      {
        id: '2',
        patientName: 'Jane Smith',
        patientId: 'P002',
        date: new Date(),
        time: '10:00',
        type: 'Follow-up',
        status: 'completed',
        doctor: 'Dr. Johnson'
      }
    ];
  }

  getStatusColor(status: AppointmentStatus): string {
    const colors: Record<AppointmentStatus, string> = {
      scheduled: 'primary',
      completed: 'accent',
      cancelled: 'warn',
      'no-show': 'warn'
    };
    return colors[status];
  }

  editAppointment(id: string) {
    // TODO: Implement edit
  }

  cancelAppointment(id: string) {
    // TODO: Implement cancel
  }

  viewDetails(id: string) {
    // TODO: Implement view details
  }
} 