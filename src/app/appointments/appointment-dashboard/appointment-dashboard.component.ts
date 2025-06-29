import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { AppointmentListComponent } from '../appointment-list/appointment-list.component';
import { SlotManagementComponent } from '../slot-management/slot-management.component';
import { AppointmentCalendarComponent } from '../appointment-calendar/appointment-calendar.component';

@Component({
  selector: 'app-appointment-dashboard',
  templateUrl: './appointment-dashboard.component.html',
  styleUrls: ['./appointment-dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    AppointmentListComponent,
    SlotManagementComponent,
    AppointmentCalendarComponent
  ]
})
export class AppointmentDashboardComponent implements OnInit {
  selectedDate: Date = new Date();
  
  // Quick stats
  stats = {
    totalAppointments: 0,
    todayAppointments: 0,
    pendingConfirmation: 0,
    availableSlots: 0
  };

  constructor() {}

  ngOnInit() {
    this.loadDashboardStats();
  }

  loadDashboardStats() {
    // TODO: Load actual stats from service
    this.stats = {
      totalAppointments: 45,
      todayAppointments: 8,
      pendingConfirmation: 3,
      availableSlots: 12
    };
  }

  navigateToSlotManagement() {
    // TODO: Implement navigation
  }

  navigateToAppointmentList() {
    // TODO: Implement navigation
  }

  navigateToCalendar() {
    // TODO: Implement navigation
  }
} 