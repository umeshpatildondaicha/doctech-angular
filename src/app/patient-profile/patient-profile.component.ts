import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HighchartsChartModule } from 'highcharts-angular';
import Highcharts from 'highcharts';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { FlexLayoutServerModule } from '@angular/flex-layout/server';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PrescriptionsListComponent } from '../features/prescriptions/components/prescription-list/prescription-list.component';
import { PrescriptionFormComponent } from '../features/prescriptions/components/prescription-form/prescription-form.component';
import { PrescriptionService } from '../features/prescriptions/services/prescription.service';
import { Prescription, Medication } from '../features/prescriptions/models/prescription.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PrescriptionTabComponent } from './prescription-tab/prescription-tab.component';

// Define the interface for care schedule items
interface CareTimetableItem {
  id: number;
  type: string;
  title: string;
  description: string;
  assignee: string;
  startTime: Date;
  endTime: Date;
  status: string;
  column?: number; // Add optional column property for horizontal positioning
}

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [
    MatListModule,
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    HighchartsChartModule,
    FlexLayoutServerModule,
    RouterModule,
    PrescriptionsListComponent,
    PrescriptionFormComponent,
    PrescriptionTabComponent
  ],
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.css'],
  providers: [PrescriptionService]
})
export class PatientProfileComponent implements OnInit {
  activeTab: string = 'profile';
  Highcharts: typeof Highcharts = Highcharts;
  patientId: string | null = null;

  prescriptions: Prescription[] = [];
  currentPrescription: Prescription | null = null;

  displayedMedicationColumns: string[] = [
    'name',
    'dosage',
    'frequency',
    'appointmentDate',
    'doctor',
  ];

  medication: Array<{
    name: string;
    dosage: string;
    frequency: string;
    appointmentDate: Date;
    doctor: string;
  }> = [
    {
      name: 'Paracetamol',
      dosage: '500mg',
      frequency: 'Twice a day',
      appointmentDate: new Date('2025-02-07'),
      doctor: 'Dr. John Doe',
    },
    {
      name: 'Amoxicillin',
      dosage: '250mg',
      frequency: 'Once a day',
      appointmentDate: new Date('2025-02-07'),
      doctor: 'Dr. Sarah Smith',
    },
    {
      name: 'Ibuprofen',
      dosage: '200mg',
      frequency: 'Every 8 hours',
      appointmentDate: new Date('2025-02-07'),
      doctor: 'Dr. Emily White',
    },
    {
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice a day',
      appointmentDate: new Date('2025-02-08'),
      doctor: 'Dr. Michael Brown',
    },
    {
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once a day',
      appointmentDate: new Date('2025-02-08'),
      doctor: 'Dr. Laura Green',
    },
    {
      name: 'Atorvastatin',
      dosage: '20mg',
      frequency: 'Once a day',
      appointmentDate: new Date('2025-02-08'),
      doctor: 'Dr. David Wilson',
    },
  ];
  // Sorting medications by appointmentDate (descending)
  get sortedMedications() {
    return this.medication.sort(
      (a, b) => b.appointmentDate.getTime() - a.appointmentDate.getTime()
    );
  }

  // Grouping medications by date
  getUniqueAppointmentDates(): Date[] {
    return [
      ...new Set(
        this.medication
          .map((med) => med.appointmentDate)
          .map((date) => date.toISOString())
      ),
    ]
      .map((dateStr) => new Date(dateStr))
      .sort((a, b) => b.getTime() - a.getTime());
  }

  getMedicationsForDate(date: Date) {
    return this.medication.filter(
      (med) => med.appointmentDate.toISOString() === date.toISOString()
    );
  }
  quickLinks = [
    { title: 'Prescriptions', icon: 'medication' },
    { title: 'Lab Reports', icon: 'science' },
    { title: 'Billing', icon: 'receipt' },
    { title: 'Appointments', icon: 'calendar_today' },
  ];
  displayedColumns: string[] = [
    'reportType',
    'date',
    'description',
    'status',
    'actions',
  ];

  medicalHistory = [
    {
      condition: 'Hypertension',
      date: new Date(2020, 0, 10),
      status: 'Resolved',
    },
    { condition: 'Diabetes', date: new Date(2021, 4, 15), status: 'Ongoing' },
  ];

  appointments = [
    {
      date: new Date(2024, 3, 10),
      doctor: 'Dr. Smith',
      purpose: 'Routine Checkup',
    },
    {
      date: new Date(2024, 3, 15),
      doctor: 'Dr. Johnson',
      purpose: 'Follow-up',
    },
  ];

  medications = [
    { medicine: 'Metformin', dosage: '500mg', status: 'Active' },
    { medicine: 'Lisinopril', dosage: '10mg', status: 'Active' },
  ];

  vitals = [
    {
      date: new Date(2024, 2, 1),
      bloodPressure: '120/80',
      heartRate: '72',
      temperature: '98.6°F',
    },
    {
      date: new Date(2024, 2, 15),
      bloodPressure: '118/78',
      heartRate: '70',
      temperature: '98.4°F',
    },
  ];

  patientStats = [
    {
      label: 'BMI',
      value: '25.5',
      unit: '',
      change: '0.5',
    },
    {
      label: 'Height',
      value: '175',
      unit: 'cm',
      change: '0.5',
    },
    {
      label: 'Weight',
      value: '70',
      unit: 'kg',
      change: '0.5',
    },
    {
      label: 'BP',
      value: '120/80',
      unit: 'mmHg',
      change: '0.5',
    },
  ];

  patient = {
    id: 'PT12345',
    name: 'John Smith',
    gender: 'Male',
    age: '42',
    mobile: '9999999999',
    dob: new Date('1980-05-15'),
    bed: 'A-101',
    email: 'john.smith@example.com',
    consultant: 'Dr. Jane Wilson',
    patientType: 'Regular',
    country: 'United States',
    nationality: 'American',
    photo: '',
    phone: '9999999999',
    doctorsNote: 'Patient has a history of hypertension.',
    noteAddedOn: new Date('2023-03-15'),
    admissionStatus: 'OPD',
    wardInfo: {
      ward: 'General Ward',
      bed: 'Bed-102',
      admissionDate: new Date('2023-07-10'),
      expectedDischarge: new Date('2023-07-15'),
      attendingDoctor: 'Dr. Sarah Johnson'
    }
  };

  diagnosis = [
    {
      reportType: 'CT Scan',
      date: new Date(2020, 1, 10),
      description:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Modi ipsam molestiae aut.',
      status: 'Done',
    },
    {
      reportType: 'Blood Test',
      date: new Date(2020, 1, 11),
      description:
        'Dolor sit amet consectetur adipisicing elit. Modi ipsam molestiae aut.',
      status: 'Pending',
    },
    {
      reportType: 'Blood Analysis',
      date: new Date(2020, 1, 11),
      description:
        'Tempore aut incidunt accusamus accusantium deleniti? Labore odio aperiam mollitia quaerat quos!',
      status: 'Pending',
    },
    {
      reportType: 'Vascular Sonography',
      date: new Date(2020, 1, 10),
      description:
        'Lquia soluta illo sed veniam repudiandae esse sequi qui impedit facilis laboriosam sapiente suscipit!',
      status: 'Done',
    },
  ];
  timelineData = [
    {
      date: 'Jan 23',
      title: 'Pre-visit awareness',
      description: `A patient's journey starts when they arrive at your digital front door.`
    },
    {
      date: 'Jan 07',
      title: 'Initial contact',
      description: 'The patient makes initial contact via call center, chat, or email.'
    },
    {
      date: 'Jan 05',
      title: 'Care',
      description: 'The patient is assessed at a medical facility.'
    },
    {
      date: 'Jan 01',
      title: 'Treatment',
      description: 'The health system provides the patient with both on-site and follow-up care.'
    }
  ];

  charges = [
    {
      date: new Date(2020, 1, 10),
      category: 'Eye Check',
      chargesType: 'Procedures',
      standardCharges: 35,
      tpaCharges: 0,
      applied: 35,
    },
    {
      date: new Date(2020, 1, 10),
      category: 'Blood Analysis',
      chargesType: 'Procedures',
      standardCharges: 65,
      tpaCharges: 0,
      applied: 65,
    },
  ];

  payments = [
    {
      date: new Date(2020, 1, 10),
      paymentMethod: 'Cash',
      amount: 200,
      status: 'Paid',
    },
    {
      date: new Date(2020, 1, 11),
      paymentMethod: 'Cash',
      amount: 1923,
      status: 'Due',
    },
  ];

  clinicalNotes = [
    {
      id: 1,
      date: new Date('2023-07-10T14:30:00'),
      category: 'Progress Note',
      categoryColor: 'primary',
      author: 'Dr. Sarah Johnson',
      content: 'Patient reports feeling better today. Blood pressure is now within normal range. Continuing with current medication regimen.',
      attachments: [
        { name: 'BP-Chart.pdf', icon: 'bi-file-pdf' }
      ]
    },
    {
      id: 2,
      date: new Date('2023-07-08T10:15:00'),
      category: 'Consultation',
      categoryColor: 'info',
      author: 'Dr. Michael Chang',
      content: 'Initial consultation for chest pain. ECG shows normal sinus rhythm. Recommending stress test and lipid panel.',
      attachments: [
        { name: 'ECG-Results.jpg', icon: 'bi-file-image' },
        { name: 'Referral.pdf', icon: 'bi-file-pdf' }
      ]
    },
    {
      id: 3,
      date: new Date('2023-07-05T09:00:00'),
      category: 'Treatment Plan',
      categoryColor: 'success',
      author: 'Dr. Sarah Johnson',
      content: 'Treatment plan updated to include new antihypertensive medication. Goal is to maintain BP below 130/80.',
      attachments: []
    }
  ];

  labReports = [
    {
      id: 1,
      date: new Date('2023-07-09'),
      name: 'Complete Blood Count',
      category: 'Blood Test',
      status: 'Completed',
      abnormal: false,
      report: 'CBC-Report.pdf'
    },
    {
      id: 2,
      date: new Date('2023-07-09'),
      name: 'Lipid Panel',
      category: 'Blood Test',
      status: 'Completed',
      abnormal: true,
      report: 'Lipid-Report.pdf'
    },
    {
      id: 3,
      date: new Date('2023-07-10'),
      name: 'Chest X-Ray',
      category: 'Imaging',
      status: 'Pending',
      abnormal: null,
      report: null
    },
    {
      id: 4,
      date: new Date('2023-07-11'),
      name: 'Stress Test',
      category: 'Cardiology',
      status: 'Ordered',
      abnormal: null,
      report: null
    }
  ];

  parseNumber(value: any): number {
    return parseFloat(value);
  }

  // Current date for calculations
  today = new Date();

  /**
   * Care schedule data for IPD patients
   */
  careScheduleItems: CareTimetableItem[] = [
    {
      id: 1,
      type: 'medication',
      title: 'Antibiotics',
      description: 'IV Ceftriaxone 1g',
      assignee: 'Nurse Johnson',
      startTime: new Date(new Date().setHours(6, 0, 0)),
      endTime: new Date(new Date().setHours(6, 15, 0)),
      status: 'completed'
    },
    {
      id: 2,
      type: 'nursing',
      title: 'Vital Signs Check',
      description: 'BP, Temp, HR, RR, SpO2',
      assignee: 'Nurse Williams',
      startTime: new Date(new Date().setHours(8, 0, 0)),
      endTime: new Date(new Date().setHours(8, 15, 0)),
      status: 'completed'
    },
    {
      id: 3,
      type: 'medication',
      title: 'Pain Management',
      description: 'Acetaminophen 1000mg PO',
      assignee: 'Nurse Johnson',
      startTime: new Date(new Date().setHours(10, 0, 0)),
      endTime: new Date(new Date().setHours(10, 10, 0)),
      status: 'completed'
    },
    {
      id: 4,
      type: 'doctor-visit',
      title: 'Doctor Rounds',
      description: 'Daily assessment & care plan update',
      assignee: 'Dr. Sarah Johnson',
      startTime: new Date(new Date().setHours(11, 0, 0)),
      endTime: new Date(new Date().setHours(11, 20, 0)),
      status: 'in-progress'
    },
    {
      id: 5,
      type: 'nursing',
      title: 'Dressing Change',
      description: 'Surgical wound assessment and dressing',
      assignee: 'Nurse Martinez',
      startTime: new Date(new Date().setHours(12, 30, 0)),
      endTime: new Date(new Date().setHours(12, 45, 0)),
      status: 'pending'
    },
    {
      id: 6,
      type: 'medication',
      title: 'Antibiotics',
      description: 'IV Ceftriaxone 1g',
      assignee: 'Nurse Johnson',
      startTime: new Date(new Date().setHours(14, 0, 0)),
      endTime: new Date(new Date().setHours(14, 15, 0)),
      status: 'pending'
    },
    {
      id: 7,
      type: 'test',
      title: 'Blood Draw',
      description: 'CBC, CMP, CRP',
      assignee: 'Lab Technician Wilson',
      startTime: new Date(new Date().setHours(15, 30, 0)),
      endTime: new Date(new Date().setHours(15, 40, 0)),
      status: 'pending'
    },
    {
      id: 8,
      type: 'nursing',
      title: 'Vital Signs Check',
      description: 'BP, Temp, HR, RR, SpO2',
      assignee: 'Nurse Williams',
      startTime: new Date(new Date().setHours(16, 0, 0)),
      endTime: new Date(new Date().setHours(16, 15, 0)),
      status: 'pending'
    },
    {
      id: 9,
      type: 'medication',
      title: 'Pain Management',
      description: 'Acetaminophen 1000mg PO',
      assignee: 'Nurse Johnson',
      startTime: new Date(new Date().setHours(18, 0, 0)),
      endTime: new Date(new Date().setHours(18, 10, 0)),
      status: 'pending'
    },
    {
      id: 10,
      type: 'procedure',
      title: 'Physical Therapy',
      description: 'Mobility exercises',
      assignee: 'PT Davis',
      startTime: new Date(new Date().setHours(19, 0, 0)),
      endTime: new Date(new Date().setHours(19, 30, 0)),
      status: 'pending'
    },
    {
      id: 11,
      type: 'medication',
      title: 'Night Medication',
      description: 'Various medications as prescribed',
      assignee: 'Nurse Thompson',
      startTime: new Date(new Date().setHours(22, 0, 0)),
      endTime: new Date(new Date().setHours(22, 15, 0)),
      status: 'pending'
    }
  ];

  /**
   * Upcoming care activities for quick view
   */
  upcomingCareActivities = [
    {
      type: 'nursing',
      title: 'Vital Check',
      description: 'Regular monitoring of vital signs',
      time: '4:00 PM',
      assignee: 'Nurse Williams',
      icon: 'bi-heart-pulse',
      iconClass: 'nursing-icon',
      badgeClass: 'bg-warning'
    },
    {
      type: 'medication',
      title: 'Antibiotics',
      description: 'IV Ceftriaxone 1g',
      time: '6:00 PM',
      assignee: 'Nurse Johnson',
      icon: 'bi-capsule',
      iconClass: 'medication-icon',
      badgeClass: 'bg-success'
    },
    {
      type: 'doctor-visit',
      title: 'Evening Rounds',
      description: 'By attending physician',
      time: '7:30 PM',
      assignee: 'Dr. Williams',
      icon: 'bi-person-badge',
      iconClass: 'doctor-icon',
      badgeClass: 'bg-primary'
    }
  ];

  /**
   * Calculate hour markers for the timeline
   */
  getHourMarkers() {
    const markers = [];
    for (let hour = 6; hour <= 22; hour++) {
      // Add marker for the hour
      markers.push({
        hour: hour,
        label: hour > 12 ? `${hour-12} PM` : hour === 12 ? '12 PM' : `${hour} AM`
      });
      
      // Add marker for the half hour (except for the last hour)
      if (hour < 22) {
        markers.push({
          hour: hour + 0.5,
          label: hour >= 12 ? `${hour === 12 ? 12 : hour-12}:30 PM` : `${hour}:30 AM`
        });
      }
    }
    return markers;
  }

  /**
   * Calculate the current time position on the timeline
   */
  getCurrentTimePosition(): number {
    const now = new Date();
    const currentHour = now.getHours() + (now.getMinutes() / 60);
    // Calculate position for current time using the same scale as the markers
    // Each hour is 80px tall now (to account for hour and half-hour markers)
    return Math.max(0, (currentHour - 6) * 80); // 80px per hour with half-hour marks
  }

  /**
   * Calculate position for schedule items on timeline
   */
  getScheduleItemPosition(item: CareTimetableItem): number {
    const startHour = item.startTime.getHours() + (item.startTime.getMinutes() / 60);
    // Calculate position: 80px per hour with half-hour marks, starting from 6 AM
    return (startHour - 6) * 80;
  }

  /**
   * Calculate horizontal position for overlapping items
   */
  getScheduleItemHorizontalPosition(item: CareTimetableItem): number {
    // Check if this item has a column assigned
    if (!item.hasOwnProperty('column')) {
      // Assign columns to all items if not already assigned
      this.assignOverlapColumns();
    }
    
    // Return the horizontal position based on the column
    // Each column is 10px offset from the left
    return (item.column || 0) * 35;
  }

  /**
   * Assign columns to items to prevent overlapping
   */
  assignOverlapColumns(): void {
    // Sort items by start time
    const sortedItems = [...this.careScheduleItems].sort((a, b) => 
      a.startTime.getTime() - b.startTime.getTime()
    );
    
    // Track active columns
    const activeColumns: {endTime: Date, column: number}[] = [];
    
    // Process each item
    for (const item of sortedItems) {
      // Find first available column
      let columnAssigned = false;
      
      // Check existing active columns first
      for (let i = 0; i < activeColumns.length; i++) {
        if (item.startTime >= activeColumns[i].endTime) {
          // This column is free, reuse it
          item.column = activeColumns[i].column;
          activeColumns[i].endTime = item.endTime;
          columnAssigned = true;
          break;
        }
      }
      
      // If no column was reused, add a new one
      if (!columnAssigned) {
        const newColumn = activeColumns.length;
        item.column = newColumn;
        activeColumns.push({ endTime: item.endTime, column: newColumn });
      }
    }
  }

  /**
   * Calculate height for schedule items on timeline
   */
  getScheduleItemHeight(item: CareTimetableItem): number {
    const startTime = item.startTime.getHours() + (item.startTime.getMinutes() / 60);
    const endTime = item.endTime.getHours() + (item.endTime.getMinutes() / 60);
    const durationHours = endTime - startTime;
    // Convert duration to pixels (80px per hour with half-hour marks)
    return Math.max(70, durationHours * 80); // Minimum height of 70px
  }

  /**
   * Get appropriate icon for schedule item based on type
   */
  getScheduleItemIcon(item: CareTimetableItem): string {
    const icons: {[key: string]: string} = {
      'medication': 'bi bi-capsule me-1',
      'doctor-visit': 'bi bi-person-badge me-1',
      'nursing': 'bi bi-heart-pulse me-1',
      'procedure': 'bi bi-tools me-1',
      'test': 'bi bi-flask me-1'
    };
    return icons[item.type] || 'bi bi-calendar-event me-1';
  }

  /**
   * Handle click on a schedule item
   */
  onScheduleItemClick(item: CareTimetableItem): void {
    // Show details or actions for the selected schedule item
    console.log('Schedule item clicked:', item);
    // In a real app, this might open a dialog with details and actions
  }

  /**
   * Toggle patient between OPD and IPD status
   */
  toggleAdmissionStatus(): void {
    if (this.patient.admissionStatus === 'OPD') {
      this.patient.admissionStatus = 'IPD';
      
      // Set default admission data if none exists
      if (!this.patient.wardInfo) {
        this.patient.wardInfo = {
          ward: 'General Ward',
          bed: 'Bed-102',
          admissionDate: new Date(),
          expectedDischarge: new Date(new Date().setDate(new Date().getDate() + 5)),
          attendingDoctor: 'Dr. Sarah Johnson'
        };
      }
    } else {
      this.patient.admissionStatus = 'OPD';
    }
  }

  constructor(
    private route: ActivatedRoute,
    private prescriptionService: PrescriptionService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.patientId = params.get('id');
      this.loadPatientData(this.patientId);
      
      this.loadPatientPrescriptions();
    });
  }

  private loadPatientData(patientId: string | null): void {
    console.log('Loading patient data for id:', patientId);
    if (patientId === null) {
      console.log('Null patientId, using default data');
      return;
    }

    this.patient.name = this.getPatientName(patientId);
  }

  private getPatientName(patientId: string): string {
    const names = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown'];
    const index = parseInt(patientId) % names.length;
    return names[index];
  }

  loadPatientPrescriptions(): void {
    this.prescriptionService.prescriptions$.subscribe((prescriptions) => {
      this.prescriptions = prescriptions;
    });
  }

  createNewPrescription(): void {
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
        age: 41,
        gender: this.patient.gender,
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
    this.showNotification('New prescription created');
  }

  onEditPrescription(prescription: Prescription): void {
    this.currentPrescription = prescription;
  }

  onDeletePrescription(prescription: Prescription): void {
    if (confirm('Are you sure you want to delete this prescription?')) {
      this.prescriptionService.deletePrescription(prescription.prescriptionId).subscribe(() => {
        this.loadPatientPrescriptions();
        this.showNotification('Prescription deleted successfully');
        if (this.currentPrescription?.prescriptionId === prescription.prescriptionId) {
          this.currentPrescription = null;
        }
      });
    }
  }

  onGeneratePrescription(prescription: Prescription): void {
    this.currentPrescription = prescription;
    this.onPrint();
  }

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

  private createNewPrescriptionWithDiagnosis(data: { diagnosis: string; symptoms: string }): void {
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
        age: 41,
        gender: this.patient.gender,
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
      this.loadPatientPrescriptions();
      this.showNotification('New prescription created with diagnosis');
    });
  }

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

  private createNewPrescriptionWithMedication(medication: any): void {
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
        age: 41,
        gender: this.patient.gender,
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
      this.loadPatientPrescriptions();
      this.showNotification('New prescription created with medication');
    });
  }

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

  private createNewPrescriptionWithNextVisit(data: { date: Date; instructions: string }): void {
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
        age: 41,
        gender: this.patient.gender,
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
      this.loadPatientPrescriptions();
      this.showNotification('New prescription created with next visit');
    });
  }

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

  onPrescriptionSaved(prescription: Prescription): void {
    this.updatePrescription(prescription);
    this.showNotification('Prescription saved successfully');
  }

  private updatePrescription(prescription: Prescription): void {
    this.currentPrescription = prescription;
    this.prescriptionService.savePrescription(prescription).subscribe(() => {
      this.loadPatientPrescriptions();
    });
  }

  onPrint(): void {
    if (!this.currentPrescription) {
      this.showNotification('No prescription selected for printing');
      return;
    }

    const originalTitle = document.title;
    document.title = "Prescription";
    
    const style = document.createElement('style');
    style.id = 'print-style-override';
    style.innerHTML = `
      @page { 
        margin: 0 !important; 
        size: A4 portrait !important;
      }
      @media print {
        body { margin: 0 !important; }
      }
    `;
    document.head.appendChild(style);
    
    window.print();
    
    setTimeout(() => {
      document.title = originalTitle;
      const tempStyle = document.getElementById('print-style-override');
      if (tempStyle) {
        tempStyle.remove();
      }
    }, 1000);
  }

  private showNotification(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  profilePieChartOption: Highcharts.Options = {
    chart: {
      plotShadow: false,
      type: 'pie',
    },
    title: {
      text: 'Types of Medicines Prescribed',
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
        },
      },
    },
    series: [
      {
        type: 'pie',
        name: 'Medicine Types',
        innerSize: '65%',
        data: [
          ['Antibiotics', 30],
          ['Pain Relievers', 20],
          ['Antipyretics', 15],
          ['Anti-inflammatory', 10],
          ['Antihypertensives', 10],
          ['Antidiabetics', 5],
          ['Vitamins & Supplements', 5],
          ['Other Medications', 5],
        ],
      },
    ],
  };

  dietPlan = [
    {
      day: 'Monday',
      breakfast: 'Oatmeal',
      lunch: 'Grilled Chicken & Rice',
      dinner: 'Salad & Soup',
    },
    {
      day: 'Tuesday',
      breakfast: 'Boiled Eggs & Toast',
      lunch: 'Fish & Vegetables',
      dinner: 'Pasta & Salad',
    },
    {
      day: 'Wednesday',
      breakfast: 'Smoothie & Nuts',
      lunch: 'Steak & Potatoes',
      dinner: 'Vegetable Stir Fry',
    },
    {
      day: 'Thursday',
      breakfast: 'Pancakes & Berries',
      lunch: 'Chicken Salad',
      dinner: 'Soup & Bread',
    },
    {
      day: 'Friday',
      breakfast: 'Yogurt & Granola',
      lunch: 'Salmon & Rice',
      dinner: 'Quinoa & Vegetables',
    },
    {
      day: 'Saturday',
      breakfast: 'Omelet & Toast',
      lunch: 'Pasta & Chicken',
      dinner: 'Grilled Fish & Vegetables',
    },
    {
      day: 'Sunday',
      breakfast: 'Fruits & Nuts',
      lunch: 'Veggie Wraps',
      dinner: 'Lentil Soup & Rice',
    },
  ];

  dietChartOptions: Highcharts.Options = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'Weekly Diet Plan',
    },
    xAxis: {
      categories: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Calories',
      },
    },
    series: [
      {
        type: 'column',
        name: 'Breakfast',
        data: [300, 350, 320, 310, 330, 340, 360],
      },
      {
        type: 'column',
        name: 'Lunch',
        data: [500, 520, 510, 530, 550, 540, 560],
      },
      {
        type: 'column',
        name: 'Dinner',
        data: [450, 460, 440, 470, 480, 490, 500],
      },
    ],
  };
}

