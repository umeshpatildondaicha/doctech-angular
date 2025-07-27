import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AppointmentComponent } from './pages/appointment/appointment.component';
import { DoctorComponent } from './pages/doctor/doctor.component';
import { PatientComponent } from './pages/patient/patient.component';
import { BillingComponent } from './pages/billing/billing.component';
import { HelpComponent } from './pages/help/help.component';
import { PatientListComponent } from './components/patient-list/patient-list.component';
import { PatientFormComponent } from './components/patient-form/patient-form.component';
import { ExerciseComponent } from './pages/exercise/exercise.component';
import { DietComponent } from './pages/diet/diet.component';
import { ProfileComponent } from './layout/profile/profile.component';
import { SettingsComponent } from './layout/settings/settings.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'appointment', component: AppointmentComponent },
  { path: 'doctor', component: DoctorComponent },
  { path: 'patient', component: PatientComponent },
  { path: 'exercises', component: ExerciseComponent },
  { path: 'diet', component: DietComponent },
  { path: 'billing', component: BillingComponent },
  { path: 'help', component: HelpComponent },
  { path: 'patients', component: PatientListComponent },
  { path: 'add-patient', component: PatientFormComponent },
  { path: 'edit-patient/:id', component: PatientFormComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'settings', component: SettingsComponent }
];
