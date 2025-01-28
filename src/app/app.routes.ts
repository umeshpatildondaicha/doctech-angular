// app.routes.ts
import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component'; // Import your DashboardComponent
import { AppointmentCalendarComponent } from './appointment-calendar/appointment-calendar.component'; 
import { PatientProfileComponent } from './patient-profile/patient-profile.component';
export const routes: Routes = [
  // { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'calendar', component: AppointmentCalendarComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: PatientProfileComponent },
  { path: '**', redirectTo: '/dashboard' },


];
