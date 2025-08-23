import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Appointment } from '../../interfaces/appointment.interface';
import { AppInputComponent } from '../../tools/app-input/app-input.component';
import { AppButtonComponent } from '../../tools/app-button/app-button.component';
import { IconComponent } from '../../tools/app-icon/icon.component';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CalendarComponent, ImageComponent } from "../../tools";

@Component({
  selector: 'app-appointment-reschedule',
  templateUrl: './appointment-reschedule.component.html',
  styleUrl: './appointment-reschedule.component.scss',
  standalone: true,
  imports: [
    AppInputComponent,
    AppButtonComponent,
    ImageComponent,
    IconComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    CalendarComponent
]
})
export class AppointmentRescheduleComponent {
  appointmentForm: FormGroup;
  submitButtonText: string = 'Reschedule Appointment';
  statusOptions = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'canceled', label: 'Canceled' },
    { value: 'completed', label: 'Completed' }
  ];

  patient: any = {
    name: 'John Doe',
    age: 25,
    gender: 'Male',
    address: '123 Main St, Anytown, USA',
    number: '9876543210',
    image: 'assets/user.svg'
  };
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
    private dialogRef: MatDialogRef<AppointmentRescheduleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {appointment?: Appointment }
  ) {
    this.appointmentForm = this.fb.group({
      patient_id: [data?.appointment?.patient_id || '', Validators.required],
      appointment_date_time: [data?.appointment?.appointment_date_time || '', Validators.required],
      notes: [data?.appointment?.notes || ''],
      doctor_id: [data?.appointment?.doctor_id || '', Validators.required],
      slot_id: [data?.appointment?.slot_id || '', Validators.required],
      status: [data?.appointment?.status || 'scheduled', Validators.required]
    });

  }


  onSubmit() {
      this.dialogRef.close();
      return;
    
  }

  onCancel() {
    this.dialogRef.close();
  }
} 