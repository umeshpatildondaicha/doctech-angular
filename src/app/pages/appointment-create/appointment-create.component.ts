import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Appointment } from '../../interfaces/appointment.interface';
import { AppInputComponent } from '../../tools/app-input/app-input.component';
import { AppButtonComponent } from '../../tools/app-button/app-button.component';
import { AppSelectboxComponent } from '../../tools/app-selectbox/app-selectbox.component';
import { IconComponent } from '../../tools/app-icon/icon.component';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Mode } from '../../types/mode.type';
import { DatePickerComponent } from '../../tools/date-picker/date-picker.component';

@Component({
  selector: 'app-appointment-create',
  templateUrl: './appointment-create.component.html',
  styleUrl: './appointment-create.component.scss',
  standalone: true,
  imports: [
    AppInputComponent, 
    AppButtonComponent, 
    AppSelectboxComponent,
    IconComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    DatePickerComponent
  ]
})
export class AppointmentCreateComponent {
  appointmentForm: FormGroup;
  mode: Mode = 'create';
  submitButtonText: string = 'Create Appointment';
  statusOptions = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'canceled', label: 'Canceled' },
    { value: 'completed', label: 'Completed' }
  ];

  // Mock data for dropdowns - in real app, these would come from services
  patientOptions = [
    { value: 1, label: 'John Doe' },
    { value: 2, label: 'Jane Smith' },
    { value: 3, label: 'Mike Johnson' }
  ];

  doctorOptions = [
    { value: 1, label: 'Dr. Chetan' },
    { value: 2, label: 'Dr. Sarah' },
    { value: 3, label: 'Dr. Michael' }
  ];

  slotOptions = [
    { value: 1, label: '09:00 AM' },
    { value: 2, label: '10:00 AM' },
    { value: 3, label: '11:00 AM' },
    { value: 4, label: '02:00 PM' },
    { value: 5, label: '03:00 PM' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AppointmentCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: Mode, appointment?: Appointment }
  ) {
    this.mode = data?.mode || 'create';
    this.submitButtonText = this.getSubmitButtonText();
    this.appointmentForm = this.fb.group({
      patient_id: [data?.appointment?.patient_id || '', Validators.required],
      appointment_date_time: [data?.appointment?.appointment_date_time || '', Validators.required],
      notes: [data?.appointment?.notes || ''],
      doctor_id: [data?.appointment?.doctor_id || '', Validators.required],
      slot_id: [data?.appointment?.slot_id || '', Validators.required],
      status: [data?.appointment?.status || 'scheduled', Validators.required]
    });
    if (this.isViewMode) {
      this.appointmentForm.disable();
    }
  }

  get isViewMode() {
    return this.mode === 'view';
  }

  getSubmitButtonText(): string {
    switch (this.mode) {
      case 'create': return 'Create Appointment';
      case 'edit': return 'Update Appointment';
      case 'view': return 'Close';
      default: return 'Submit';
    }
  }

  onSubmit() {
    if (this.isViewMode) {
      this.dialogRef.close();
      return;
    }
    if (this.appointmentForm.valid) {
      this.dialogRef.close(this.appointmentForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
} 