import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTreeModule } from '@angular/material/tree';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRippleModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSliderModule } from '@angular/material/slider';
import { MatDividerModule } from '@angular/material/divider';
import { AppointmentDialogComponent } from '../appointment-dialog/appointment-dialog.component';
import { ExpandChartCellComponent } from '../expand-chart-cell/expand-chart-cell.component';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { BehaviorSubject } from 'rxjs';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { AppointmentEditComponent } from '../appointments/appointment-edit/appointment-edit.component';
import { GoogleCalendarService } from './google-calendar.service';

interface Appointment {
  title: string;
  date: Date;
  timeSlot?: string;
  color?: string;
  googleEventId?: string;
  uuid?: string;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatMenuModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatExpansionModule,
    MatChipsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatStepperModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatGridListModule,
    MatTreeModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonToggleModule,
    MatRippleModule,
    MatAutocompleteModule,
    MatSliderModule,
    MatDividerModule,
    AppointmentDialogComponent,
    ExpandChartCellComponent,
    DragDropModule,
    MatMomentDateModule,
    AppointmentEditComponent
  ],
  providers: [
    provideNativeDateAdapter(),
    provideMomentDateAdapter(),
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  viewDate: Date = new Date();
  currentView: 'month' | 'week' | 'day' = 'month';
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  timeSlots: string[] = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'];
  appointments: Appointment[] = [];
  weeks: Date[][] = [];
  monthDays: Date[] = [];
  currentViewSubject = new BehaviorSubject<'month' | 'week' | 'day'>('month');
  currentView$ = this.currentViewSubject.asObservable();

  constructor(
    private dialog: MatDialog,
    private googleCalendarService: GoogleCalendarService
  ) {
    this.generateCalendar();
  }

  ngOnInit() {
    this.googleCalendarService.events$.subscribe((googleEvents) => {
      this.mergeGoogleEvents(googleEvents);
    });
  }

  signInWithGoogle() {
    this.googleCalendarService.signIn();
  }

  signOutFromGoogle() {
    this.googleCalendarService.signOut();
  }

  mergeGoogleEvents(googleEvents: any[]) {
    const googleAppointments = googleEvents.map((event) => ({
      title: event.summary,
      date: new Date(event.start.dateTime || event.start.date),
      color: '#4285f4', // Google Blue
      googleEventId: event.id,
    }));
    this.appointments = [...this.appointments, ...googleAppointments];
  }

  getCurrentViewTitle(): string {
    if (this.currentView === 'month') {
      return `${this.viewDate.toLocaleString('default', { month: 'long' })} ${this.viewDate.getFullYear()}`;
    } else if (this.currentView === 'week') {
      const weekStart = new Date(this.viewDate);
      while (weekStart.getDay() !== 0) {
        weekStart.setDate(weekStart.getDate() - 1);
      }
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      if (weekStart.getMonth() === weekEnd.getMonth()) {
        return `${weekStart.toLocaleString('default', { month: 'long' })} ${weekStart.getFullYear()}`;
      } else {
        return `${weekStart.toLocaleString('default', { month: 'short' })} - ${weekEnd.toLocaleString('default', { month: 'short' })} ${weekStart.getFullYear()}`;
      }
    } else {
      return `${this.viewDate.toLocaleString('default', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    }
  }

  switchToView(event: any) {
    const view = event.value;
    console.log('Switching to view:', view);
    if (['month', 'week', 'day'].includes(view)) {
      this.currentView = view as 'month' | 'week' | 'day';
      this.currentViewSubject.next(this.currentView);
      this.generateCalendar();
    }
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
      this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() - 1, 1);
    } else if (this.currentView === 'week') {
      this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), this.viewDate.getDate() - 7);
    } else if (this.currentView === 'day') {
      this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), this.viewDate.getDate() - 1);
    }
    this.generateCalendar();
  }
  
  next() {
    if (this.currentView === 'month') {
      this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1);
    } else if (this.currentView === 'week') {
      this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), this.viewDate.getDate() + 7);
    } else if (this.currentView === 'day') {
      this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), this.viewDate.getDate() + 1);
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

    dialogRef.afterClosed().subscribe((result: Appointment | undefined) => {
      if (result) {
        this.appointments.push(result);
      }
    }, (error: any) => {
      console.error('Dialog closed with error:', error);
    });
  }

  editAppointment(appointment: Appointment, event: Event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AppointmentEditComponent, {
      data: appointment,
    });

    dialogRef.afterClosed().subscribe((result: Appointment | undefined) => {
      if (result) {
        const index = this.appointments.findIndex(
          (appt) => appt.uuid === result.uuid
        );
        if (index !== -1) {
          this.appointments[index] = result;
        }
      }
    }, (error: any) => {
      console.error('Dialog closed with error:', error);
    });
  }

  changeAppointmentTiming(date: Date) {
    const dialogRef = this.dialog.open(AppointmentEditComponent, {
      data: {
        date: date,
        isTimingChange: true
      },
    });

    dialogRef.afterClosed().subscribe((result: Appointment | undefined) => {
      if (result) {
        const appointmentsForDate = this.appointments.filter(
          appt => this.isSameDate(appt.date, date)
        );
        appointmentsForDate.forEach(appt => {
          appt.timeSlot = result.timeSlot;
        });
      }
    });
  }

  viewAppointmentCount(date: Date) {
    const count = this.getAppointmentCount(date);
    console.log(`Appointments for ${date.toDateString()}: ${count}`);
  }

  getAppointmentCount(date: Date): number {
    return this.appointments.filter(
      appointment => this.isSameDate(appointment.date, date)
    ).length;
  }

  private generateCalendar() {
    this.weeks = [];
    this.monthDays = [];
  
    if (this.currentView === 'month') {
      const startOfMonth = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
      const endOfMonth = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 0);
      
      let currentDay = new Date(startOfMonth);
      while (currentDay.getDay() !== 0) {
        currentDay.setDate(currentDay.getDate() - 1);
      }
  
      while (currentDay <= endOfMonth || currentDay.getDay() !== 0) {
        let week: Date[] = [];
        for (let i = 0; i < 7; i++) {
          week.push(new Date(currentDay));
          currentDay.setDate(currentDay.getDate() + 1);
        }
        this.weeks.push(week);
      }
    } 
    else if (this.currentView === 'week') {
      let startOfWeek = new Date(this.viewDate);
      while (startOfWeek.getDay() !== 0) {
        startOfWeek.setDate(startOfWeek.getDate() - 1);
      }
      for (let i = 0; i < 7; i++) {
        this.monthDays[i] = new Date(startOfWeek);
        startOfWeek.setDate(startOfWeek.getDate() + 1);
      }
    } 
    else if (this.currentView === 'day') {
      this.monthDays = [new Date(this.viewDate)];
    }
  }
}
