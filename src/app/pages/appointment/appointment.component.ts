import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { ColDef } from 'ag-grid-community';
import { Appointment } from '../../interfaces/appointment.interface';
import { GridComponent } from '../../tools/grid/grid.component';
import { AppButtonComponent } from '../../tools/app-button/app-button.component';
import { IconComponent } from '../../tools/app-icon/icon.component';
import { CalendarComponent } from '../../tools/calendar/calendar.component';
import { AppointmentCreateComponent } from '../appointment-create/appointment-create.component';
import { TimingDialogComponent } from '../timing-dialog/timing-dialog.component';
import { ChipCellRendererComponent } from '../../tools/chip-cell-renderer/chip-cell-renderer.component';
import { Mode } from '../../types/mode.type';
import { AppointmentRescheduleComponent } from '../appointment-reschedule/appointment-reschedule.component';
import { CustomEventsService } from '../../services/custom-events.service';

interface TimingSlot {
  id: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
  dayOfWeek: string;
  appointmentDuration: number;
  breakTime: number;
  created_at: string;
}

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, GridComponent, AppButtonComponent, IconComponent, MatTabsModule, CalendarComponent],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.scss'
})
export class AppointmentComponent implements OnInit {
  selectedTabIndex = 0;
  
  // Timing slots data
  timingSlots: TimingSlot[] = [];
  timingColumns: ColDef[] = [];
  timingGridOptions = {
    menuActions: [
      {
        title: 'View',
        icon: 'visibility',
        click: (param: any) => this.onAddTiming('view', param.data)
      },
      {
        title: 'Edit',
        icon: 'edit',
        click: (param: any) => this.onAddTiming('edit', param.data)
      },
      {
        title: 'Delete',
        icon: 'delete',
        click: (param: any) => this.deleteTiming(param.data)
      }
    ]
  };

  // All appointments data
  allAppointments: Appointment[] = [];
  appointmentColumns: ColDef[] = [];
  appointmentGridOptions = {
    menuActions: [
      {
        title: 'View',
        icon: 'visibility',
        click: (param: any) => this.openDialog('view', param.data)
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
        click: (param: any) => this.openDialog('view', param.data)
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
    this.initializeTimingGrid();
    this.initializeAppointmentGrid();
    this.initializePendingGrid();
    this.loadTimingData();
    this.loadAppointmentData();
    this.loadPendingData();
  }

  onTabChange(index: number) {
    this.selectedTabIndex = index;
  }

  // Timing slots methods
  initializeTimingGrid() {
    this.timingColumns = [
      {
        headerName: 'Status',
        field: 'isActive',
        width: 100,
        sortable: true,
        filter: true,
        cellRenderer: ChipCellRendererComponent
      },
      {
        headerName: 'Day',
        field: 'dayOfWeek',
        width: 120,
        sortable: true,
        filter: true
      },
      {
        headerName: 'Start Time',
        field: 'startTime',
        width: 120,
        sortable: true,
        filter: true
      },
      {
        headerName: 'End Time',
        field: 'endTime',
        width: 120,
        sortable: true,
        filter: true
      },
      {
        headerName: 'Appointment Duration',
        field: 'appointmentDuration',
        width: 200,
        sortable: true,
        filter: true
      },
      {
        headerName: 'Break Time',
        field: 'breakTime',
        width: 120,
        sortable: true,
        filter: true
      },
      {
        headerName: 'Created',
        field: 'created_at',
        width: 150,
        sortable: true,
        filter: true,
        valueFormatter: (params: any) => {
          return new Date(params.value).toLocaleDateString();
        }
      }
    ];
  }

  loadTimingData() {
    this.timingSlots = [
      {
        id: 1,
        dayOfWeek: 'Monday',
        startTime: '09:00 AM',
        endTime: '05:00 PM',
        isActive: true,
        appointmentDuration: 30,
        breakTime: 10,
        created_at: '2024-01-01T00:00:00'
      },
      {
        id: 2,
        dayOfWeek: 'Tuesday',
        startTime: '09:00 AM',
        endTime: '05:00 PM',
        isActive: true,
        appointmentDuration: 30,
        breakTime: 10,
        created_at: '2024-01-01T00:00:00'
      },
      {
        id: 3,
        dayOfWeek: 'Wednesday',
        startTime: '10:00 AM',
        endTime: '06:00 PM',
        isActive: false,
        appointmentDuration: 30,
        breakTime: 10,
        created_at: '2024-01-01T00:00:00'
      }
    ];
  }

  onTimingRowClick(event: any) {
    console.log('Timing row clicked:', event.data);
  }

  onAddTiming(mode: Mode, data?: TimingSlot) {
    const dialogRef = this.dialog.open(TimingDialogComponent, {
      data: { mode, data },
      width: '60%',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Add new timing slot
        const newTiming = {
          ...result,
          id: this.timingSlots.length + 1,
          dayOfWeek: this.getDayFromTiming(result),
          startTime: this.formatTime(result.startTime),
          endTime: this.formatTime(result.endTime),
          isActive: true,
          created_at: new Date().toISOString()
        };
        this.timingSlots = [...this.timingSlots, newTiming];
      }
    });
  }

  private getDayFromTiming(timing: any): string {
    if (timing.timeFor === 'specific_day' && timing.selectedDate) {
      return new Date(timing.selectedDate).toLocaleDateString('en-US', { weekday: 'long' });
    } else if (timing.timeFor === 'weekly' && timing.selectedDays && timing.selectedDays.length > 0) {
      return timing.selectedDays.map((day: string) => 
        day.charAt(0).toUpperCase() + day.slice(1)
      ).join(', ');
    }
    return 'Daily';
  }

  private formatTime(time: string): string {
    if (!time) return '';
    
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  editTiming(timing: TimingSlot) {
    console.log('Edit timing:', timing);
    // TODO: Implement edit timing dialog
  }

  deleteTiming(timing: TimingSlot) {
    if (confirm(`Are you sure you want to delete timing slot for ${timing.dayOfWeek}?`)) {
      this.timingSlots = this.timingSlots.filter(item => item.id !== timing.id);
    }
  }

  // All appointments methods
  initializeAppointmentGrid() {
    this.appointmentColumns = [
      {
        headerName: 'Status',
        field: 'status',
        width: 140,
        sortable: true,
        filter: true,
        cellRenderer: ChipCellRendererComponent
      },
      {
        headerName: 'Patient',
        field: 'patientName',
        width: 150,
        sortable: true,
        filter: true
      },
      {
        headerName: 'Doctor',
        field: 'doctorName',
        width: 150,
        sortable: true,
        filter: true
      },
      {
        headerName: 'Date & Time',
        field: 'appointment_date_time',
        width: 180,
        sortable: true,
        filter: true,
        valueFormatter: (params: any) => {
          return new Date(params.value).toLocaleString();
        }
      },
      {
        headerName: 'Notes',
        field: 'notes',
        width: 200,
        sortable: true,
        filter: true,
        cellRenderer: (params: any) => {
          return params.value ? params.value.substring(0, 50) + (params.value.length > 50 ? '...' : '') : '';
        }
      },
      {
        headerName: 'Created',
        field: 'created_at',
        width: 150,
        sortable: true,
        filter: true,
        valueFormatter: (params: any) => {
          return new Date(params.value).toLocaleDateString();
        }
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
        appointment_date_time: '2024-01-16T10:00:00',
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
        appointment_date_time: '2024-01-17T11:00:00',
        notes: 'Emergency consultation',
        created_at: '2024-01-12T09:00:00',
        updated_at: '2024-01-12T09:00:00',
        doctor_id: 1,
        slot_id: 3,
        status: 'CANCELED',
        patientName: 'Mike Johnson',
        doctorName: 'Dr. Chetan',
        slotTime: '11:00 AM'
      }
    ];
  }

  onAppointmentRowClick(event: any) {
    console.log('Appointment row clicked:', event.data);
  }

  // Pending appointments methods
  initializePendingGrid() {
    this.pendingColumns = [
      {
        headerName: 'Patient',
        field: 'patientName',
        width: 150,
        sortable: true,
        filter: true
      },
      {
        headerName: 'Doctor',
        field: 'doctorName',
        width: 150,
        sortable: true,
        filter: true
      },
      {
        headerName: 'Requested Date',
        field: 'appointment_date_time',
        width: 180,
        sortable: true,
        filter: true,
        valueFormatter: (params: any) => {
          return new Date(params.value).toLocaleString();
        }
      },
      {
        headerName: 'Reason',
        field: 'notes',
        width: 200,
        sortable: true,
        filter: true,
        cellRenderer: (params: any) => {
          return params.value ? params.value.substring(0, 50) + (params.value.length > 50 ? '...' : '') : '';
        }
      },
      {
        headerName: 'Requested On',
        field: 'created_at',
        width: 150,
        sortable: true,
        filter: true,
        valueFormatter: (params: any) => {
          return new Date(params.value).toLocaleDateString();
        }
      }
    ];
  }

  loadPendingData() {
    this.pendingAppointments = [
      {
        appointment_id: 4,
        patient_id: 4,
        appointment_date_time: '2024-01-20T14:00:00',
        notes: 'New patient consultation request',
        created_at: '2024-01-13T15:00:00',
        updated_at: '2024-01-13T15:00:00',
        doctor_id: 1,
        slot_id: 4,
        status: 'PENDING',
        patientName: 'Alice Brown',
        doctorName: 'Dr. Chetan',
        slotTime: '02:00 PM'
      },
      {
        appointment_id: 5,
        patient_id: 5,
        appointment_date_time: '2024-01-21T16:00:00',
        notes: 'Follow-up appointment request',
        created_at: '2024-01-14T10:00:00',
        updated_at: '2024-01-14T10:00:00',
        doctor_id: 2,
        slot_id: 5,
        status: 'PENDING',
        patientName: 'Bob Wilson',
        doctorName: 'Dr. Sarah',
        slotTime: '04:00 PM'
      }
    ];
  }

  onPendingRowClick(event: any) {
    console.log('Pending appointment row clicked:', event.data);
  }

  refreshPending() {
    console.log('Refreshing pending appointments');
    this.loadPendingData();
  }

  approveAppointment(appointment: Appointment) {
    if (confirm(`Approve appointment for ${appointment.patientName}?`)) {
      // Move from pending to all appointments
      const approvedAppointment:any = { ...appointment, status: 'SCHEDULED' };
      this.allAppointments = [...this.allAppointments, approvedAppointment];
      this.pendingAppointments = this.pendingAppointments.filter(item => item.appointment_id !== appointment.appointment_id);
    }
  }

  rejectAppointment(appointment: Appointment) {
    if (confirm(`Reject appointment for ${appointment.patientName}?`)) {
      this.pendingAppointments = this.pendingAppointments.filter(item => item.appointment_id !== appointment.appointment_id);
    }
  }

  // Original methods
  openDialog(mode: Mode, appointment?: Appointment) {
    const dialogRef = this.dialog.open(AppointmentCreateComponent, {
      data: { mode, appointment },
      width: '80%',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && mode !== 'view') {
        if (mode === 'create') {
          // Add new appointment
          const newAppointment = {
            ...result,
            appointment_id: this.allAppointments.length + 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          this.allAppointments = [...this.allAppointments, newAppointment];
        } else if (mode === 'edit') {
          // Update existing appointment
          this.allAppointments = this.allAppointments.map(item => 
            item.appointment_id === appointment?.appointment_id 
              ? { ...item, ...result, updated_at: new Date().toISOString() }
              : item
          );
        }
      }
    });
  }
  openRescheduleDialog(appointment?: Appointment) {
    const dialogRef = this.dialog.open(AppointmentRescheduleComponent, {
      data: { appointment },
      width: '80%',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
          // Add new appointment
          const newAppointment = {
            ...result,
            appointment_id: this.allAppointments.length + 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          this.allAppointments = [...this.allAppointments, newAppointment];
      }
    });
  }

  createAppointment() {
    this.openDialog('create');
  }

  deleteAppointment(appointment: Appointment) {
    if (confirm(`Are you sure you want to delete appointment ${appointment.appointment_id}?`)) {
      this.allAppointments = this.allAppointments.filter(item => item.appointment_id !== appointment.appointment_id);
    }
  }
}
