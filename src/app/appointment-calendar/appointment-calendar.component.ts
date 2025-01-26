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

@Component({
  selector: 'app-appointment-calendar',
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
  ],
  templateUrl: './appointment-calendar.component.html',
  styleUrls: ['./appointment-calendar.component.css'],
})

export class AppointmentCalendarComponent implements OnInit {
  selectedDate: Date = new Date();
  timeSlots: { time: string; booked: boolean }[] = [];

  // Static booked slots (for now)
  staticBookedSlots: string[] = ['10:00', '11:30', '15:00'];

  constructor() {}

  ngOnInit(): void {
    this.fetchAppointments();
  }

  generateTimeSlots(): { time: string; booked: boolean }[] {
    const slots = [];
    const start = 8; // Start time (8 AM)
    const end = 18; // End time (6 PM)

    for (let hour = start; hour < end; hour++) {
      slots.push({ time: `${hour}:00`, booked: false });
      slots.push({ time: `${hour}:30`, booked: false });
    }
    return slots;
  }

  fetchAppointments(): void {
    this.timeSlots = this.generateTimeSlots();

    // Mark the static booked slots
    this.timeSlots.forEach((slot) => {
      if (this.staticBookedSlots.includes(slot.time)) {
        slot.booked = true;
      }
    });
  }

  bookSlot(slot: { time: string; booked: boolean }): void {
    if (!slot.booked) {
      slot.booked = true;
      alert(`Slot booked for ${this.selectedDate.toDateString()} at ${slot.time}`);
    } else {
      alert(`Slot at ${slot.time} is already booked.`);
    }
  }
}

