import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Patient } from '../../models/patient.interface';
import { PatientService } from '../../services/patient.service';
import { TableConfigService, Column } from '../../services/table-config.service';
import { TableModifierDialogComponent } from '../table-modifier-dialog/table-modifier-dialog.component';

@Component({
    selector: 'app-table-view',
    templateUrl: 'table-view.component.html',
    styleUrls: ['./table-view.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DecimalPipe,
        MatDialogModule
    ]
})
export class TableViewComponent implements OnInit {
    patients: Patient[] = [];
    conditions: string[] = [];
    wards: string[] = [];
    doctors: string[] = [];
    searchText: string = '';
    selectedCondition: string = 'All Conditions';
    selectedWard: string = 'All Wards';
    selectedDoctor: string = 'All Doctors';
    itemsPerPage: number = 5;
    currentPage: number = 1;
    viewMode: 'grid' | 'list' = 'list';
    lastUpdated: string = new Date().toLocaleString();
    showTableModifier: boolean = false;
    tableColumns: Column[] = [
        { name: 'Patient ID', type: 'text', key: 'id' },
        { name: 'Name', type: 'text', key: 'name' },
        { name: 'Age', type: 'number', key: 'age' },
        { name: 'Gender', type: 'text', key: 'gender' },
        { name: 'Condition', type: 'text', key: 'condition' },
        { name: 'Status', type: 'text', key: 'status' },
        { name: 'Admission Date', type: 'text', key: 'admissionDate' },
        { name: 'Doctor', type: 'text', key: 'doctor' },
        { name: 'Ward', type: 'text', key: 'ward' },
        { name: 'Room', type: 'text', key: 'roomNumber' }
    ];

    constructor(
        private patientService: PatientService,
        private router: Router,
        private tableConfigService: TableConfigService,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.loadData();
        // Initialize filters from service
        this.conditions = this.patientService.getConditions();
        this.wards = this.patientService.getWards();
        this.doctors = this.patientService.getDoctors();

        // Set initial columns in the service
        this.tableConfigService.setTableColumns(this.tableColumns);

        // Subscribe to column changes
        this.tableConfigService.getTableColumns().subscribe(columns => {
            if (columns && columns.length > 0) {
                this.tableColumns = columns.map(column => ({
                    ...column,
                    visible: column.visible !== false
                }));
            }
        });
    }

    loadData(): void {
        this.patientService.getPatients().subscribe(data => {
            this.patients = data;
            this.tableConfigService.setTableData(data);
        });
    }

    clearFilters(): void {
        this.selectedCondition = 'All Conditions';
        this.selectedWard = 'All Wards';
        this.selectedDoctor = 'All Doctors';
        this.searchText = '';
    }

    get filteredPatients(): Patient[] {
        return this.patients.filter(patient => {
            const matchesSearch = !this.searchText || 
                Object.values(patient).some(value => 
                    String(value).toLowerCase().includes(this.searchText.toLowerCase())
                );
            const matchesCondition = this.selectedCondition === 'All Conditions' || 
                patient.condition === this.selectedCondition;
            const matchesWard = this.selectedWard === 'All Wards' || 
                patient.ward === this.selectedWard;
            const matchesDoctor = this.selectedDoctor === 'All Doctors' || 
                patient.doctor === this.selectedDoctor;

            return matchesSearch && matchesCondition && matchesWard && matchesDoctor;
        });
    }

    refreshData(): void {
        this.loadData();
        this.lastUpdated = new Date().toLocaleString();
    }

    downloadData(): void {
        // Implement download functionality
        console.log('Downloading patient data...');
    }

    uploadData(): void {
        // Implement upload functionality
        console.log('Uploading patient data...');
    }

    toggleView(mode: 'grid' | 'list'): void {
        this.viewMode = mode;
    }

    openTableModifier(): void {
        const dialogRef = this.dialog.open(TableModifierDialogComponent, {
            width: '400px'
        });

        dialogRef.afterClosed().subscribe((result: Column[] | undefined) => {
            if (result) {
                this.tableColumns = result;
                // Show success notification
                alert('Table configuration updated successfully!');
            }
        });
    }

    navigateToPatientProfile(patientId: string): void {
        this.router.navigate(['/profile', patientId]);
    }
} 