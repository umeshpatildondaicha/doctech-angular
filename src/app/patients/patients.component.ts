import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { DataGridComponent, RowAction } from '../shared/components/data-grid/data-grid.component';
import { ColDef, ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    RouterLink,
    NgFor,
    DataGridComponent
  ],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css'
})
export class PatientsComponent implements OnInit {
  // Enhanced patient data with varied statuses
  patients = [
    { 
      id: '1', 
      name: 'John Doe', 
      age: 35, 
      condition: 'Hypertension',
      lastVisit: new Date('2024-03-15'),
      status: 'Active',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567'
    },
    { 
      id: '2', 
      name: 'Jane Smith', 
      age: 42, 
      condition: 'Diabetes',
      lastVisit: new Date('2024-03-10'),
      status: 'Critical',
      email: 'jane.smith@example.com',
      phone: '(555) 987-6543'
    },
    { 
      id: '3', 
      name: 'Mike Johnson', 
      age: 28, 
      condition: 'Asthma',
      lastVisit: new Date('2024-03-05'),
      status: 'Stable',
      email: 'mike.johnson@example.com',
      phone: '(555) 234-5678'
    },
    { 
      id: '4', 
      name: 'Sarah Wilson', 
      age: 45, 
      condition: 'Arthritis',
      lastVisit: new Date('2024-03-01'),
      status: 'Pending',
      email: 'sarah.wilson@example.com',
      phone: '(555) 345-6789'
    },
    { 
      id: '5', 
      name: 'David Brown', 
      age: 52, 
      condition: 'Heart Disease',
      lastVisit: new Date('2024-02-28'),
      status: 'Inactive',
      email: 'david.brown@example.com',
      phone: '(555) 456-7890'
    }
  ];

  columnDefs: ColDef[] = [
    { 
      headerName: 'ID', 
      field: 'id', 
      width: 70,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      cellClass: 'id-cell',
      sortable: true,
      filter: true
    },
    { 
      headerName: 'Name', 
      field: 'name', 
      flex: 2,
      cellClass: 'name-cell',
      cellRenderer: (params: ICellRendererParams) => {
        return `<div class="patient-name">${params.value}</div>`;
      },
      sortable: true,
      filter: true
    },
    { 
      headerName: 'Age', 
      field: 'age', 
      width: 80,
      cellClass: 'age-cell',
      sortable: true,
      filter: true
    },
    { 
      headerName: 'Condition', 
      field: 'condition', 
      flex: 1.5,
      cellClass: 'condition-cell',
      sortable: true,
      filter: true
    },
    { 
      headerName: 'Last Visit', 
      field: 'lastVisit', 
      flex: 1,
      cellClass: 'date-cell',
      valueFormatter: params => this.formatDate(params.value),
      sortable: true,
      filter: true
    },
    { 
      headerName: 'Status', 
      field: 'status', 
      width: 120,
      cellClass: 'status-cell',
      cellRenderer: (params: ICellRendererParams) => {
        const statusClass = this.getStatusClass(params.value);
        return `<div class="status-badge ${statusClass}">${params.value}</div>`;
      },
      sortable: true,
      filter: true
    }
  ];

  rowActions: RowAction[] = [
    {
      label: 'View Profile',
      icon: 'person',
      action: (data) => this.viewPatientProfile(data)
    },
    {
      label: 'Edit Patient',
      icon: 'edit',
      action: (data) => console.log('Edit patient:', data.id)
    },
    {
      label: 'Schedule Appointment',
      icon: 'calendar_today',
      action: (data) => console.log('Schedule appointment for:', data.id)
    },
    {
      label: 'Delete Patient',
      icon: 'delete',
      action: (data) => console.log('Delete patient:', data.id)
    }
  ];

  ngOnInit() {
    console.log('Patients component initialized');
    console.log('Number of patients:', this.patients.length);
    console.log('Column definitions:', this.columnDefs);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
        return 'status-success';
      case 'critical':
        return 'status-danger';
      case 'stable':
        return 'status-info';
      case 'pending':
        return 'status-warning';
      case 'inactive':
        return 'status-secondary';
      default:
        return 'status-secondary';
    }
  }

  onPatientRowClicked(data: any): void {
    console.log('Patient selected:', data);
    // Navigate to patient profile or perform other actions
  }

  onRefreshGrid(): void {
    console.log('Refreshing patient data...');
    // Refresh data from service
  }

  viewPatientProfile(data: any): void {
    console.log('Viewing patient profile:', data.id);
    // Navigate to patient profile
  }

  onAddPatientClick(): void {
    console.log('Add patient clicked');
    // Handle add patient logic here
  }

  onSelectionChanged(selectedRows: any[]): void {
    console.log('Selected patients:', selectedRows);
    // Handle selection change
  }
}
