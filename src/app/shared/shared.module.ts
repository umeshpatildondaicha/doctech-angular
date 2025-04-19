import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { DragDropModule } from '@angular/cdk/drag-drop';

// Import our components
import { PatientInfoCardComponent } from './components/patient-info-card/patient-info-card.component';
import { IpdManagementComponent } from './components/ipd-management/ipd-management.component';
import { CareScheduleTimelineComponent } from './components/care-schedule-timeline/care-schedule-timeline.component';
import { PatientTimelineComponent } from './components/patient-timeline/patient-timeline.component';
import { MetricCardComponent } from './components/metric-card/metric-card.component';
import { ChartContainerComponent } from './components/chart-container/chart-container.component';
import { AppointmentListComponent } from './components/appointment-list/appointment-list.component';
import { TimeSlotComponent } from './components/time-slot/time-slot.component';
import { NavItemComponent } from './components/nav-item/nav-item.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    DragDropModule,
    
    // Import standalone components
    PatientInfoCardComponent,
    IpdManagementComponent,
    CareScheduleTimelineComponent,
    PatientTimelineComponent,
    MetricCardComponent,
    ChartContainerComponent,
    AppointmentListComponent,
    TimeSlotComponent,
    NavItemComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    DragDropModule,
    
    // Export our components
    PatientInfoCardComponent,
    IpdManagementComponent,
    CareScheduleTimelineComponent,
    PatientTimelineComponent,
    MetricCardComponent,
    ChartContainerComponent,
    AppointmentListComponent,
    TimeSlotComponent,
    NavItemComponent
  ]
})
export class SharedModule { } 