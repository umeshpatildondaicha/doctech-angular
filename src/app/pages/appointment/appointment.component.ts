import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { Appointment } from '../../interfaces/appointment.interface';
import { GridComponent } from '../../tools/grid/grid.component';
import { AppButtonComponent } from '../../tools/app-button/app-button.component';
import { IconComponent } from '../../tools/app-icon/icon.component';
import { CalendarComponent } from '../../tools/calendar/calendar.component';
import { AppointmentCreateComponent } from '../appointment-create/appointment-create.component';
import { ChipCellRendererComponent } from '../../tools/chip-cell-renderer/chip-cell-renderer.component';
import { Mode } from '../../types/mode.type';
import { AppointmentRescheduleComponent } from '../appointment-reschedule/appointment-reschedule.component';
import { AppointmentViewComponent } from '../appointment-view/appointment-view.component';
import { CustomEventsService } from '../../services/custom-events.service';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, GridComponent, AppButtonComponent, IconComponent, MatTabsModule, CalendarComponent],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.scss'
})
export class AppointmentComponent implements OnInit {
  selectedTabIndex = 0;

  // All appointments data
  allAppointments: Appointment[] = [];
  appointmentColumns: ColDef[] = [];
  appointmentGridOptions = {
    menuActions: [
      {
        title: 'View',
        icon: 'visibility',
        click: (param: any) => this.openViewDialog(param.data)
      },
      {
        title: 'Edit',
        icon: 'edit',
        click: (param: any) => this.openDialog('edit', param.data)
      },
      {
        title: 'Reschedule',
        icon: 'clock',
        click: (param: any) => this.openRescheduleDialog(param.data)
      },
      {
        title: 'Delete',
        icon: 'delete',
        click: (param: any) => this.deleteAppointment(param.data)
      }
    ]
  };

  // Pending appointments data
  pendingAppointments: Appointment[] = [];
  pendingColumns: ColDef[] = [];
  pendingGridOptions = {
    menuActions: [
      {
        title: 'View',
        icon: 'visibility',
        click: (param: any) => this.openViewDialog(param.data)
      },
      {
        title: 'Approve',
        icon: 'check_circle',
        click: (param: any) => this.approveAppointment(param.data)
      },
      {
        title: 'Reject',
        icon: 'cancel',
        click: (param: any) => this.rejectAppointment(param.data)
      }
    ]
  };

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private customEventsService: CustomEventsService
  ) {
    this.customEventsService.breadcrumbEvent.emit(
      {
        isAppend:false,
        breadcrum: [{
          title: 'Appointments',
          url: '/appointment'
        }]
      }
    );
  }

  ngOnInit() {
    this.initializeAppointmentGrid();
    this.initializePendingGrid();
    this.loadAppointmentData();
    this.loadPendingData();
  }

  onTabChange(index: number) {
    this.selectedTabIndex = index;
  }



  // All appointments methods
  initializeAppointmentGrid() {
    this.appointmentColumns = [
      {
        headerName: 'Status',
        field: 'status',
        width: 120,
        sortable: true,
        filter: true,
        cellRenderer: ChipCellRendererComponent
      },
      {
        headerName: 'Patient Name',
        field: 'patientName',
        width: 150,
        sortable: true,
        filter: true
      },
      {
        headerName: 'Doctor Name',
        field: 'doctorName',
        width: 150,
        sortable: true,
        filter: true
      },
      {
        headerName: 'Appointment Date',
        field: 'appointment_date_time',
        width: 150,
        sortable: true,
        filter: true,
        valueFormatter: (params: any) => {
          return new Date(params.value).toLocaleDateString();
        }
      },
      {
        headerName: 'Slot Time',
        field: 'slotTime',
        width: 120,
        sortable: true,
        filter: true
      },
      {
        headerName: 'Notes',
        field: 'notes',
        width: 200,
        sortable: true,
        filter: true
      }
    ];
  }

  loadAppointmentData() {
    this.allAppointments = [
      {
        appointment_id: 1,
        patient_id: 1,
        appointment_date_time: '2024-01-15T09:00:00',
        notes: 'Regular checkup appointment',
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
        appointment_date_time: '2024-01-15T10:00:00',
        notes: 'Follow-up consultation',
        created_at: '2024-01-11T11:00:00',
        updated_at: '2024-01-11T11:00:00',
        doctor_id: 2,
        slot_id: 2,
        status: 'COMPLETED',
        patientName: 'Jane Smith',
        doctorName: 'Dr. Sarah',
        slotTime: '10:00 AM'
      },
      {
        appointment_id: 3,
        patient_id: 3,
        appointment_date_time: '2024-01-15T11:00:00',
        notes: 'Emergency consultation',
        created_at: '2024-01-12T09:00:00',
        updated_at: '2024-01-12T09:00:00',
        doctor_id: 1,
        slot_id: 3,
        status: 'PENDING',
        patientName: 'Mike Johnson',
        doctorName: 'Dr. Chetan',
        slotTime: '11:00 AM'
      }
    ];
  }

  onAppointmentRowClick(event: any) {
    console.log('Appointment row clicked:', event.data);
  }

  openDialog(mode: Mode, data?: Appointment) {
    const dialogRef = this.dialog.open(AppointmentCreateComponent, {
      data: { mode, appointment: data },
      width: '60%',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Handle appointment creation/update
        this.loadAppointmentData();
      }
    });
  }

  openViewDialog(appointment: Appointment) {
    const dialogRef = this.dialog.open(AppointmentViewComponent, {
      data: { appointment },
      width: '50%',
      autoFocus: false
    });
  }

  openRescheduleDialog(appointment: Appointment) {
    const dialogRef = this.dialog.open(AppointmentRescheduleComponent, {
      data: { appointment },
      width: '50%',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Handle rescheduling
        this.loadAppointmentData();
      }
    });
  }

  deleteAppointment(appointment: Appointment) {
    if (confirm(`Are you sure you want to delete appointment for ${appointment.patientName}?`)) {
      this.allAppointments = this.allAppointments.filter(item => item.appointment_id !== appointment.appointment_id);
    }
  }

  approveAppointment(appointment: Appointment) {
    // Handle appointment approval
    console.log('Approving appointment:', appointment);
  }

  rejectAppointment(appointment: Appointment) {
    // Handle appointment rejection
    console.log('Rejecting appointment:', appointment);
  }

  // Pending appointments methods
  initializePendingGrid() {
    this.pendingColumns = [
      {
        headerName: 'Status',
        field: 'status',
        width: 120,
        sortable: true,
        filter: true,
        cellRenderer: ChipCellRendererComponent
      },
      {
        headerName: 'Patient Name',
        field: 'patientName',
        width: 150,
        sortable: true,
        filter: true
      },
      {
        headerName: 'Doctor Name',
        field: 'doctorName',
        width: 150,
        sortable: true,
        filter: true
      },
      {
        headerName: 'Appointment Date',
        field: 'appointment_date_time',
        width: 150,
        sortable: true,
        filter: true,
        valueFormatter: (params: any) => {
          return new Date(params.value).toLocaleDateString();
        }
      },
      {
        headerName: 'Slot Time',
        field: 'slotTime',
        width: 120,
        sortable: true,
        filter: true
      },
      {
        headerName: 'Notes',
        field: 'notes',
        width: 200,
        sortable: true,
        filter: true
      }
    ];
  }

  loadPendingData() {
    this.pendingAppointments = this.allAppointments.filter(appointment => appointment.status === 'PENDING');
  }

  onPendingRowClick(event: any) {
    console.log('Pending appointment row clicked:', event.data);
  }



  // Add missing methods referenced in template
  createAppointment() {
    this.openDialog('create');
  }

  refreshPending() {
    console.log('Refreshing pending appointments');
    this.loadPendingData();
  }

  // Navigation method for My Schedule
  navigateToMySchedule() {
    this.router.navigate(['/my-schedule']);
  }
}
