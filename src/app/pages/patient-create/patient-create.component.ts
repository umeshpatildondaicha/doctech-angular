import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppButtonComponent } from '../../tools/app-button/app-button.component';
import { AppInputComponent } from '../../tools/app-input/app-input.component';
import { AppSelectboxComponent } from '../../tools/app-selectbox/app-selectbox.component';
import { IconComponent } from '../../tools/app-icon/icon.component';
import { Patient } from '../../interfaces/patient.interface';

export type DialogMode = 'create' | 'edit' | 'view';

export interface DialogData {
  patient?: Patient;
  mode: DialogMode;
}

@Component({
  selector: 'app-patient-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    AppButtonComponent,
    AppInputComponent,
    AppSelectboxComponent,
    IconComponent
  ],
  templateUrl: './patient-create.component.html',
  styleUrl: './patient-create.component.scss'
})
export class PatientCreateComponent {
  patientForm: FormGroup;
  mode: DialogMode = 'create';
  submitButtonText:string='Create Patient';

  bloodGroups = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' }
  ];

  genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PatientCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.mode = data?.mode || 'create';
    this.submitButtonText = this.getsubmitButtonText();
    
    this.patientForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      contact: ['', [Validators.required, Validators.minLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      bloodGroup: ['', Validators.required]
    });

    // If editing or viewing existing patient, populate form
    if (data?.patient) {
      this.patientForm.patchValue({
        firstName: data.patient.firstName,
        lastName: data.patient.lastName,
        dateOfBirth: data.patient.dateOfBirth,
        gender: data.patient.gender,
        contact: data.patient.contact,
        email: data.patient.email,
        address: data.patient.address,
        bloodGroup: data.patient.bloodGroup
      });

      // Disable form in view mode
      if (this.mode === 'view') {
        this.patientForm.disable();
      }
    }
  }

  onSubmit() {
    if (this.patientForm.valid && this.mode !== 'view') {
      const patientForm: Partial<Patient> = {
        ...this.patientForm.value,
        patientId: this.data?.patient?.patientId || this.generatePatientId(),
        firstName: this.data?.patient?.firstName || this.patientForm.value.firstName,
        lastName: this.data?.patient?.lastName || this.patientForm.value.lastName,
        dateOfBirth: this.data?.patient?.dateOfBirth || this.patientForm.value.dateOfBirth,
        gender: this.data?.patient?.gender || this.patientForm.value.gender,
        contact: this.data?.patient?.contact || this.patientForm.value.contact,
        email: this.data?.patient?.email || this.patientForm.value.email,
        address: this.data?.patient?.address || this.patientForm.value.address,
        bloodGroup: this.data?.patient?.bloodGroup || this.patientForm.value.bloodGroup,
        createdDate: this.data?.patient?.createdDate || new Date(),
        updatedDate: new Date()
      };

      this.dialogRef.close(patientForm);
    } else if (this.mode === 'view') {
      this.dialogRef.close();
    } else {
      this.markFormGroupTouched();
    }
  }

  generatePatientId(): string {
    return 'D' + Date.now().toString().slice(-6);
  }

  onCancel() {
    this.dialogRef.close();
  }

  onEdit() {
    // Enable form for editing
    this.mode = 'edit';
    this.patientForm.enable();
  }

  private markFormGroupTouched() {
    Object.keys(this.patientForm.controls).forEach(key => {
      const control = this.patientForm.get(key);
      control?.markAsTouched();
    });
  }

  get isEditMode(): boolean {
    return this.mode === 'edit';
  }

  get isViewMode(): boolean {
    return this.mode === 'view';
  }

  get isCreateMode(): boolean {
    return this.mode === 'create';
  }

  get dialogTitle(): string {
    switch (this.mode) {
      case 'create':
        return 'Create New Patient';
      case 'edit':
        return 'Edit Patient';
      case 'view':
        return 'View Patient';
      default:
        return 'Patient';
    }
  }

  getsubmitButtonText(): string {
    switch (this.mode) {
      case 'create':
        return 'Create Patient';
      case 'edit':
        return 'Update Patient';
      case 'view':
        return 'Close';
      default:
        return 'Save';
    }
  }

  get showEditButton(): boolean {
    return this.mode === 'edit';
  }

  getErrorMessage(fieldName: string): string {
    const control = this.patientForm.get(fieldName);
    if (control?.invalid && control?.touched) {
      switch (fieldName) {
        case 'firstName':
          return 'First name is required and must be at least 3 characters';
        case 'lastName':
          return 'Last name is required and must be at least 3 characters';
        case 'dateOfBirth':
          return 'Date of birth is required';
        case 'gender':
          return 'Gender is required';
        case 'contact':
          return 'Contact is required';
        case 'email':
          return 'Email is required';
        case 'address':
          return 'Address is required';
        case 'bloodGroup':
          return 'Blood group is required';
        default:
          return 'This field is required';
      }
    }
    return '';
  }
}
