import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppointmentDialogComponent } from '../appointment-dialog/appointment-dialog.component';
import { CalendarComponent } from './calendar.component';

const routes: Routes = [{ path: '', component: CalendarComponent }];

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    DragDropModule,
    AppointmentDialogComponent,
    RouterModule.forChild(routes),
    CalendarComponent
  ]
})
export class CalendarModule {}
