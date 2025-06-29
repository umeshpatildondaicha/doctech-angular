import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

interface TimeSlot {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  capacity: number;
  bookedCount: number;
  status: 'available' | 'full' | 'closed';
}

@Component({
  selector: 'app-slot-management',
  templateUrl: './slot-management.component.html',
  styleUrls: ['./slot-management.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class SlotManagementComponent implements OnInit {
  slots: TimeSlot[] = [];
  selectedDate: Date = new Date();
  timeSlots: string[] = this.generateTimeSlots();

  constructor() {}

  ngOnInit() {
    this.loadSlots();
  }

  generateTimeSlots(): string[] {
    const slots: string[] = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  }

  loadSlots() {
    // TODO: Load from service
    this.slots = [
      {
        id: '1',
        date: new Date(),
        startTime: '09:00',
        endTime: '09:30',
        capacity: 3,
        bookedCount: 1,
        status: 'available'
      },
      {
        id: '2',
        date: new Date(),
        startTime: '10:00',
        endTime: '10:30',
        capacity: 3,
        bookedCount: 3,
        status: 'full'
      }
    ];
  }

  addSlot() {
    // TODO: Implement add slot
  }

  editSlot(slot: TimeSlot) {
    // TODO: Implement edit slot
  }

  deleteSlot(slotId: string) {
    // TODO: Implement delete slot
  }

  getSlotStatus(slot: TimeSlot): string {
    if (slot.status === 'closed') return 'Closed';
    if (slot.bookedCount >= slot.capacity) return 'Full';
    return `${slot.bookedCount}/${slot.capacity} Booked`;
  }
} 