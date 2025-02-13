// app.routes.ts
import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component'; // Import your DashboardComponent
import { AppointmentCalendarComponent } from './appointments/appointment-calendar/appointment-calendar.component'; 
import { PatientProfileComponent } from './patient-profile/patient-profile.component';
import { CalendarComponent } from './calendar/calendar.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: PatientProfileComponent },
  { path: 'appointments', loadChildren: () => import('./appointments/appointments.module').then(m => m.AppointmentsModule) },
  { path: 'calendar', component: CalendarComponent },
  { path: 'calendar', loadChildren: () => import('./calendar/calendar.module').then((m) => m.CalendarModule) },
  { path: '**', redirectTo: '/dashboard' },
];
