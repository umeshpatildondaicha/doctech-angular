import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { PrescriptionFormComponent } from '../../features/prescriptions/components/prescription-form/prescription-form.component';
import { Prescription } from '../../features/prescriptions/models/prescription.model';

@Component({
  selector: 'app-prescription-dialog',
  standalone: true,
  imports: [CommonModule, PrescriptionFormComponent, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Edit Prescription</h2>
    <div mat-dialog-content>
      <app-prescription-form
        [prescription]="data.prescription"
        (prescriptionSaved)="onPrescriptionSaved($event)">
      </app-prescription-form>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
    </div>
  `,
  styles: [`
    mat-dialog-content {
      min-height: 400px;
      max-height: 80vh;
      overflow-y: auto;
    }
  `]
})
export class PrescriptionDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<PrescriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { prescription: Prescription }
  ) { }

  onPrescriptionSaved(prescription: Prescription): void {
    this.dialogRef.close(prescription);
  }
} 