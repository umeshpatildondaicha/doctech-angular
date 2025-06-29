// app.routes.ts
import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppointmentDashboardComponent } from './appointments/appointment-dashboard/appointment-dashboard.component';
import { SlotManagementComponent } from './appointments/slot-management/slot-management.component';
import { PatientProfileComponent } from './patient-profile/patient-profile.component';
import { PrintPrescriptionComponent } from './print-prescription/print-prescription.component';
import { PatientsComponent } from './patients/patients.component';
import { DoctorsComponent } from './doctors/doctors.component';
import { SettingsComponent } from './settings/settings.component';
import { HelpComponent } from './help/help.component';
import { TableViewComponent } from './shared/components/table-view/table-view.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { 
    path: 'appointments', 
    component: AppointmentDashboardComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: TableViewComponent },
      { path: 'slots', component: SlotManagementComponent },
      { path: 'calendar', loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule) }
    ]
  },
  { path: 'profile/:id', component: PatientProfileComponent },
  { path: 'print-prescription', component: PrintPrescriptionComponent },
  { path: 'patients', component: TableViewComponent },
  { path: 'doctors', component: DoctorsComponent },
  { path: 'exercise', loadChildren: () => import('./exercise/exercise.module').then(m => m.ExerciseModule) },
  { path: 'settings', component: SettingsComponent },
  { path: 'help', component: HelpComponent },
  { path: '**', redirectTo: '/dashboard' }
];
