// app.routes.ts
import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component'; // Import your DashboardComponent
import { AppointmentCalendarComponent } from './appointments/appointment-calendar/appointment-calendar.component';
import { PatientProfileComponent } from './patient-profile/patient-profile.component';
import { PrintPrescriptionComponent } from './print-prescription/print-prescription.component'
import { PatientsComponent } from './patients/patients.component';
import { DoctorsComponent } from './doctors/doctors.component';
import { SettingsComponent } from './settings/settings.component';
import { HelpComponent } from './help/help.component';
import { TableViewComponent } from './shared/components/table-view/table-view.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile/:id', component: PatientProfileComponent },
  {
    path: 'appointments',
    loadChildren: () => import('./appointments/appointments.module').then(m => m.AppointmentsModule)
  },
  {
    path: 'calendar',
    loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule)
  },
  { path: 'print-prescription', component: PrintPrescriptionComponent },
  { path: 'patients', component: TableViewComponent },
  { path: 'doctors', component: DoctorsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'help', component: HelpComponent },
  { path: '**', redirectTo: '/dashboard' }
];
