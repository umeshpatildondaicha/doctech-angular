import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentDetailsComponent } from './appointment-details/appointment-details.component';
import { AppointmentEditComponent } from './appointment-edit/appointment-edit.component';
import { AppointmentCalendarComponent } from './appointment-calendar/appointment-calendar.component';

const routes: Routes = [
  { path: '', component: AppointmentCalendarComponent },
  { path: 'edit', component: AppointmentEditComponent },
  { path: ':id', component: AppointmentDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentsRoutingModule {}
