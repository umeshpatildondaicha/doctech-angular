import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { ColDef } from 'ag-grid-community';

import { GridComponent } from '../../../tools/grid/grid.component';
import { IconComponent } from '../../../tools/app-icon/icon.component';
import { StatusCellRendererComponent } from '../../../tools/status-cell-renderer/status-cell-renderer.component';
import { 
  AdminPageHeaderComponent, 
  AdminStatsCardComponent, 
  AdminActionBarComponent,
  type HeaderAction,
  type StatCard,
  type ActionButton
} from '../../../components';



interface Doctor {
  id: string;
  name: string;
  profilePic: string;
  specialization: string;
  hospital: string;
  availability: 'Available' | 'On Leave' | 'Emergency Only' | 'Inactive';
  status: 'Active' | 'Inactive' | 'On Leave';
  phone: string;
  email: string;
  experience: string;
  qualifications: string;
  joinedDate: string;
  lastLogin?: string;
  hasUserAccount: boolean;
  tags: string[];
}

interface DoctorStats {
  total: number;
  active: number;
  onLeave: number;
  inactive: number;
  specializations: { [key: string]: number };
}

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    GridComponent,
    IconComponent,
    AdminPageHeaderComponent,
    AdminStatsCardComponent,
    AdminActionBarComponent
  ],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.scss'
})
export class DoctorsComponent implements OnInit {
  // Grid configuration
  columnDefs: ColDef[] = [];
  gridOptions: any = {};
  rowData: any[] = [];

  // Page header configuration
  headerActions: HeaderAction[] = [
    {
      text: 'Add New Doctor',
      color: 'primary',
      fontIcon: 'person_add',
      action: 'add-doctor'
    },
    {
      text: 'Export All',
      color: 'accent',
      fontIcon: 'download',
      action: 'export'
    }
  ];

  // Action bar configuration
  quickActions: ActionButton[] = [
    {
      id: 'link-existing',
      text: 'Link Existing Doctor',
      icon: 'link',
      color: 'accent'
    },
    {
      id: 'bulk-upload',
      text: 'Bulk Upload',
      icon: 'upload_file',
      color: 'accent'
    }
  ];

  // Stats configuration
  statsCards: StatCard[] = [];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.initializeGrid();
    this.loadDoctorData();
    this.updateStatsCards();
  }

  initializeGrid() {
    this.columnDefs = [
      {
        headerName: 'Doctor ID',
        field: 'id',
        width: 120,
        sortable: true,
        filter: true
      },
      {
        headerName: 'Name',
        field: 'name',
        width: 200,
        sortable: true,
        filter: true
      },
      {
        headerName: 'Specialization',
        field: 'specialization',
        width: 150,
        sortable: true,
        filter: true
      },
      {
        headerName: 'Hospital',
        field: 'hospital',
        width: 150,
        sortable: true,
        filter: true
      },
      {
        headerName: 'Availability',
        field: 'availability',
        width: 140,
        sortable: true,
        filter: true,
        cellRenderer: StatusCellRendererComponent
      },
      {
        headerName: 'Status',
        field: 'status',
        width: 120,
        sortable: true,
        filter: true,
        cellRenderer: StatusCellRendererComponent
      },
      {
        headerName: 'Phone',
        field: 'phone',
        width: 150,
        sortable: true,
        filter: true
      },
      {
        headerName: 'Email',
        field: 'email',
        width: 200,
        sortable: true,
        filter: true
      },
      {
        headerName: 'Experience',
        field: 'experience',
        width: 120,
        sortable: true,
        filter: true
      },
      {
        headerName: 'Joined Date',
        field: 'joinedDate',
        width: 120,
        sortable: true,
        filter: true,
        valueFormatter: (params: any) => {
          return new Date(params.value).toLocaleDateString();
        }
      }
    ];

    this.gridOptions = {
      menuActions: [
        {
          title: 'View',
          icon: 'visibility',
          click: (param: any) => { this.viewDoctor(param.data); }
        },
        {
          title: 'Edit',
          icon: 'edit',
          click: (param: any) => { this.editDoctor(param.data); }
        },
        {
          title: 'Schedule',
          icon: 'schedule',
          click: (param: any) => { this.scheduleDoctor(param.data); }
        },
        {
          title: 'Delete',
          icon: 'delete',
          click: (param: any) => { this.deleteDoctor(param.data); }
        }
      ]
    };
  }

  loadDoctorData() {
    // Sample data
    this.rowData = [
      {
        id: 'DOC001',
        name: 'Dr. Amit Sharma',
        specialization: 'Cardiology',
        hospital: 'Main Hospital',
        availability: 'Available',
        status: 'Active',
        phone: '+91 98765 43210',
        email: 'amit.sharma@hospital.com',
        experience: '8 years',
        joinedDate: '2020-03-15'
      },
      {
        id: 'DOC002',
        name: 'Dr. Priya Verma',
        specialization: 'Neurology',
        hospital: 'City Branch',
        availability: 'On Leave',
        status: 'On Leave',
        phone: '+91 98765 43211',
        email: 'priya.verma@hospital.com',
        experience: '12 years',
        joinedDate: '2018-07-22'
      },
      {
        id: 'DOC003',
        name: 'Dr. Rajesh Kumar',
        specialization: 'Orthopedics',
        hospital: 'Main Hospital',
        availability: 'Emergency Only',
        status: 'Active',
        phone: '+91 98765 43212',
        email: 'rajesh.kumar@hospital.com',
        experience: '15 years',
        joinedDate: '2015-11-08'
      },
      {
        id: 'DOC004',
        name: 'Dr. Sneha Patel',
        specialization: 'Pediatrics',
        hospital: 'City Branch',
        availability: 'Available',
        status: 'Active',
        phone: '+91 98765 43213',
        email: 'sneha.patel@hospital.com',
        experience: '6 years',
        joinedDate: '2021-09-12'
      },
      {
        id: 'DOC005',
        name: 'Dr. Vikram Singh',
        specialization: 'Dermatology',
        hospital: 'Main Hospital',
        availability: 'Available',
        status: 'Inactive',
        phone: '+91 98765 43214',
        email: 'vikram.singh@hospital.com',
        experience: '10 years',
        joinedDate: '2019-05-20'
      }
    ];
  }

  // Action methods
  addNewDoctor() {
    this.showSnackBar('Add New Doctor functionality will be implemented');
  }

  viewDoctor(doctor: any) {
    this.showSnackBar(`View doctor: ${doctor.name}`);
  }

  editDoctor(doctor: any) {
    this.showSnackBar(`Edit doctor: ${doctor.name}`);
  }

  scheduleDoctor(doctor: any) {
    this.showSnackBar(`Schedule doctor: ${doctor.name}`);
  }

  deleteDoctor(doctor: any) {
    if (confirm(`Are you sure you want to delete ${doctor.name}?`)) {
      this.rowData = this.rowData.filter(d => d.id !== doctor.id);
      this.showSnackBar(`Doctor ${doctor.name} deleted successfully`);
    }
  }

  getUniqueSpecializations(): number {
    const specializations = new Set(this.rowData.map(d => d.specialization));
    return specializations.size;
  }

  getActiveDoctorsCount(): number {
    return this.rowData.filter(d => d.status === 'Active').length;
  }

  getOnLeaveDoctorsCount(): number {
    return this.rowData.filter(d => d.status === 'On Leave').length;
  }

  updateStatsCards() {
    this.statsCards = [
      {
        label: 'Total Doctors',
        value: this.rowData.length,
        icon: 'local_hospital',
        type: 'info',
        valueColor: 'var(--admin-text-primary)'
      },
      {
        label: 'Active Today',
        value: this.getActiveDoctorsCount(),
        icon: 'check_circle',
        type: 'success',
        valueColor: 'var(--admin-text-primary)'
      },
      {
        label: 'On Leave',
        value: this.getOnLeaveDoctorsCount(),
        icon: 'pause_circle',
        type: 'warning',
        valueColor: 'var(--admin-text-primary)'
      },
      {
        label: 'Specializations',
        value: this.getUniqueSpecializations(),
        icon: 'category',
        type: 'info',
        valueColor: 'var(--admin-text-primary)'
      }
    ];
  }

  onHeaderAction(action: string) {
    switch (action) {
      case 'add-doctor':
        this.addNewDoctor();
        break;
      case 'export':
        this.exportData();
        break;
    }
  }

  onQuickAction(actionId: string) {
    switch (actionId) {
      case 'link-existing':
        this.showSnackBar('Link Existing Doctor functionality will be implemented');
        break;
      case 'bulk-upload':
        this.showSnackBar('Bulk Upload functionality will be implemented');
        break;
    }
  }

  exportData() {
    this.showSnackBar('Export functionality will be implemented');
  }

  private showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
} 