import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-appointment-calendar',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    NgClass,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatMomentDateModule,
    FormsModule,
    MatCardModule
  ],
  templateUrl: './appointment-calendar.component.html',
  styleUrls: ['./appointment-calendar.component.css'],
})
export class AppointmentCalendarComponent implements OnInit {
  selectedDate: Date = new Date();
  timeSlots: { time: string; booked: boolean; hasBreak: boolean; patientName?: string; patientContact?: string; patientNotes?: string; patientProfile?: string }[] = [];
  lastSevenDays: { label: string; date: Date }[] = [];
  slotFilter: string = 'all';
  selectedSlot: { time: string; booked: boolean; hasBreak: boolean; patientName?: string; patientContact?: string; patientNotes?: string; patientProfile?: string } | null = null;

  // Static booked slots (for now)
  staticBookedSlots: string[] = ['10:00', '11:30', '15:00'];

  constructor() {}

  ngOnInit(): void {
    this.initializeLastSevenDays();
    this.fetchAppointments();
  }

  initializeLastSevenDays(): void {
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayLabel = `${date.getDate()} ${date.toLocaleString('default', { weekday: 'short' })}`;
      this.lastSevenDays.push({ label: dayLabel, date });
    }
  }

  generateTimeSlots(): { time: string; booked: boolean; hasBreak: boolean; patientName?: string; patientContact?: string; patientNotes?: string; patientProfile?: string }[] {
    const slots = [];
    const start = 8; // Start time (8 AM)
    const end = 18; // End time (6 PM)

    for (let hour = start; hour < end; hour++) {
      slots.push({ time: `${hour}:00`, booked: false, hasBreak: false });
      slots.push({ time: `${hour}:30`, booked: false, hasBreak: hour === 12 });
    }
    return slots;
  }

  fetchAppointments(): void {
    this.timeSlots = this.generateTimeSlots();

    // Mark the static booked slots
    this.timeSlots.forEach((slot) => {
      if (this.staticBookedSlots.includes(slot.time)) {
        slot.booked = true;
        // Example profile details for booked slots
        slot.patientName = 'John Doe';
        slot.patientContact = '123-456-7890';
        slot.patientNotes = 'Follow-up appointment';
        slot.patientProfile = 'Profile details here';
      }
    });
  }

  filteredSlots() {
    return this.timeSlots.filter((slot) => {
      if (this.slotFilter === 'all') return true;
      const hour = parseInt(slot.time.split(':')[0], 10);
      if (this.slotFilter === 'morning') return hour >= 8 && hour < 12;
      if (this.slotFilter === 'afternoon') return hour >= 12 && hour < 16;
      if (this.slotFilter === 'evening') return hour >= 16 && hour < 18;
      return false;
    });
  }

  selectDay(day: { label: string; date: Date }): void {
    this.selectedDate = day.date;
    this.fetchAppointments();
  }

  confirmBooking(slot: { time: string; booked: boolean; hasBreak: boolean; patientName?: string; patientContact?: string; patientNotes?: string; patientProfile?: string }): void {
    if (!slot.booked) {
      this.selectedSlot = slot;
    } else {
      alert(`Slot at ${slot.time} is already booked.`);
    }
  }

  bookSlot(slot: { time: string; booked: boolean; hasBreak: boolean; patientName?: string; patientContact?: string; patientNotes?: string; patientProfile?: string }): void {
    if (!slot.booked) {
      slot.booked = true;
      alert(`Slot booked for ${this.selectedDate.toDateString()} at ${slot.time}`);
      this.selectedSlot = null;
    }
  }

  cancelBooking(): void {
    this.selectedSlot = null;
  }

  openDatePicker(): void {
    // Logic to open date picker
    alert('Date picker clicked!');
  }
}
