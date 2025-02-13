import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentDialogComponent } from '../appointment-dialog/appointment-dialog.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatIconModule,
    DragDropModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  viewDate: Date = new Date();
  currentView: 'month' | 'week' | 'day' = 'month';
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  timeSlots: string[] = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'];
  appointments: any[] = [];
  weeks: Date[][] = [];
  monthDays: Date[] = [];

  constructor(private dialog: MatDialog) {
    this.generateCalendar();
  }

  switchToView(view: string) {
    this.currentView = view as 'month' | 'week' | 'day';
    this.generateCalendar();
  }

  drop(event: CdkDragDrop<any[]>, date: Date, timeSlot?: string) {
    const previousIndex = this.appointments.findIndex(
      (appointment) => appointment === event.item.data
    );
    const newAppointment = { ...event.item.data, date, timeSlot };
    this.appointments.splice(previousIndex, 1);
    this.appointments.push(newAppointment);
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.viewDate.getMonth();
  }

  isSameDate(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  }

  getAppointmentsForDateTime(date: Date, timeSlot: string): any[] {
    return this.appointments.filter(
      (appointment) =>
        this.isSameDate(appointment.date, date) &&
        appointment.timeSlot === timeSlot
    );
  }

  previous() {
    if (this.currentView === 'month') {
      this.viewDate.setMonth(this.viewDate.getMonth() - 1);
    } else if (this.currentView === 'week' || this.currentView === 'day') {
      this.viewDate.setDate(this.viewDate.getDate() - 7);
    }
    this.generateCalendar();
  }

  next() {
    if (this.currentView === 'month') {
      this.viewDate.setMonth(this.viewDate.getMonth() + 1);
    } else if (this.currentView === 'week' || this.currentView === 'day') {
      this.viewDate.setDate(this.viewDate.getDate() + 7);
    }
    this.generateCalendar();
  }

  viewToday() {
    this.viewDate = new Date();
    this.generateCalendar();
  }

  selectDate(date?: Date, timeSlot?: string) {
    const dialogRef = this.dialog.open(AppointmentDialogComponent, {
      data: {
        date: date || this.viewDate,
        timeSlot: timeSlot || '',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.appointments.push(result);
      }
    });
  }

  editAppointment(appointment: any, event: Event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AppointmentDialogComponent, {
      data: appointment,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const index = this.appointments.findIndex(
          (appt) => appt.uuid === result.uuid
        );
        if (index !== -1) {
          this.appointments[index] = result;
        }
      }
    });
  }

  private generateCalendar() {
    this.weeks = [];
    this.monthDays = [];
    const startOfMonth = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
    const endOfMonth = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 0);
    let currentDay = new Date(startOfMonth);

    while (currentDay <= endOfMonth) {
      this.monthDays.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }

    let week: Date[] = [];
    for (let day of this.monthDays) {
      week.push(day);
      if (week.length === 7) {
        this.weeks.push(week);
        week = [];
      }
    }
    if (week.length > 0) {
      this.weeks.push(week);
    }
  }
}
