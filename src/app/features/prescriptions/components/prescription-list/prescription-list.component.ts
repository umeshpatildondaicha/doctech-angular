import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Prescription, Medication } from '../../models/prescription.model';
import { PrescriptionDialogComponent } from '../prescription-dialog/prescription-dialog.component';

@Component({
  selector: 'app-prescriptions-list',
  templateUrl: './prescription-list.component.html',
  styleUrls: ['./prescription-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule]
})
export class PrescriptionsListComponent implements OnInit, OnChanges {
  @Input() prescriptions: Prescription[] = [];
  @Input() currentPrescription: Prescription | null = null;
  @Output() editPrescription = new EventEmitter<Prescription>();
  @Output() deletePrescription = new EventEmitter<Prescription>();
  @Output() generatePrescription = new EventEmitter<Prescription>();
  @Output() addDiagnosis = new EventEmitter<{ diagnosis: string; symptoms: string }>();
  @Output() addMedication = new EventEmitter<any>();
  @Output() setNextVisit = new EventEmitter<{ date: Date; instructions: string }>();
  @Output() saveAndClear = new EventEmitter<void>();

  searchQuery: string = '';
  filteredPrescriptions: Prescription[] = [];
  groupedPrescriptions: { [key: string]: Prescription[] } = {};

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.initializePrescriptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('PrescriptionsListComponent ngOnChanges:', changes);
    
    if (changes['prescriptions']) {
      console.log('Prescriptions input changed:', this.prescriptions);
      this.initializePrescriptions();
    }
    
    if (changes['currentPrescription']) {
      console.log('Current prescription input changed:', this.currentPrescription);
    }
  }

  private initializePrescriptions(): void {
    console.log('Initializing prescriptions:', this.prescriptions);
    
    if (!this.prescriptions || this.prescriptions.length === 0) {
      console.log('No prescriptions to initialize');
      this.filteredPrescriptions = [];
      this.groupedPrescriptions = {};
      return;
    }
    
    this.filteredPrescriptions = [...this.prescriptions];
    this.updateGroupedPrescriptions(this.filteredPrescriptions);
    
    // Don't override currentPrescription if it already exists
    if (!this.currentPrescription && this.filteredPrescriptions.length > 0) {
      this.currentPrescription = this.filteredPrescriptions[0];
      console.log('Setting current prescription to first filtered prescription:', this.currentPrescription);
    }
    
    console.log('Filtered prescriptions:', this.filteredPrescriptions);
    console.log('Grouped prescriptions:', this.groupedPrescriptions);
  }

  updateGroupedPrescriptions(prescriptionsToGroup: Prescription[]): void {
    console.log('Updating grouped prescriptions with:', prescriptionsToGroup);
    
    if (!prescriptionsToGroup || prescriptionsToGroup.length === 0) {
      this.groupedPrescriptions = {};
      return;
    }
    
    this.groupedPrescriptions = prescriptionsToGroup.reduce((groups: { [key: string]: Prescription[] }, prescription: Prescription) => {
      if (!prescription.date) {
        console.warn('Prescription missing date:', prescription);
        return groups;
      }
      
      const date = new Date(prescription.date).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(prescription);
      return groups;
    }, {});

    // Sort medications within each prescription by name
    Object.keys(this.groupedPrescriptions).forEach(date => {
      this.groupedPrescriptions[date].forEach(prescription => {
        if (prescription.medications) {
          prescription.medications.sort((a: Medication, b: Medication) => a.name.localeCompare(b.name));
        }
      });
    });
    
    console.log('Updated grouped prescriptions:', this.groupedPrescriptions);
  }

  getSortedDates(): string[] {
    const dates = Object.keys(this.groupedPrescriptions);
    console.log('Getting sorted dates from:', dates);
    
    if (dates.length === 0) {
      return [];
    }
    
    return dates.sort((a, b) => {
      return new Date(b).getTime() - new Date(a).getTime();
    });
  }

  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    if (!query) {
      this.initializePrescriptions();
      return;
    }
    
    this.filteredPrescriptions = this.prescriptions.filter((prescription: Prescription) => 
      prescription.diagnosis.toLowerCase().includes(query) ||
      prescription.medications.some((med: Medication) => med.name.toLowerCase().includes(query))
    );
    
    this.updateGroupedPrescriptions(this.filteredPrescriptions);
  }

  openDialog(type: 'diagnosis' | 'medication' | 'visit'): void {
    console.log('Opening dialog of type:', type);
    
    const dialogConfig = {
      diagnosis: {
        title: 'Add Diagnosis',
        currentValue: { diagnosis: '', symptoms: '' }
      },
      medication: {
        title: 'Add Medication',
        currentValue: {
          name: '',
          dosage: '',
          frequency: '',
          duration: '',
          route: 'Oral',
          timing: '',
          instructions: '',
          withFood: false
        }
      },
      visit: {
        title: 'Schedule Next Visit',
        currentValue: { nextVisitDate: new Date(), instructions: '' }
      }
    };

    const dialogRef = this.dialog.open(PrescriptionDialogComponent, {
      width: '500px',
      data: {
        type,
        ...dialogConfig[type]
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
      
      if (result) {
        switch (type) {
          case 'diagnosis':
            console.log('Emitting diagnosis:', result);
            this.addDiagnosis.emit(result);
            break;
          case 'medication':
            console.log('Emitting medication:', result);
            this.addMedication.emit(result);
            break;
          case 'visit':
            console.log('Emitting next visit:', result);
            this.setNextVisit.emit(result);
            break;
        }
      }
    });
  }

  onEdit(prescription: Prescription): void {
    console.log('Edit prescription:', prescription);
    this.editPrescription.emit(prescription);
  }

  onDelete(prescription: Prescription): void {
    if (confirm('Are you sure you want to delete this prescription?')) {
      this.deletePrescription.emit(prescription);
    }
  }

  onGenerateForDate(date: string): void {
    const prescriptionsForDate = this.groupedPrescriptions[date];
    if (prescriptionsForDate && prescriptionsForDate.length > 0) {
      const basePrescription = prescriptionsForDate[0];
      this.generatePrescription.emit(basePrescription);
    }
  }

  // Get the next visit date for a specific date (using the most recent one)
  getNextVisitForDate(date: string): string | undefined {
    const prescriptionsForDate = this.groupedPrescriptions[date];
    if (!prescriptionsForDate || prescriptionsForDate.length === 0) {
      return undefined;
    }
    
    // Find the first prescription with a next visit date
    for (const prescription of prescriptionsForDate) {
      if (prescription.nextVisitDate) {
        return prescription.nextVisitDate;
      }
    }
    
    return undefined;
  }
  
  // Get the follow-up instructions for a specific date (using the most recent one)
  getFollowUpForDate(date: string): string | undefined {
    const prescriptionsForDate = this.groupedPrescriptions[date];
    if (!prescriptionsForDate || prescriptionsForDate.length === 0) {
      return undefined;
    }
    
    // Find the first prescription with follow-up instructions
    for (const prescription of prescriptionsForDate) {
      if (prescription.followUpInstructions && prescription.followUpInstructions.length > 0) {
        return prescription.followUpInstructions[0];
      }
    }
    
    return undefined;
  }
} 