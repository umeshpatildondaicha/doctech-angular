import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { Appointment } from '../../interfaces/appointment.interface';
import { GridComponent } from '../../tools/grid/grid.component';
import { AppButtonComponent } from '../../tools/app-button/app-button.component';
import { IconComponent } from '../../tools/app-icon/icon.component';
import { AppointmentCreateComponent } from '../appointment-create/appointment-create.component';
import { ChipCellRendererComponent } from '../../tools/chip-cell-renderer/chip-cell-renderer.component';
import { Mode } from '../../types/mode.type';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, GridComponent, AppButtonComponent, IconComponent],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.scss'
})
export class AppointmentComponent implements OnInit {
  columnDefs: ColDef[] = [];
  rowData: Appointment[] = [];
  gridOptions = {
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
        title: 'Delete',
        icon: 'delete',
        click: (param: any) => this.deleteAppointment(param.data)
      }
    ]
  };

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.initializeGrid();
    this.loadAppointmentData();
  }

  initializeGrid() {
    this.columnDefs = [
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
    // Mock data - in real app, this would come from a service
    this.rowData = [
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

  openDialog(mode: Mode, appointment?: Appointment) {
    const dialogRef = this.dialog.open(AppointmentCreateComponent, {
      data: { mode, appointment },
      width: '800px',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && mode !== 'view') {
        if (mode === 'create') {
          // Add new appointment
          const newAppointment = {
            ...result,
            appointment_id: this.rowData.length + 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          this.rowData = [...this.rowData, newAppointment];
        } else if (mode === 'edit') {
          // Update existing appointment
          this.rowData = this.rowData.map(item => 
            item.appointment_id === appointment?.appointment_id 
              ? { ...item, ...result, updated_at: new Date().toISOString() }
              : item
          );
        }
      }
    });
  }

  createAppointment() {
    this.openDialog('create');
  }

  deleteAppointment(appointment: Appointment) {
    if (confirm(`Are you sure you want to delete appointment ${appointment.appointment_id}?`)) {
      this.rowData = this.rowData.filter(item => item.appointment_id !== appointment.appointment_id);
    }
  }
}
