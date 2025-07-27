import { Component } from '@angular/core';
import { GridComponent } from '../../tools/grid/grid.component';
import { Doctor } from '../../interfaces/doctor.interface';
import { ColDef } from 'ag-grid-community';
import { IconComponent } from '../../tools/app-icon/icon.component';
import { MatDialog } from '@angular/material/dialog';
import { DoctorCreateComponent } from '../docter-create/doctor-create.component';
import { ChipCellRendererComponent } from '../../tools/chip-cell-renderer/chip-cell-renderer.component';

@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [GridComponent, IconComponent],
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.scss'
})
export class DoctorComponent {
  doctorData: Doctor[] = [
    {
      doctorId: 1,
      firstName: 'Amit',
      lastName: 'Sharma',
      registrationNumber: 'REG123',
      hospitalId: 101,
      specialization: 'Cardiology',
      globalNumber: 'GLB001',
      persanalNumber: 'PRS001',
      email: 'amit.sharma@hospital.com',
      qualifications: 'MBBS, MD',
      profileImageUrl: '',
      doctorStatus: 'ACTIVE',
      createdAt: '2024-01-01',
      departmentId: 1,
      updatedAt: '2024-01-10',
      isDeleted: false
    },
    {
      doctorId: 2,
      firstName: 'Priya',
      lastName: 'Verma',
      registrationNumber: 'REG124',
      hospitalId: 102,
      specialization: 'Neurology',
      globalNumber: 'GLB002',
      persanalNumber: 'PRS002',
      email: 'priya.verma@hospital.com',
      qualifications: 'MBBS, DM',
      profileImageUrl: '',
      doctorStatus: 'INACTIVE',
      createdAt: '2024-01-02',
      departmentId: 2,
      updatedAt: '2024-01-11',
      isDeleted: false
    }
  ];

  columnDefs: ColDef[] = [
    { field: 'doctorStatus', headerName: 'Status', width: 120, sortable: true, filter: true, cellRenderer: ChipCellRendererComponent },
    { field: 'firstName', headerName: 'First Name', width: 120, sortable: true, filter: true },
    { field: 'lastName', headerName: 'Last Name', width: 120, sortable: true, filter: true },
    { field: 'registrationNumber', headerName: 'Reg. No.', width: 120, sortable: true, filter: true },
    { field: 'specialization', headerName: 'Specialization', width: 140, sortable: true, filter: true },
    { field: 'globalNumber', headerName: 'Global No.', width: 120, sortable: true, filter: true },
    { field: 'persanalNumber', headerName: 'Personal No.', width: 120, sortable: true, filter: true },
    { field: 'email', headerName: 'Email', width: 180, sortable: true, filter: true },
    { field: 'qualifications', headerName: 'Qualifications', width: 150, sortable: true, filter: true },
    { field: 'createdAt', headerName: 'Created At', width: 120, sortable: true, filter: true },
    { field: 'updatedAt', headerName: 'Updated At', width: 120, sortable: true, filter: true }
  ];

  gridOptions: any = {};

  constructor(private dialog: MatDialog) {
    this.initializeGridOptions();
  }

  initializeGridOptions() {
    this.gridOptions = {
      menuActions: [
        {
          title: 'View',
          icon: 'remove_red_eye',
          click: (param: any) => { this.onViewDoctor(param); }
        },
        {
          title: 'Edit',
          icon: 'edit',
          click: (param: any) => { this.onEditDoctor(param); }
        },
        {
          title: 'Delete',
          icon: 'delete',
          click: (param: any) => { this.onDeleteDoctor(param); }
        }
      ]
    };
  }

  onViewDoctor(param: any) {
    this.openDoctorDialog('view', param?.data);
  }
  onEditDoctor(param: any) {
    this.openDoctorDialog('edit', param?.data);
  }
  onDeleteDoctor(param: any) {
    // Implement delete logic here
  }

  openDoctorDialog(mode: string = 'create', doctor?: Doctor) {
    const dialogRef = this.dialog.open(DoctorCreateComponent, {
      width: '500px',
      data: { mode, doctor }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (mode === 'edit' && doctor) {
          // Update existing doctor
          const idx = this.doctorData.findIndex(d => d.doctorId === doctor.doctorId);
          if (idx > -1) {
            this.doctorData[idx] = { ...this.doctorData[idx], ...result };
            this.doctorData = [...this.doctorData];
          }
        } else if (mode === 'create') {
          // Add new doctor
          const newId = Math.max(...this.doctorData.map(d => d.doctorId), 0) + 1;
          this.doctorData.push({ ...result, doctorId: newId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isDeleted: false });
          this.doctorData = [...this.doctorData];
        }
      }
    });
  }

  onCreateDoctor() {
    this.openDoctorDialog('create');
  }
}
