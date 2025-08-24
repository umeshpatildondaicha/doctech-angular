import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Appointment } from '../../interfaces/appointment.interface';
import { AppButtonComponent } from '../../tools/app-button/app-button.component';
import { IconComponent } from '../../tools/app-icon/icon.component';
import { ImageComponent } from '../../tools/image/image.component';

@Component({
  selector: 'app-appointment-view',
  standalone: true,
  imports: [CommonModule, AppButtonComponent, IconComponent, ImageComponent],
  templateUrl: './appointment-view.component.html',
  styleUrl: './appointment-view.component.scss'
})
export class AppointmentViewComponent implements OnInit {
  appointment: Appointment | undefined;
  patient: any;

  constructor(
    public dialogRef: MatDialogRef<AppointmentViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { appointment: Appointment }
  ) {
    this.appointment = data.appointment;
  }

  ngOnInit() {
    this.loadPatientData();
  }

  loadPatientData() {
    // Mock patient data - in real app, this would come from a service
    this.patient = {
      name: this.appointment?.patientName,
      age: 35,
      gender: 'Male',
      number: '+1 234 567 8900',
      email: 'patient@example.com',
      image: 'assets/default-avatar.png'
    };
  }

  getStatusIcon(): string {
    switch (this.appointment?.status) {
      case 'SCHEDULED':
        return 'schedule';
      case 'COMPLETED':
        return 'check_circle';
      case 'CANCELED':
        return 'cancel';
      case 'PENDING':
        return 'pending';
      default:
        return 'event';
    }
  }

  formatDateTime(dateTime: string | undefined): string {
    if (!dateTime) return 'N/A';
    return new Date(dateTime).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  onReschedule() {
    this.dialogRef.close({ action: 'reschedule', appointment: this.appointment });
  }

  onEdit() {
    this.dialogRef.close({ action: 'edit', appointment: this.appointment });
  }

  onCancelAppointment() {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.dialogRef.close({ action: 'cancel', appointment: this.appointment });
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
