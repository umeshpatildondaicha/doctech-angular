import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface Appointment {
  id?: string | number;
  name: string;
  visitType: string;
  symptoms: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  photoUrl?: string;
  [key: string]: any; // Allow additional properties
}

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatBadgeModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css']
})
export class AppointmentListComponent {
  @Input() appointments: Appointment[] = [];
  @Input() showSearch: boolean = true;
  @Input() title: string = 'Appointments';
  @Input() defaultPhotoUrl: string = '../../assets/default-avatar.jpg';
  
  @Output() appointmentClicked = new EventEmitter<Appointment>();
  
  searchQuery: string = '';
  
  /**
   * Returns filtered appointments based on search query
   */
  filteredAppointments(): Appointment[] {
    if (!this.searchQuery.trim()) {
      return this.appointments;
    }
    
    const query = this.searchQuery.toLowerCase();
    return this.appointments.filter(appointment => 
      appointment.name.toLowerCase().includes(query) ||
      appointment.symptoms.toLowerCase().includes(query) ||
      appointment.visitType.toLowerCase().includes(query)
    );
  }
  
  /**
   * Handle appointment click and emit the selected appointment
   */
  onAppointmentClick(appointment: Appointment): void {
    this.appointmentClicked.emit(appointment);
  }
} 