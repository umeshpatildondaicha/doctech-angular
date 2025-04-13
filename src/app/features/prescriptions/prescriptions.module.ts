import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PrescriptionsListComponent } from './components/prescription-list/prescription-list.component';
import { PrescriptionDialogComponent } from './components/prescription-dialog/prescription-dialog.component';
import { PrescriptionFormComponent } from './components/prescription-form/prescription-form.component';
import { PrescriptionService } from './services/prescription.service';
import { PrescriptionsRoutingModule } from './prescriptions-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    PrescriptionsRoutingModule,
    PrescriptionsListComponent,
    PrescriptionFormComponent,
    PrescriptionDialogComponent
  ],
  providers: [
    PrescriptionService
  ],
  exports: [
    PrescriptionsListComponent,
    PrescriptionFormComponent,
    PrescriptionDialogComponent
  ]
})
export class PrescriptionsModule { }
