import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrescriptionsListComponent } from '../../features/prescriptions/components/prescription-list/prescription-list.component';
import { PrescriptionFormComponent } from '../../features/prescriptions/components/prescription-form/prescription-form.component';
import { PrescriptionService } from '../../features/prescriptions/services/prescription.service';
import { Prescription, Medication } from '../../features/prescriptions/models/prescription.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PrescriptionDialogComponent } from '../prescription-dialog/prescription-dialog.component';

@Component({
  selector: 'app-prescription-tab',
  standalone: true,
  imports: [
    CommonModule,
    PrescriptionsListComponent,
    PrescriptionFormComponent,
    MatDialogModule
  ],
  providers: [PrescriptionService],
  templateUrl: './prescription-tab.component.html',
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    
    .btn-success {
      background-color: #4CAF50;
      border-color: #4CAF50;
      z-index: 100;
    }
    
    .btn-success:hover {
      background-color: #388E3C;
      border-color: #388E3C;
      transform: scale(1.05);
      transition: transform 0.2s ease;
    }
    
    /* Hide print-wrapper in normal view */
    .print-wrapper {
      display: none;
    }
    
    @media print {
      /* Hide non-print elements */
      body > *:not(.print-wrapper),
      app-root > *:not(.print-wrapper),
      .row, .col-md-4, .col-md-8, .btn-success, 
      app-prescriptions-list, app-prescription-form {
        display: none !important;
      }
      
      /* Show print wrapper */
      .print-wrapper {
        display: block !important;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        margin: 0;
        padding: 0;
        background-color: white;
      }
      
      /* Basic print settings */
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      
      /* Create space for doctor's letterhead on first page */
      .prescription-print-container {
        position: relative;
        width: 100%;
        box-sizing: border-box;
        padding: 0 6mm;
        font-size: 10pt;
        line-height: 1.3;
        color: #000;
        border: 1px solid #000;
        margin: 0 auto;
        max-width: 210mm;
      }
      
      /* Professional prescription header */
      .prescription-header {
        margin-bottom: 4mm !important;
        border-bottom: 1px solid #000 !important;
        padding-bottom: 2mm !important;
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
      }
      
      .rx-header {
        display: flex !important;
        align-items: center !important;
        gap: 3mm !important;
      }
      
      .rx-title {
        font-size: 14pt !important;
        font-weight: bold !important;
        letter-spacing: 1px !important;
      }
      
      .rx-symbol-large {
        font-size: 18pt !important;
        font-weight: bold !important;
        font-style: italic !important;
      }
      
      .prescription-meta {
        display: flex !important;
        flex-direction: column !important;
        gap: 0.5mm !important;
        text-align: right !important;
        font-size: 8pt !important;
      }
      
      /* Space for letterhead */
      .letterhead-space {
        height: 20vh !important;
        width: 100% !important;
        display: block !important;
      }
      
      /* Section styling */
      .section-label {
        background-color: #f0f0f0 !important;
        color: #000 !important;
        padding: 1mm 2mm !important;
        font-weight: bold !important;
        font-size: 10pt !important;
        letter-spacing: 0.5px !important;
        border-left: 3px solid #000 !important;
        margin-bottom: 2mm !important;
      }
      
      /* Patient information section */
      .patient-info-section {
        margin-bottom: 4mm !important;
        padding-bottom: 3mm !important;
        border-bottom: 1px solid #000 !important;
      }
      
      .patient-details {
        display: grid !important;
        grid-template-columns: 1fr 1fr 1fr !important;
        gap: 1mm 3mm !important;
      }
      
      /* Other print styles as needed */
      .patient-field {
        margin-bottom: 1mm !important;
        line-height: 1.2 !important;
      }
      
      .patient-field-label {
        font-weight: bold !important;
        margin-right: 1mm !important;
        color: #333 !important;
      }
      
      .name-field {
        grid-column: 1 / span 2 !important;
      }
      
      .address-field {
        grid-column: 1 / span 2 !important;
      }
      
      /* Diagnosis section */
      .diagnosis-section {
        margin-bottom: 4mm !important;
        padding-bottom: 2mm !important;
        border-bottom: 1px solid #000 !important;
      }
      
      /* Medications section */
      .medications-section {
        margin-bottom: 6mm !important;
        page-break-inside: avoid !important;
      }
      
      .rx-line {
        height: 1px !important;
        background: repeating-linear-gradient(90deg, #000, #000 5mm, transparent 5mm, transparent 10mm) !important;
        margin: 2mm 0 4mm 0 !important;
      }
      
      /* Force a page break if needed for signature space */
      .signature-space-needed {
        page-break-before: always !important;
        break-before: always !important;
      }
    }
  `]
})
export class PrescriptionTabComponent implements OnInit {
  prescriptions: Prescription[] = [];
  currentPrescription: Prescription | null = null;
  @Input() patient: any; // This will be passed from the parent component
  prescriptionNeedsPageBreak = false; // Added property for page break

  constructor(
    private prescriptionService: PrescriptionService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadPrescriptions();
  }

  /**
   * Load all prescriptions
   */
  loadPrescriptions(): void {
    this.prescriptionService.prescriptions$.subscribe(prescriptions => {
      this.prescriptions = prescriptions;
    });
  }

  /**
   * Create a new prescription for the current patient
   */
  createNewPrescription(): void {
    if (!this.patient) {
      this.showNotification('Patient information not available');
      return;
    }

    const newPrescription: Prescription = {
      prescriptionId: 'PRES-' + Date.now().toString(),
      date: new Date().toISOString(),
      doctor: {
        name: 'Dr. John Smith',
        specialization: 'Cardiologist',
        registrationNumber: 'MD12345',
        clinicName: 'Heart Care Clinic',
        address: '123 Healthcare Street',
        phone: '555-0123'
      },
      patient: {
        name: this.patient.name,
        age: parseInt(this.patient.age) || 40,
        gender: this.patient.gender || 'Unknown',
        address: 'Patient Address',
        phone: this.patient.phone || ''
      },
      diagnosis: '',
      symptoms: [],
      medications: [],
      signature: 'Dr. J. Smith',
      status: 'Active',
      priority: 'Normal'
    };

    this.currentPrescription = newPrescription;
    
    // Open the new prescription in dialog
    const dialogRef = this.dialog.open(PrescriptionDialogComponent, {
      width: '800px',
      maxHeight: '90vh',
      data: { prescription: newPrescription }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updatePrescription(result);
        this.showNotification('New prescription created');
      } else {
        // If dialog was cancelled, remove the current prescription
        this.currentPrescription = null;
      }
    });
  }

  /**
   * Handle editing a prescription
   */
  onEditPrescription(prescription: Prescription): void {
    this.currentPrescription = prescription;
    
    // Open prescription in dialog
    const dialogRef = this.dialog.open(PrescriptionDialogComponent, {
      width: '800px',
      maxHeight: '90vh',
      data: { prescription: prescription }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updatePrescription(result);
        this.showNotification('Prescription updated successfully');
      }
    });
  }

  /**
   * Handle deleting a prescription
   */
  onDeletePrescription(prescription: Prescription): void {
    if (confirm('Are you sure you want to delete this prescription?')) {
      this.prescriptionService.deletePrescription(prescription.prescriptionId).subscribe(() => {
        this.loadPrescriptions();
        this.showNotification('Prescription deleted successfully');
        if (this.currentPrescription?.prescriptionId === prescription.prescriptionId) {
          this.currentPrescription = null;
        }
      });
    }
  }

  /**
   * Handle printing a prescription
   */
  onPrint(): void {
    if (!this.currentPrescription) {
      this.showNotification('No prescription selected for printing');
      return;
    }

    // Check if page break is needed based on content
    this.checkSignaturePageBreak();
    
    // Get the prescription wrapper element
    const printWrapper = document.querySelector('.print-wrapper') as HTMLElement;
    if (!printWrapper) {
      this.showNotification('Print template not found');
      return;
    }
    
    // Create a hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    
    document.body.appendChild(iframe);
    
    // Set up iframe document
    const iframeDoc = iframe.contentWindow?.document;
    if (!iframeDoc) {
      document.body.removeChild(iframe);
      this.showNotification('Could not create print preview');
      return;
    }
    
    // Write prescription content to iframe
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Prescription - ${this.currentPrescription.patient?.name || 'Patient'}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          body {
            font-family: Arial, sans-serif;
            padding: 0;
            margin: 0;
            background-color: white;
          }
          .prescription-print-container {
            position: relative;
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
            padding: 5mm;
            font-size: 10pt;
            line-height: 1.3;
            color: #000;
            border: 1px solid #000;
          }
          /* Include all other print styles here */
          .prescription-header {
            margin-bottom: 4mm;
            border-bottom: 1px solid #000;
            padding-bottom: 2mm;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .rx-header {
            display: flex;
            align-items: center;
            gap: 3mm;
          }
          
          .rx-title {
            font-size: 14pt;
            font-weight: bold;
            letter-spacing: 1px;
          }
          
          .rx-symbol-large {
            font-size: 18pt;
            font-weight: bold;
            font-style: italic;
          }
          
          .prescription-meta {
            display: flex;
            flex-direction: column;
            gap: 0.5mm;
            text-align: right;
            font-size: 8pt;
          }
          
          .letterhead-space {
            height: 20vh;
            width: 100%;
            display: block;
          }
          
          .section-label {
            background-color: #f0f0f0;
            color: #000;
            padding: 1mm 2mm;
            font-weight: bold;
            font-size: 10pt;
            letter-spacing: 0.5px;
            border-left: 3px solid #000;
            margin-bottom: 2mm;
          }
          
          .patient-info-section {
            margin-bottom: 4mm;
            padding-bottom: 3mm;
            border-bottom: 1px solid #000;
          }
          
          .patient-details {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 1mm 3mm;
          }
          
          .patient-field {
            margin-bottom: 1mm;
            line-height: 1.2;
          }
          
          .patient-field-label {
            font-weight: bold;
            margin-right: 1mm;
            color: #333;
          }
          
          .name-field {
            grid-column: 1 / span 2;
          }
          
          .address-field {
            grid-column: 1 / span 2;
          }
          
          .diagnosis-section {
            margin-bottom: 4mm;
            padding-bottom: 2mm;
            border-bottom: 1px solid #000;
          }
          
          .medications-section {
            margin-bottom: 6mm;
            page-break-inside: avoid;
          }
          
          .rx-line {
            height: 1px;
            background: repeating-linear-gradient(90deg, #000, #000 5mm, transparent 5mm, transparent 10mm);
            margin: 2mm 0 4mm 0;
          }
          
          .signature-space-needed {
            page-break-before: always;
            break-before: always;
          }
        </style>
      </head>
      <body>
        ${printWrapper.innerHTML}
      </body>
      </html>
    `);
    iframeDoc.close();
    
    // Print after a short delay to ensure content is loaded
    iframe.onload = () => {
      setTimeout(() => {
        try {
          iframe.contentWindow?.print();
          
          // Remove iframe after printing
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 1000);
        } catch (error) {
          document.body.removeChild(iframe);
          this.showNotification('Print error: ' + error);
        }
      }, 200);
    };
  }

  /**
   * Check if we need to force a page break before the signature
   */
  private checkSignaturePageBreak(): void {
    if (!this.currentPrescription) return;
    
    const medicationCount = this.currentPrescription.medications ? this.currentPrescription.medications.length : 0;
    const diagnosisLength = this.currentPrescription.diagnosis ? this.currentPrescription.diagnosis.length : 0;
    const hasFollowUp = this.currentPrescription.followUpInstructions ? this.currentPrescription.followUpInstructions.length > 0 : false;
    
    // If we have many medications or long diagnosis, we likely need a page break
    this.prescriptionNeedsPageBreak = medicationCount > 4 || 
                                    diagnosisLength > 200 ||
                                    (medicationCount > 2 && hasFollowUp);
  }

  /**
   * Handle adding a diagnosis to a prescription
   */
  onAddDiagnosis(data: { diagnosis: string; symptoms: string }): void {
    if (this.currentPrescription) {
      const updatedPrescription = {
        ...this.currentPrescription,
        diagnosis: data.diagnosis,
        symptoms: data.symptoms.split(',').map(s => s.trim())
      };
      
      this.updatePrescription(updatedPrescription);
      this.showNotification('Diagnosis added successfully');
    } else {
      this.createNewPrescriptionWithDiagnosis(data);
    }
  }

  /**
   * Create a new prescription with diagnosis
   */
  private createNewPrescriptionWithDiagnosis(data: { diagnosis: string; symptoms: string }): void {
    if (!this.patient) {
      this.showNotification('Patient information not available');
      return;
    }

    const newPrescription: Prescription = {
      prescriptionId: 'PRES-' + Date.now().toString(),
      date: new Date().toISOString(),
      doctor: {
        name: 'Dr. John Smith',
        specialization: 'Cardiologist',
        registrationNumber: 'MD12345',
        clinicName: 'Heart Care Clinic',
        address: '123 Healthcare Street',
        phone: '555-0123'
      },
      patient: {
        name: this.patient.name,
        age: parseInt(this.patient.age) || 40,
        gender: this.patient.gender || 'Unknown',
        address: 'Patient Address',
        phone: this.patient.phone || ''
      },
      diagnosis: data.diagnosis,
      symptoms: data.symptoms.split(',').map(s => s.trim()),
      medications: [],
      signature: 'Dr. J. Smith',
      status: 'Active',
      priority: 'Normal'
    };

    this.currentPrescription = newPrescription;
    this.prescriptionService.savePrescription(newPrescription).subscribe(() => {
      this.loadPrescriptions();
      this.showNotification('New prescription created with diagnosis');
    });
  }

  /**
   * Handle adding medication to a prescription
   */
  onAddMedication(medication: any): void {
    if (this.currentPrescription) {
      const newMedication: Medication = {
        name: medication.name,
        dosage: medication.dosage,
        frequency: medication.frequency,
        duration: medication.duration,
        instructions: medication.instructions || '',
        route: medication.route || 'Oral',
        timing: medication.timing || '',
        withFood: medication.withFood || false
      };

      const updatedPrescription = {
        ...this.currentPrescription,
        medications: [...(this.currentPrescription.medications || []), newMedication]
      };

      this.updatePrescription(updatedPrescription);
      this.showNotification('Medication added successfully');
    } else {
      this.createNewPrescriptionWithMedication(medication);
    }
  }

  /**
   * Create a new prescription with medication
   */
  private createNewPrescriptionWithMedication(medication: any): void {
    if (!this.patient) {
      this.showNotification('Patient information not available');
      return;
    }

    const newPrescription: Prescription = {
      prescriptionId: 'PRES-' + Date.now().toString(),
      date: new Date().toISOString(),
      doctor: {
        name: 'Dr. John Smith',
        specialization: 'Cardiologist',
        registrationNumber: 'MD12345',
        clinicName: 'Heart Care Clinic',
        address: '123 Healthcare Street',
        phone: '555-0123'
      },
      patient: {
        name: this.patient.name,
        age: parseInt(this.patient.age) || 40,
        gender: this.patient.gender || 'Unknown',
        address: 'Patient Address',
        phone: this.patient.phone || ''
      },
      diagnosis: '',
      symptoms: [],
      medications: [{
        name: medication.name,
        dosage: medication.dosage,
        frequency: medication.frequency,
        duration: medication.duration,
        instructions: medication.instructions || '',
        route: medication.route || 'Oral',
        timing: medication.timing || '',
        withFood: medication.withFood || false
      }],
      signature: 'Dr. J. Smith',
      status: 'Active',
      priority: 'Normal'
    };

    this.currentPrescription = newPrescription;
    this.prescriptionService.savePrescription(newPrescription).subscribe(() => {
      this.loadPrescriptions();
      this.showNotification('New prescription created with medication');
    });
  }

  /**
   * Handle setting next visit
   */
  onSetNextVisit(data: { date: Date; instructions: string }): void {
    if (this.currentPrescription) {
      const visitDate = data.date instanceof Date ? data.date.toISOString() : data.date;
      const instructions = data.instructions ? [data.instructions] : [];

      const updatedPrescription = {
        ...this.currentPrescription,
        nextVisitDate: visitDate,
        followUpInstructions: instructions
      };

      this.updatePrescription(updatedPrescription);
      this.showNotification('Next visit scheduled successfully');
    } else {
      this.createNewPrescriptionWithNextVisit(data);
    }
  }

  /**
   * Create a new prescription with next visit
   */
  private createNewPrescriptionWithNextVisit(data: { date: Date; instructions: string }): void {
    if (!this.patient) {
      this.showNotification('Patient information not available');
      return;
    }

    const newPrescription: Prescription = {
      prescriptionId: 'PRES-' + Date.now().toString(),
      date: new Date().toISOString(),
      doctor: {
        name: 'Dr. John Smith',
        specialization: 'Cardiologist',
        registrationNumber: 'MD12345',
        clinicName: 'Heart Care Clinic',
        address: '123 Healthcare Street',
        phone: '555-0123'
      },
      patient: {
        name: this.patient.name,
        age: parseInt(this.patient.age) || 40,
        gender: this.patient.gender || 'Unknown',
        address: 'Patient Address',
        phone: this.patient.phone || ''
      },
      diagnosis: '',
      symptoms: [],
      medications: [],
      nextVisitDate: data.date instanceof Date ? data.date.toISOString() : data.date,
      followUpInstructions: data.instructions ? [data.instructions] : [],
      signature: 'Dr. J. Smith',
      status: 'Active',
      priority: 'Normal'
    };

    this.currentPrescription = newPrescription;
    this.prescriptionService.savePrescription(newPrescription).subscribe(() => {
      this.loadPrescriptions();
      this.showNotification('New prescription created with next visit');
    });
  }

  /**
   * Handle saving and clearing a prescription
   */
  onSaveAndClear(): void {
    if (this.currentPrescription) {
      const updatedPrescription = {
        ...this.currentPrescription,
        medications: [],
        nextVisitDate: undefined,
        followUpInstructions: []
      };

      this.updatePrescription(updatedPrescription);
      this.showNotification('Prescription saved and cleared successfully');
    } else {
      this.showNotification('No active prescription to save and clear');
    }
  }

  /**
   * Handle saving a prescription
   */
  onPrescriptionSaved(prescription: Prescription): void {
    this.updatePrescription(prescription);
    this.showNotification('Prescription saved successfully');
  }

  /**
   * Update a prescription
   */
  private updatePrescription(prescription: Prescription): void {
    this.currentPrescription = prescription;
    this.prescriptionService.savePrescription(prescription).subscribe(() => {
      this.loadPrescriptions();
    });
  }

  /**
   * Show a notification message
   */
  private showNotification(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  /**
   * Handle printing a prescription from the list
   */
  onGeneratePrescription(prescription: Prescription): void {
    this.currentPrescription = prescription;
    this.onPrint();
  }
} 