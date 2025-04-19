import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';

export interface TimeSlot {
  id?: string | number;
  time: string;
  booked: boolean;
  hasBreak?: boolean;
  patientName?: string;
  patientProfile?: string;
  patientContact?: string;
  patientNotes?: string;
  [key: string]: any; // Allow for additional properties
}

@Component({
  selector: 'app-time-slot',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatBadgeModule
  ],
  templateUrl: './time-slot.component.html',
  styleUrls: ['./time-slot.component.css']
})
export class TimeSlotComponent {
  @Input() slot!: TimeSlot;
  @Input() defaultProfileImage: string = '../../../assets/default-avatar.jpg';
  
  @Output() slotSelected = new EventEmitter<TimeSlot>();
  
  /**
   * Emit the slot when selected
   */
  onSlotClick(): void {
    this.slotSelected.emit(this.slot);
  }
} 