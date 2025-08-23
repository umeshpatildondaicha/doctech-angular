import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'angular-calendar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppButtonComponent } from '../app-button/app-button.component';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, format, parseISO } from 'date-fns';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  description?: string;
  type?: 'appointment' | 'break' | 'leave' | 'available' | 'other';
  color?: {
    primary: string;
    secondary: string;
  };
  allDay?: boolean;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    CalendarModule,
    MatButtonModule,
    MatIconModule,
    AppButtonComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  @Input() events: CalendarEvent[] = [];
  @Input() selectedDate: Date = new Date();
  @Input() view: 'month' | 'week' | 'day' = 'month';
  @Input() viewDate: Date = new Date();
  @Input() showNavigation: boolean = true;
  @Input() showToday: boolean = true;
  @Input() allowDateSelection: boolean = true;
  @Input() highlightToday: boolean = true;
  @Input() showEventIndicators: boolean = true;
  @Input() locale: string = 'en';
  
  @Output() dateSelected = new EventEmitter<Date>();
  @Output() eventClicked = new EventEmitter<CalendarEvent>();
  @Output() monthChanged = new EventEmitter<{ year: number; month: number }>();
  @Output() viewChanged = new EventEmitter<string>();

  calendarEvents: any[] = [];
  calendar: Date[][] = [];
  weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();

  ngOnInit() {
    this.convertEvents();
    this.generateCalendar();
  }

  ngOnChanges() {
    this.convertEvents();
    this.generateCalendar();
  }

  private generateCalendar() {
    this.calendar = [];
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    
    // Adjust to start from Sunday
    const dayOfWeek = firstDay.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    const weeks = Math.ceil((lastDay.getDate() + dayOfWeek) / 7);
    
    for (let week = 0; week < weeks; week++) {
      const weekDates: Date[] = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + (week * 7) + day);
        weekDates.push(date);
      }
      this.calendar.push(weekDates);
    }
  }

  private convertEvents() {
    this.calendarEvents = this.events.map(event => ({
      id: event.id,
      title: event.title,
      start: new Date(event.start),
      end: event.end ? new Date(event.end) : new Date(event.start),
      description: event.description,
      color: event.color || this.getDefaultColor(event.type),
      allDay: event.allDay || false,
      meta: {
        type: event.type,
        originalEvent: event
      }
    }));
  }

  private getDefaultColor(type?: string) {
    switch (type) {
      case 'appointment':
        return { primary: '#f44336', secondary: '#ffebee' }; // Red for filled slots
      case 'available':
        return { primary: '#4caf50', secondary: '#e8f5e8' }; // Green for available slots
      case 'break':
        return { primary: '#ff9800', secondary: '#fff3e0' };
      case 'leave':
        return { primary: '#f44336', secondary: '#ffebee' };
      default:
        return { primary: '#757575', secondary: '#f5f5f5' };
    }
  }

  onDateSelected(event: any) {
    this.selectedDate = event.date;
    this.dateSelected.emit(event.date);
  }

  onEventClicked(event: any) {
    this.eventClicked.emit(event.event.meta.originalEvent);
  }

  onViewChange(view: string) {
    this.view = view as 'month' | 'week' | 'day';
    this.viewChanged.emit(view);
  }

  onViewDateChange(date: Date) {
    this.viewDate = date;
    this.currentMonth = date.getMonth();
    this.currentYear = date.getFullYear();
    this.generateCalendar();
    this.monthChanged.emit({ 
      year: date.getFullYear(), 
      month: date.getMonth() 
    });
  }

  onTodayClick() {
    this.viewDate = new Date();
    this.selectedDate = new Date();
    this.currentMonth = new Date().getMonth();
    this.currentYear = new Date().getFullYear();
    this.generateCalendar();
  }

  previousMonth() {
    const newDate = new Date(this.currentYear, this.currentMonth - 1, 1);
    this.onViewDateChange(newDate);
  }

  nextMonth() {
    const newDate = new Date(this.currentYear, this.currentMonth + 1, 1);
    this.onViewDateChange(newDate);
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

  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.currentMonth;
  }

  getEventsForDate(date: Date): CalendarEvent[] {
    return this.events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  }

  getEventColor(event: CalendarEvent) {
    if (event.color) return event.color;
    
    switch (event.type) {
      case 'appointment':
        return { primary: '#f44336', secondary: '#ffebee' }; // Red for filled slots
      case 'available':
        return { primary: '#4caf50', secondary: '#e8f5e8' }; // Green for available slots
      case 'break':
        return { primary: '#ff9800', secondary: '#fff3e0' };
      case 'leave':
        return { primary: '#f44336', secondary: '#ffebee' };
      default:
        return { primary: '#757575', secondary: '#f5f5f5' };
    }
  }

  formatSelectedDate(): string {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    };
    return this.selectedDate.toLocaleDateString('en-US', options);
  }

  formatEventTime(event: CalendarEvent): string {
    if (event.allDay) return 'All-day';
    
    const startTime = new Date(event.start);
    const endTime = event.end ? new Date(event.end) : startTime;
    
    const startStr = startTime.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    
    if (event.end) {
      const endStr = endTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      return `${startStr} - ${endStr}`;
    }
    
    return startStr;
  }

  getMonthYearString(): string {
    return format(this.viewDate, 'MMMM yyyy');
  }
} 