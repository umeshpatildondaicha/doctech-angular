# Calendar Component

A modern, responsive calendar component built with the Angular Calendar library that provides a full-featured calendar view with event management capabilities.

## Features

- 📅 **Multiple Views**: Month, Week, and Day calendar views
- 🎯 **Event Management**: Display and manage calendar events with color coding
- 🎨 **Customizable**: Multiple input properties for customization
- 📱 **Responsive**: Works on desktop and mobile devices
- 🌙 **Dark Theme Support**: Automatic dark theme detection
- ⚡ **Event Indicators**: Visual dots for events on calendar days
- 🔄 **Navigation**: Previous/Next month navigation with "Today" button
- 🎛️ **View Toggle**: Switch between Month, Week, and Day views

## Dependencies

- `angular-calendar` - Main calendar library
- `date-fns` - Date utility library
- `@angular/material` - Material Design components

## Usage

### Basic Usage

```html
<app-calendar
  [events]="calendarEvents"
  [selectedDate]="selectedDate"
  (dateSelected)="onDateSelected($event)"
  (eventClicked)="onEventClicked($event)">
</app-calendar>
```

### Advanced Usage

```html
<app-calendar
  [events]="calendarEvents"
  [selectedDate]="selectedDate"
  [view]="'week'"
  [viewDate]="viewDate"
  [showNavigation]="true"
  [showToday]="true"
  [allowDateSelection]="true"
  [highlightToday]="true"
  [showEventIndicators]="true"
  [locale]="'en'"
  (dateSelected)="onDateSelected($event)"
  (eventClicked)="onEventClicked($event)"
  (monthChanged)="onMonthChanged($event)"
  (viewChanged)="onViewChanged($event)">
</app-calendar>
```

## Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `events` | `CalendarEvent[]` | `[]` | Array of calendar events to display |
| `selectedDate` | `Date` | `new Date()` | Currently selected date |
| `view` | `'month' \| 'week' \| 'day'` | `'month'` | Calendar view type |
| `viewDate` | `Date` | `new Date()` | Date to display in the calendar |
| `showNavigation` | `boolean` | `true` | Show month navigation controls |
| `showToday` | `boolean` | `true` | Show "Today" button |
| `allowDateSelection` | `boolean` | `true` | Allow clicking on dates |
| `highlightToday` | `boolean` | `true` | Highlight current date |
| `showEventIndicators` | `boolean` | `true` | Show event dots on calendar |
| `locale` | `string` | `'en'` | Locale for date formatting |

## Output Events

| Event | Type | Description |
|-------|------|-------------|
| `dateSelected` | `Date` | Emitted when a date is selected |
| `eventClicked` | `CalendarEvent` | Emitted when an event is clicked |
| `monthChanged` | `{year: number, month: number}` | Emitted when month navigation occurs |
| `viewChanged` | `string` | Emitted when view type changes |

## CalendarEvent Interface

```typescript
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  description?: string;
  type?: 'appointment' | 'break' | 'leave' | 'other';
  color?: {
    primary: string;
    secondary: string;
  };
  allDay?: boolean;
}
```

## Example Implementation

```typescript
import { Component } from '@angular/core';
import { CalendarComponent, CalendarEvent } from '../../tools/calendar/calendar.component';

@Component({
  selector: 'app-calendar-demo',
  standalone: true,
  imports: [CalendarComponent],
  template: `
    <app-calendar
      [events]="events"
      [selectedDate]="selectedDate"
      [view]="currentView"
      (dateSelected)="onDateSelected($event)"
      (eventClicked)="onEventClicked($event)"
      (viewChanged)="onViewChanged($event)">
    </app-calendar>
  `
})
export class CalendarDemoComponent {
  selectedDate = new Date();
  currentView: 'month' | 'week' | 'day' = 'month';
  
  events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Doctor Appointment',
      start: new Date(2024, 0, 15, 10, 0),
      end: new Date(2024, 0, 15, 11, 0),
      description: 'Regular checkup',
      type: 'appointment',
      color: {
        primary: '#1976d2',
        secondary: '#e3f2fd'
      }
    },
    {
      id: '2',
      title: 'Lunch Break',
      start: new Date(2024, 0, 15, 12, 0),
      end: new Date(2024, 0, 15, 13, 0),
      description: 'Staff lunch break',
      type: 'break',
      color: {
        primary: '#ff9800',
        secondary: '#fff3e0'
      }
    },
    {
      id: '3',
      title: 'Annual Leave',
      start: new Date(2024, 0, 20),
      end: new Date(2024, 0, 22),
      description: 'Vacation time',
      type: 'leave',
      allDay: true,
      color: {
        primary: '#f44336',
        secondary: '#ffebee'
      }
    }
  ];

  onDateSelected(date: Date) {
    console.log('Date selected:', date);
    this.selectedDate = date;
  }

  onEventClicked(event: CalendarEvent) {
    console.log('Event clicked:', event);
    // Handle event click
  }

  onViewChanged(view: string) {
    console.log('View changed to:', view);
    this.currentView = view as 'month' | 'week' | 'day';
  }
}
```

## View Types

### Month View
- Full month calendar grid
- Event indicators as colored dots
- Today highlighting
- Navigation between months

### Week View
- Weekly schedule view
- Hour-by-hour event display
- Event details visible
- Time-based navigation

### Day View
- Single day detailed view
- Hour segments for precise scheduling
- Full event details
- Time slot selection

## Styling

The component includes comprehensive styling with:
- Modern, clean design using Angular Calendar library
- Responsive layout for mobile devices
- Dark theme support
- Hover effects and transitions
- Customizable colors for events
- Material Design integration

## Configuration

The calendar requires configuration in your `app.config.ts`:

```typescript
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    importProvidersFrom(
      CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory,
      })
    )
  ]
};
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile) 