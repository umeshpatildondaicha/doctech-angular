import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Appointment } from '../../interfaces/appointment.interface';
import { AppInputComponent } from '../../tools/app-input/app-input.component';
import { AppButtonComponent } from '../../tools/app-button/app-button.component';
import { AppSelectboxComponent } from '../../tools/app-selectbox/app-selectbox.component';
import { IconComponent } from '../../tools/app-icon/icon.component';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Mode } from '../../types/mode.type';
import { DatePickerComponent } from '../../tools/date-picker/date-picker.component';
import { CalendarComponent, CalendarEvent } from "../../tools";
import { PatientSearchDialogComponent, PatientSearchResult } from '../patient-search-dialog/patient-search-dialog.component';

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
    DatePickerComponent,
    CalendarComponent
]
})
export class AppointmentCreateComponent {
  appointmentForm: FormGroup;
  mode: Mode = 'create';
  submitButtonText: string = 'Create Appointment';
  calendarEvents: CalendarEvent[] = [];
  selectedPatient: PatientSearchResult | null = null;
  
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

  // Mock existing appointments (filled slots)
  private readonly mockAppointments: Appointment[] = [
    {
      appointment_id: 1,
      patient_id: 1,
      appointment_date_time: new Date().toISOString().split('T')[0] + 'T09:00:00',
      notes: 'Regular checkup',
      created_at: '2024-01-10T10:00:00',
      updated_at: '2024-01-10T10:00:00',
      doctor_id: 1,
      slot_id: 1,
      status: 'SCHEDULED',
      patientName: 'John Doe',
      doctorName: 'Dr. Chetan',
      slotTime: '09:00 AM'
    },
    {
      appointment_id: 2,
      patient_id: 2,
      appointment_date_time: new Date().toISOString().split('T')[0] + 'T10:00:00',
      notes: 'Follow-up consultation',
      created_at: '2024-01-11T11:00:00',
      updated_at: '2024-01-11T11:00:00',
      doctor_id: 2,
      slot_id: 2,
      status: 'SCHEDULED',
      patientName: 'Jane Smith',
      doctorName: 'Dr. Sarah',
      slotTime: '10:00 AM'
    },
    {
      appointment_id: 3,
      patient_id: 3,
      appointment_date_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T14:00:00',
      notes: 'Initial consultation',
      created_at: '2024-01-12T09:00:00',
      updated_at: '2024-01-12T09:00:00',
      doctor_id: 1,
      slot_id: 4,
      status: 'SCHEDULED',
      patientName: 'Mike Johnson',
      doctorName: 'Dr. Chetan',
      slotTime: '02:00 PM'
    },
    {
      appointment_id: 4,
      patient_id: 1,
      appointment_date_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T11:00:00',
      notes: 'Lab results review',
      created_at: '2024-01-13T14:00:00',
      updated_at: '2024-01-13T14:00:00',
      doctor_id: 3,
      slot_id: 3,
      status: 'SCHEDULED',
      patientName: 'John Doe',
      doctorName: 'Dr. Michael',
      slotTime: '11:00 AM'
    }
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<AppointmentCreateComponent>,
    private readonly dialog: MatDialog,
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
    
    this.generateCalendarEvents();
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

  private generateCalendarEvents() {
    this.calendarEvents = [];
    
    // Add filled slots (existing appointments)
    this.mockAppointments.forEach(appointment => {
      const appointmentDate = new Date(appointment.appointment_date_time);
      const endTime = new Date(appointmentDate);
      endTime.setHours(endTime.getHours() + 1); // 1 hour duration
      
      this.calendarEvents.push({
        id: `appointment-${appointment.appointment_id}`,
        title: `${appointment.patientName} - ${appointment.doctorName}`,
        start: appointmentDate,
        end: endTime,
        description: appointment.notes,
        type: 'appointment',
        color: {
          primary: '#f44336', // Red for filled slots
          secondary: '#ffebee'
        },
        allDay: false
      });
    });

    // Generate available slots for the next 30 days
    this.generateAvailableSlots();
  }

  private generateAvailableSlots() {
    const today = new Date();
    const businessHours = {
      start: 9, // 9 AM
      end: 17   // 5 PM
    };
    
    // 1 hour slots
    const workingDays = [1, 2, 3, 4, 5]; // Monday to Friday (0 = Sunday, 1 = Monday, etc.)

    for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + dayOffset);
      
      // Skip weekends
      if (!workingDays.includes(currentDate.getDay())) {
        continue;
      }

      // Generate slots for each hour
      for (let hour = businessHours.start; hour < businessHours.end; hour++) {
        const slotStart = new Date(currentDate);
        slotStart.setHours(hour, 0, 0, 0);
        
        const slotEnd = new Date(slotStart);
        slotEnd.setHours(hour + 1, 0, 0, 0);

        // Check if this slot is already booked
        const isBooked = this.mockAppointments.some(appointment => {
          const appointmentDate = new Date(appointment.appointment_date_time);
          return appointmentDate.getTime() === slotStart.getTime();
        });

        if (!isBooked) {
          this.calendarEvents.push({
            id: `available-${currentDate.getTime()}-${hour}`,
            title: `Available - ${hour}:00`,
            start: slotStart,
            end: slotEnd,
            description: 'Available appointment slot',
            type: 'available',
            color: {
              primary: '#4caf50', // Green for available slots
              secondary: '#e8f5e8'
            },
            allDay: false
          });
        }
      }
    }
  }

  onDateSelected(date: Date) {
    // Update the appointment date when a date is selected
    const formattedDate = date.toISOString().split('T')[0];
    this.appointmentForm.patchValue({
      appointment_date_time: formattedDate
    });
  }

  onEventClicked(event: CalendarEvent) {
    if (event.type === 'available') {
      // When an available slot is clicked, set the appointment time
      const selectedDate = new Date(event.start);
      
      this.appointmentForm.patchValue({
        appointment_date_time: selectedDate.toISOString()
      });
    }
  }

  onSubmit() {
    if (this.isViewMode) {
      this.dialogRef.close();
      return;
    }
    
    // Check if patient is selected
    if (!this.selectedPatient) {
      // Mark the patient field as invalid
      this.appointmentForm.get('patient_id')?.setErrors({ 'required': true });
      this.appointmentForm.get('patient_id')?.markAsTouched();
      return;
    }
    
    if (this.appointmentForm.valid) {
      this.dialogRef.close(this.appointmentForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  openPatientSearch(): void {
    const patientSearchDialogRef = this.dialog.open(PatientSearchDialogComponent, {
      width: '90%',
      maxWidth: '1000px',
      height: '90%',
      maxHeight: '90vh',
      autoFocus: false,
      disableClose: false
    });

    patientSearchDialogRef.afterClosed().subscribe((result) => {
      if (result && result.action === 'select') {
        this.selectedPatient = result.patient;
        this.appointmentForm.patchValue({
          patient_id: result.patient.id
        });
      }
    });
  }

  calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  onPatientInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.openPatientSearch();
    }
  }

  onPatientInput(event: Event): void {
    // Prevent typing in the input field - it should only be used for selection
    event.preventDefault();
    event.stopPropagation();
  }

  getPatientErrorMessage(): string {
    const patientControl = this.appointmentForm.get('patient_id');
    if (patientControl?.hasError('required') && patientControl?.touched) {
      return 'Please select a patient to create an appointment';
    }
    return '';
  }
} 