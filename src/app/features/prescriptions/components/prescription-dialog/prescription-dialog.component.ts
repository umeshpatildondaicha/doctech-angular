import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

interface DialogData {
  type: 'diagnosis' | 'medication' | 'visit';
  title: string;
  currentValue: any;
}

@Component({
  selector: 'app-prescription-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <form [formGroup]="dialogForm" (ngSubmit)="onSubmit()">
        <ng-container [ngSwitch]="data.type">
          
          <!-- Diagnosis Form -->
          <ng-container *ngSwitchCase="'diagnosis'">
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Diagnosis</mat-label>
              <input matInput formControlName="diagnosis" required>
              <mat-error *ngIf="dialogForm.get('diagnosis')?.invalid && dialogForm.get('diagnosis')?.touched">
                Diagnosis is required
              </mat-error>
            </mat-form-field>
            
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Symptoms (comma-separated)</mat-label>
              <textarea matInput formControlName="symptoms" required rows="3"></textarea>
              <mat-error *ngIf="dialogForm.get('symptoms')?.invalid && dialogForm.get('symptoms')?.touched">
                Symptoms are required
              </mat-error>
            </mat-form-field>
          </ng-container>

          <!-- Medication Form -->
          <ng-container *ngSwitchCase="'medication'">
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Medication Name</mat-label>
              <input matInput formControlName="name" required>
              <mat-error *ngIf="dialogForm.get('name')?.invalid && dialogForm.get('name')?.touched">
                Medication name is required
              </mat-error>
            </mat-form-field>

            <div class="two-columns">
              <mat-form-field appearance="fill">
                <mat-label>Dosage</mat-label>
                <input matInput formControlName="dosage" required placeholder="e.g., 10mg">
                <mat-error *ngIf="dialogForm.get('dosage')?.invalid && dialogForm.get('dosage')?.touched">
                  Dosage is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="fill">
                <mat-label>Frequency</mat-label>
                <mat-select formControlName="frequency" required>
                  <mat-option value="Once daily">Once daily</mat-option>
                  <mat-option value="Twice daily">Twice daily</mat-option>
                  <mat-option value="Three times daily">Three times daily</mat-option>
                  <mat-option value="Four times daily">Four times daily</mat-option>
                  <mat-option value="Every 8 hours">Every 8 hours</mat-option>
                  <mat-option value="Every 12 hours">Every 12 hours</mat-option>
                  <mat-option value="As needed">As needed</mat-option>
                </mat-select>
                <mat-error *ngIf="dialogForm.get('frequency')?.invalid && dialogForm.get('frequency')?.touched">
                  Frequency is required
                </mat-error>
              </mat-form-field>
            </div>

            <div class="two-columns">
              <mat-form-field appearance="fill">
                <mat-label>Duration</mat-label>
                <input matInput formControlName="duration" required placeholder="e.g., 30 days">
                <mat-error *ngIf="dialogForm.get('duration')?.invalid && dialogForm.get('duration')?.touched">
                  Duration is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="fill">
                <mat-label>Route</mat-label>
                <mat-select formControlName="route" required>
                  <mat-option value="Oral">Oral</mat-option>
                  <mat-option value="Topical">Topical</mat-option>
                  <mat-option value="Injection">Injection</mat-option>
                  <mat-option value="Inhalation">Inhalation</mat-option>
                  <mat-option value="Sublingual">Sublingual</mat-option>
                  <mat-option value="Rectal">Rectal</mat-option>
                </mat-select>
                <mat-error *ngIf="dialogForm.get('route')?.invalid && dialogForm.get('route')?.touched">
                  Route is required
                </mat-error>
              </mat-form-field>
            </div>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Timing</mat-label>
              <mat-select formControlName="timing" required>
                <mat-option value="Morning">Morning</mat-option>
                <mat-option value="Afternoon">Afternoon</mat-option>
                <mat-option value="Evening">Evening</mat-option>
                <mat-option value="Night">Night</mat-option>
                <mat-option value="Before meals">Before meals</mat-option>
                <mat-option value="After meals">After meals</mat-option>
                <mat-option value="With meals">With meals</mat-option>
                <mat-option value="As needed">As needed</mat-option>
              </mat-select>
              <mat-error *ngIf="dialogForm.get('timing')?.invalid && dialogForm.get('timing')?.touched">
                Timing is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Special Instructions</mat-label>
              <textarea matInput formControlName="instructions" rows="2" placeholder="Any special instructions for taking this medication"></textarea>
            </mat-form-field>

            <mat-checkbox formControlName="withFood">Take with food</mat-checkbox>
          </ng-container>

          <!-- Next Visit Form -->
          <ng-container *ngSwitchCase="'visit'">
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Next Visit Date</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="nextVisitDate" required>
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-error *ngIf="dialogForm.get('nextVisitDate')?.invalid && dialogForm.get('nextVisitDate')?.touched">
                Next visit date is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Follow-up Instructions</mat-label>
              <textarea matInput formControlName="instructions" rows="4" placeholder="Instructions for the patient to follow until next visit"></textarea>
            </mat-form-field>
          </ng-container>

        </ng-container>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!dialogForm.valid">
        Save
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      max-width: 500px;
    }
    .full-width {
      width: 100%;
    }
    .two-columns {
      display: flex;
      gap: 16px;
    }
    .two-columns > * {
      flex: 1;
    }
    mat-form-field {
      margin: 8px 0;
    }
    mat-checkbox {
      margin: 12px 0;
      display: block;
    }
    mat-error {
      font-size: 0.75rem;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCheckboxModule
  ]
})
export class PrescriptionDialogComponent {
  dialogForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PrescriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.dialogForm = this.createForm();
    if (data.currentValue) {
      this.dialogForm.patchValue(data.currentValue);
    }
  }

  private createForm(): FormGroup {
    switch (this.data.type) {
      case 'diagnosis':
        return this.fb.group({
          diagnosis: ['', Validators.required],
          symptoms: ['', Validators.required]
        });

      case 'medication':
        return this.fb.group({
          name: ['', Validators.required],
          dosage: ['', Validators.required],
          frequency: ['', Validators.required],
          duration: ['', Validators.required],
          route: ['Oral', Validators.required],
          timing: ['', Validators.required],
          instructions: [''],
          withFood: [false]
        });

      case 'visit':
        return this.fb.group({
          nextVisitDate: [new Date(), Validators.required],
          instructions: ['']
        });

      default:
        return this.fb.group({});
    }
  }

  onSubmit(): void {
    if (this.dialogForm.valid) {
      const formValue = this.dialogForm.value;
      console.log('Dialog form submitted with values:', formValue);
      
      // Format the data according to the dialog type
      let result: any;
      
      switch (this.data.type) {
        case 'diagnosis':
          result = {
            diagnosis: formValue.diagnosis,
            symptoms: formValue.symptoms
          };
          console.log('Formatted diagnosis result:', result);
          break;
          
        case 'medication':
          result = {
            name: formValue.name,
            dosage: formValue.dosage,
            frequency: formValue.frequency,
            duration: formValue.duration,
            route: formValue.route,
            timing: formValue.timing,
            instructions: formValue.instructions,
            withFood: formValue.withFood
          };
          console.log('Formatted medication result:', result);
          break;
          
        case 'visit':
          result = {
            date: formValue.nextVisitDate,
            instructions: formValue.instructions
          };
          console.log('Formatted visit result:', result);
          break;
          
        default:
          result = formValue;
      }
      
      this.dialogRef.close(result);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 