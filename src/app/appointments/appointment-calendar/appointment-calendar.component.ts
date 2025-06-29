import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  patientName: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  doctor: string;
}

interface TimeSlot {
  hour: number;
  minute: number;
  hasEvent: boolean;
  event?: CalendarEvent;
}

@Component({
  selector: 'app-appointment-calendar',
  templateUrl: './appointment-calendar.component.html',
  styleUrls: ['./appointment-calendar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatBadgeModule,
    MatDialogModule,
    MatSnackBarModule
  ]
})
export class AppointmentCalendarComponent implements OnInit {
  currentDate: Date = new Date();
  selectedDate: Date = new Date();
  viewMode: 'month' | 'week' | 'day' = 'month';
  events: CalendarEvent[] = [];
  timeSlots: TimeSlot[] = [];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadEvents();
    this.generateTimeSlots();
  }

  loadEvents() {
    // TODO: Load from service
    this.events = [
      {
        id: '1',
        title: 'Check-up',
        start: new Date(2024, 3, 20, 9, 0),
        end: new Date(2024, 3, 20, 10, 0),
        patientName: 'John Doe',
        type: 'Check-up',
        status: 'scheduled',
        doctor: 'Dr. Smith'
      },
      {
        id: '2',
        title: 'Follow-up',
        start: new Date(2024, 3, 20, 11, 0),
        end: new Date(2024, 3, 20, 12, 0),
        patientName: 'Jane Smith',
        type: 'Follow-up',
        status: 'completed',
        doctor: 'Dr. Johnson'
      }
    ];
  }

  generateTimeSlots() {
    this.timeSlots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slot: TimeSlot = {
          hour,
          minute,
          hasEvent: false
        };
        
        // Check if there's an event in this time slot
        const event = this.findEventAtTime(hour, minute);
        if (event) {
          slot.hasEvent = true;
          slot.event = event;
        }
        
        this.timeSlots.push(slot);
      }
    }
  }

  findEventAtTime(hour: number, minute: number): CalendarEvent | undefined {
    return this.events.find(event => {
      const eventStart = event.start;
      const eventEnd = event.end;
      
      // Check if the time is within the event's time range
      const timeInMinutes = hour * 60 + minute;
      const eventStartMinutes = eventStart.getHours() * 60 + eventStart.getMinutes();
      const eventEndMinutes = eventEnd.getHours() * 60 + eventEnd.getMinutes();
      
      return timeInMinutes >= eventStartMinutes && timeInMinutes < eventEndMinutes;
    });
  }

  getEventsForDate(date: Date): CalendarEvent[] {
    return this.events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      scheduled: 'primary',
      completed: 'accent',
      cancelled: 'warn',
      'no-show': 'warn'
    };
    return colors[status] || 'primary';
  }

  previousPeriod() {
    const newDate = new Date(this.currentDate);
    if (this.viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (this.viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    this.currentDate = newDate;
  }

  nextPeriod() {
    const newDate = new Date(this.currentDate);
    if (this.viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (this.viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    this.currentDate = newDate;
  }

  today() {
    this.currentDate = new Date();
    this.selectedDate = new Date();
  }

  changeView(mode: 'month' | 'week' | 'day') {
    this.viewMode = mode;
  }

  selectDate(date: Date) {
    this.selectedDate = date;
    if (this.viewMode === 'day') {
      // When selecting a date in day view, update the current date
      this.currentDate = new Date(date);
    }
  }

  getDaysInMonth(date: Date): Date[] {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days: Date[] = [];
    
    // Add days from previous month
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i));
    }
    
    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    // Add days from next month
    const remainingDays = 42 - days.length; // 6 rows * 7 days = 42
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  }

  getDaysInWeek(date: Date): Date[] {
    const days: Date[] = [];
    const current = new Date(date);
    current.setDate(current.getDate() - current.getDay()); // Start from Sunday
    
    for (let i = 0; i < 7; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  }

  getHours(): number[] {
    return Array.from({ length: 24 }, (_, i) => i);
  }

  getEventPosition(event: CalendarEvent): number {
    const startHour = event.start.getHours();
    const startMinutes = event.start.getMinutes();
    return (startHour + startMinutes / 60) * (100 / 24);
  }

  getEventHeight(event: CalendarEvent): number {
    const startTime = event.start.getHours() + event.start.getMinutes() / 60;
    const endTime = event.end.getHours() + event.end.getMinutes() / 60;
    return (endTime - startTime) * (100 / 24);
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  isSelected(date: Date): boolean {
    return date.getDate() === this.selectedDate.getDate() &&
           date.getMonth() === this.selectedDate.getMonth() &&
           date.getFullYear() === this.selectedDate.getFullYear();
  }

  clickTimeSlot(hour: number, minute: number) {
    const slot = this.timeSlots.find(s => s.hour === hour && s.minute === minute);
    if (slot) {
      if (slot.hasEvent && slot.event) {
        // Show event details
        this.showEventDetails(slot.event);
      } else {
        // Create new appointment
        this.createNewAppointment(hour, minute);
      }
    }
  }

  showEventDetails(event: CalendarEvent) {
    // Show a snackbar with event details
    this.snackBar.open(
      `${event.title} - ${event.patientName} (${event.start.toLocaleTimeString()} - ${event.end.toLocaleTimeString()})`,
      'Close',
      { duration: 3000 }
    );
    
    // TODO: Open a dialog with more details
  }

  createNewAppointment(hour: number, minute: number) {
    // Show a snackbar with the selected time
    this.snackBar.open(
      `New appointment at ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      'Close',
      { duration: 3000 }
    );
    
    // TODO: Open a dialog to create a new appointment
  }
}
