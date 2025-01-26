// app.routes.ts
import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component'; // Import your DashboardComponent
import { AppointmentCalendarComponent } from './appointment-calendar/appointment-calendar.component'; // Import your AppointmentCalendarComponent
export const routes: Routes = [
  // { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'calendar', component: AppointmentCalendarComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', redirectTo: '/dashboard' },

];
