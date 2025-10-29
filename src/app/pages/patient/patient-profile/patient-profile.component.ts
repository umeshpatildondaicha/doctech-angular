import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatExpansionModule } from '@angular/material/expansion';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';

// Custom Components
import { IconComponent } from '../../../tools/app-icon/icon.component';
import { AppButtonComponent } from '../../../tools/app-button/app-button.component';
import { AppInputComponent } from '../../../tools/app-input/app-input.component';
import { AppSelectboxComponent } from '../../../tools/app-selectbox/app-selectbox.component';
import { CustomEventsService } from '../../../services/custom-events.service';
import { DoctorSearchDialogComponent } from '../../doctor-search-dialog/doctor-search-dialog.component';
import { AppointmentBookingComponent } from '../../appointment-booking/appointment-booking.component';

// Import new interfaces
import { PatientRound, RoundSchedule } from '../../../interfaces/patient-rounds.interface';
import { MedicineRequest } from '../../../interfaces/medicine-request.interface';
import { PatientRelative } from '../../../interfaces/patient-relatives.interface';

// Interfaces
interface CareTimetableItem {
  id: number;
  type: string;
  title: string;
  description: string;
  assignee: string;
  startTime: Date;
  endTime: Date;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  column?: number;
}

interface PatientMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  route: string;
  startDate: Date;
  endDate?: Date;
  prescribedBy: string;
  status: 'active' | 'discontinued' | 'completed';
  instructions: string;
  sideEffects?: string[];
  interactions?: string[];
}

interface VitalSign {
  id: string;
  type: string;
  value: number;
  unit: string;
  date: Date;
  time: Date;
  recordedBy: string;
  notes?: string;
  isNormal: boolean;
}

interface LabReport {
  id: string;
  testName: string;
  category: string;
  result: string;
  normalRange: string;
  unit: string;
  date: Date;
  status: 'pending' | 'completed' | 'abnormal';
  orderedBy: string;
  notes?: string;
}

interface Appointment {
  id: string;
  date: Date;
  time: Date;
  type: string;
  doctor: string;
  department: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  followUp?: Date;
}

interface ClinicalNote {
  id: string;
  date: Date;
  type: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  isPrivate: boolean;
}

interface PatientInfo {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  contactNumber: string;
  email: string;
  address: string;
  emergencyContact: string;
  emergencyContactRelation: string;
  admissionStatus: 'IPD' | 'OPD' | 'DISCHARGED';
  admissionDate?: Date;
  dischargeDate?: Date;
  roomNumber?: string;
  bedNumber?: string;
  primaryDoctor: string;
  department: string;
  diagnosis: string[];
  allergies: string[];
  insuranceProvider?: string;
  insuranceNumber?: string;
  insuranceExpiry?: Date;
  occupation?: string;
  maritalStatus?: string;
  nextOfKin?: string;
  medicalHistory?: string[];
  familyHistory?: string[];
  lifestyle?: {
    smoking: boolean;
    alcohol: boolean;
    exercise: string;
    diet: string;
  };
}

interface PatientStats {
  totalAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  cancelledAppointments: number;
  totalPrescriptions: number;
  activeMedications: number;
  labReports: number;
  abnormalLabReports: number;
  vitalReadings: number;
  clinicalNotes: number;
  daysInHospital?: number;
  readmissionCount: number;
}

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  color: 'primary' | 'accent' | 'warn';
  disabled?: boolean;
}

// IPD Management Interfaces
interface IPDAdmissionDetails {
  ward: string;
  room: string;
  bed: string;
  admissionDate: Date;
  attendingDoctor: string;
  expectedDischarge?: Date;
  lengthOfStay: number;
  daysLeft: number;
}

interface IPDVitalSigns {
  pulse: number;
  temperature: number;
  bloodPressure: string;
  spO2: number;
  lastUpdated: Date;
}

interface IPDCareSchedule {
  time: string;
  activity: string;
  description: string;
  type: 'nursing' | 'medication' | 'doctor-visit' | 'lab' | 'diet';
  assignedTo: string;
  status: 'pending' | 'in-progress' | 'completed';
}

interface IPDQuickAction {
  id: string;
  label: string;
  icon: string;
  color: string;
  action: () => void;
}

// Search and Notification Interfaces
interface SearchResult {
  id: string;
  text: string;
  category: string;
  icon: string;
  action: () => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  icon: string;
  color: string;
  time: Date;
  read: boolean;
  action?: () => void;
}

interface CareTeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  color: string;
  phone?: string;
  email?: string;
  availability: 'available' | 'busy' | 'offline';
}

interface VitalTrend {
  type: string;
  current: number;
  previous: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTooltipModule,
    MatBadgeModule,
    MatExpansionModule,
    ReactiveFormsModule,
    FormsModule,
    IconComponent,
    AppButtonComponent,
    AppInputComponent,
    AppSelectboxComponent
  ],
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.scss']
})
export class PatientProfileComponent implements OnInit {
  // View Mode Management
  viewMode: 'profile' | 'ipd' = 'profile';
  
  // Search and UI State
  searchQuery: string = '';
  searchResults: SearchResult[] = [];
  showNotifications: boolean = false;
  showCareTeamDialog: boolean = false;
  isFullscreen: boolean = false;
  chartPeriod: '24h' | '7d' = '24h';
  
  // Notifications
  notifications: Notification[] = [];
  unreadNotifications: number = 0;
  
  // Care Team
  careTeam: CareTeamMember[] = [];
  
  // Vital Signs Trends
  vitalTrends: VitalTrend[] = [];
  
  // Navigation
  tabs = [
    { id: 'overview', label: 'Overview', icon: 'dashboard', badge: 0 },
    { id: 'medical-record', label: 'Medical Record', icon: 'receipt', badge: 0 },
    { id: 'profile', label: 'Profile', icon: 'person', badge: 0 },
    { id: 'vitals', label: 'Vitals', icon: 'favorite', badge: 3 },
    { id: 'medications', label: 'Medications', icon: 'local_pharmacy', badge: 0 },
    { id: 'appointments', label: 'Appointments', icon: 'event', badge: 2 },
    { id: 'lab-reports', label: 'Lab Reports', icon: 'assessment', badge: 1 },
    { id: 'clinical-notes', label: 'Clinical Notes', icon: 'note', badge: 0 },
    { id: 'care-plan', label: 'Care Plan', icon: 'date_range', badge: 0 },
    { id: 'rounds', label: 'Rounds', icon: 'access_time', badge: 0 },
    { id: 'medicine-requests', label: 'Medicine Requests', icon: 'healing', badge: 0 },
    { id: 'relatives', label: 'Relatives', icon: 'people', badge: 0 }
  ];

  selectedTab = 'overview';

  // Patient Data
  patientInfo: PatientInfo = {
    id: 'P001',
    name: 'Sarah Johnson',
    age: 34,
    gender: 'Female',
    bloodGroup: 'O+',
    contactNumber: '+1 (555) 123-4567',
    email: 'sarah.johnson@email.com',
    address: '123 Main Street, New York, NY 10001',
    emergencyContact: '+1 (555) 987-6543',
    emergencyContactRelation: 'Spouse',
    admissionStatus: 'OPD',
    primaryDoctor: 'Dr. Michael Chen',
    department: 'Cardiology',
    diagnosis: ['Hypertension', 'Type 2 Diabetes', 'Hyperlipidemia'],
    allergies: ['Penicillin', 'Sulfa drugs', 'Latex'],
    insuranceProvider: 'Blue Cross Blue Shield',
    insuranceNumber: 'BCBS123456789',
    insuranceExpiry: new Date('2025-12-31'),
    occupation: 'Software Engineer',
    maritalStatus: 'Married',
    nextOfKin: 'John Johnson (Spouse)',
    medicalHistory: ['Hypertension (2018)', 'Gestational Diabetes (2020)'],
    familyHistory: ['Father: Heart Disease', 'Mother: Diabetes'],
    lifestyle: {
      smoking: false,
      alcohol: false,
      exercise: 'Light walking 3x/week',
      diet: 'Low sodium, diabetic diet'
    }
  };

  // IPD Management Data
  ipdAdmissionDetails: IPDAdmissionDetails = {
    ward: '',
    room: '',
    bed: '',
    admissionDate: new Date(),
    attendingDoctor: '',
    expectedDischarge: new Date(),
    lengthOfStay: 0,
    daysLeft: 0
  };

  // Admission Form
  admissionForm!: FormGroup;

  // Form Options
  wardOptions = [
    'General Ward',
    'ICU',
    'Cardiac Ward',
    'Pediatric Ward',
    'Maternity Ward',
    'Surgical Ward'
  ];

  bedOptions = [
    'Bed A',
    'Bed B',
    'Bed C',
    'Bed D'
  ];

  doctorOptions = [
    'Dr. Michael Chen',
    'Dr. Sarah Smith',
    'Dr. Robert Johnson',
    'Dr. Emily Wilson',
    'Dr. David Brown'
  ];

  ipdVitalSigns: IPDVitalSigns = {
    pulse: 98,
    temperature: 37.2,
    bloodPressure: '120/80',
    spO2: 97,
    lastUpdated: new Date()
  };

  ipdCareSchedule: IPDCareSchedule[] = [
    {
      time: '4:00 PM',
      activity: 'Vital Check',
      description: 'Regular monitoring of vital signs',
      type: 'nursing',
      assignedTo: 'Nurse Williams',
      status: 'pending'
    },
    {
      time: '6:00 PM',
      activity: 'Antibiotics',
      description: 'IV Ceftriaxone 1g',
      type: 'medication',
      assignedTo: 'Nurse Johnson',
      status: 'pending'
    },
    {
      time: '7:30 PM',
      activity: 'Evening Rounds',
      description: 'By attending physician',
      type: 'doctor-visit',
      assignedTo: 'Dr. Williams',
      status: 'pending'
    }
  ];

  ipdQuickActions: IPDQuickAction[] = [
    {
      id: 'daily-rounds',
      label: 'Daily Rounds',
      icon: 'assessment',
      color: '#3b82f6',
      action: () => this.performDailyRounds()
    },
    {
      id: 'medication-order',
      label: 'Medication Order',
      icon: 'medication',
      color: '#10b981',
      action: () => this.orderMedication()
    },
    {
      id: 'record-vitals',
      label: 'Record Vitals',
      icon: 'favorite',
      color: '#06b6d4',
      action: () => this.recordVitals()
    },
    {
      id: 'care-plan',
      label: 'Care Plan',
      icon: 'people',
      color: '#6b7280',
      action: () => this.updateCarePlan()
    },
    {
      id: 'diet-order',
      label: 'Diet Order',
      icon: 'restaurant',
      color: '#f59e0b',
      action: () => this.orderDiet()
    },
    {
      id: 'discharge-patient',
      label: 'Discharge Patient',
      icon: 'exit_to_app',
      color: '#dc2626',
      action: () => this.dischargePatient()
    },
    {
      id: 'discharge-summary',
      label: 'Discharge Summary',
      icon: 'description',
      color: '#ef4444',
      action: () => this.generateDischargeSummary()
    }
  ];

  patientStats: PatientStats = {
    totalAppointments: 24,
    completedAppointments: 20,
    pendingAppointments: 4,
    cancelledAppointments: 2,
    totalPrescriptions: 15,
    activeMedications: 8,
    labReports: 12,
    abnormalLabReports: 3,
    vitalReadings: 45,
    clinicalNotes: 8,
    daysInHospital: 5,
    readmissionCount: 1
  };

  // Medications
  medications: PatientMedication[] = [
    {
      id: 'M001',
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      route: 'Oral',
      startDate: new Date('2024-01-20'),
      prescribedBy: 'Dr. Michael Chen',
      status: 'active',
      instructions: 'Take with meals to reduce stomach upset',
      sideEffects: ['Nausea', 'Diarrhea'],
      interactions: ['Alcohol may increase risk of lactic acidosis']
    },
    {
      id: 'M002',
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      route: 'Oral',
      startDate: new Date('2024-01-18'),
      prescribedBy: 'Dr. Michael Chen',
      status: 'active',
      instructions: 'Take in the morning',
      sideEffects: ['Dry cough', 'Dizziness'],
      interactions: ['NSAIDs may reduce effectiveness']
    },
    {
      id: 'M003',
      name: 'Atorvastatin',
      dosage: '20mg',
      frequency: 'Once daily',
      route: 'Oral',
      startDate: new Date('2024-01-16'),
      prescribedBy: 'Dr. Michael Chen',
      status: 'active',
      instructions: 'Take at bedtime',
      sideEffects: ['Muscle pain', 'Liver enzyme elevation'],
      interactions: ['Grapefruit juice may increase levels']
    }
  ];

  // Vital Signs
  vitalSigns: VitalSign[] = [
    {
      id: 'V001',
      type: 'Blood Pressure',
      value: 140,
      unit: 'mmHg',
      date: new Date('2024-01-20'),
      time: new Date('2024-01-20T08:00:00'),
      recordedBy: 'Nurse Sarah',
      notes: 'Systolic elevated',
      isNormal: false
    },
    {
      id: 'V002',
      type: 'Heart Rate',
      value: 72,
      unit: 'bpm',
      date: new Date('2024-01-20'),
      time: new Date('2024-01-20T08:00:00'),
      recordedBy: 'Nurse Sarah',
      isNormal: true
    },
    {
      id: 'V003',
      type: 'Temperature',
      value: 98.6,
      unit: '°F',
      date: new Date('2024-01-20'),
      time: new Date('2024-01-20T08:00:00'),
      recordedBy: 'Nurse Sarah',
      isNormal: true
    },
    {
      id: 'V004',
      type: 'Blood Glucose',
      value: 180,
      unit: 'mg/dL',
      date: new Date('2024-01-20'),
      time: new Date('2024-01-20T08:00:00'),
      recordedBy: 'Nurse Sarah',
      notes: 'Fasting glucose elevated',
      isNormal: false
    }
  ];

  // Lab Reports
  labReports: LabReport[] = [
    {
      id: 'L001',
      testName: 'Complete Blood Count',
      category: 'Hematology',
      result: 'Normal',
      normalRange: '4.5-11.0',
      unit: 'K/µL',
      date: new Date('2024-01-19'),
      status: 'completed',
      orderedBy: 'Dr. Michael Chen'
    },
    {
      id: 'L002',
      testName: 'HbA1c',
      category: 'Diabetes',
      result: '8.2',
      normalRange: '4.0-5.6',
      unit: '%',
      date: new Date('2024-01-19'),
      status: 'abnormal',
      orderedBy: 'Dr. Michael Chen',
      notes: 'Poor glycemic control'
    },
    {
      id: 'L003',
      testName: 'Lipid Panel',
      category: 'Cardiovascular',
      result: 'Elevated',
      normalRange: '<200',
      unit: 'mg/dL',
      date: new Date('2024-01-19'),
      status: 'abnormal',
      orderedBy: 'Dr. Michael Chen',
      notes: 'Total cholesterol 240 mg/dL'
    }
  ];

  // Appointments
  appointments: Appointment[] = [
    {
      id: 'A001',
      date: new Date('2024-01-22'),
      time: new Date('2024-01-22T10:00:00'),
      type: 'Follow-up',
      doctor: 'Dr. Michael Chen',
      department: 'Cardiology',
      status: 'scheduled',
      notes: 'Review medication effectiveness'
    },
    {
      id: 'A002',
      date: new Date('2024-01-25'),
      time: new Date('2024-01-25T14:00:00'),
      type: 'Consultation',
      doctor: 'Dr. Emily Rodriguez',
      department: 'Endocrinology',
      status: 'scheduled',
      notes: 'Diabetes management consultation'
    }
  ];

  // Clinical Notes
  clinicalNotes: ClinicalNote[] = [
    {
      id: 'C001',
      date: new Date('2024-01-20'),
      type: 'Progress Note',
      title: 'Daily Progress Note',
      content: 'Patient showing improvement in blood pressure control. Blood glucose levels remain elevated. Continue current medication regimen.',
      author: 'Dr. Michael Chen',
      tags: ['progress', 'medication'],
      isPrivate: false
    },
    {
      id: 'C002',
      date: new Date('2024-01-19'),
      type: 'Assessment',
      title: 'Initial Assessment',
      content: 'Patient admitted for uncontrolled hypertension and diabetes. Started on appropriate medications. Monitoring vital signs closely.',
      author: 'Dr. Michael Chen',
      tags: ['assessment', 'admission'],
      isPrivate: false
    }
  ];

  // Care Schedule
  careSchedule: CareTimetableItem[] = [
    {
      id: 1,
      type: 'medication',
      title: 'Morning Medication',
      description: 'Metformin 500mg, Lisinopril 10mg',
      assignee: 'Nurse Sarah',
      startTime: new Date('2024-01-20T08:00:00'),
      endTime: new Date('2024-01-20T08:30:00'),
      status: 'completed',
      priority: 'high'
    },
    {
      id: 2,
      type: 'vitals',
      title: 'Vital Signs Check',
      description: 'Blood pressure, heart rate, temperature, blood glucose',
      assignee: 'Nurse Mike',
      startTime: new Date('2024-01-20T09:00:00'),
      endTime: new Date('2024-01-20T09:15:00'),
      status: 'completed',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'consultation',
      title: 'Doctor Consultation',
      description: 'Review treatment progress and adjust medications',
      assignee: 'Dr. Michael Chen',
      startTime: new Date('2024-01-20T10:00:00'),
      endTime: new Date('2024-01-20T10:30:00'),
      status: 'scheduled',
      priority: 'high'
    },
    {
      id: 4,
      type: 'lab',
      title: 'Blood Test',
      description: 'Fasting blood glucose and HbA1c',
      assignee: 'Lab Technician',
      startTime: new Date('2024-01-20T11:00:00'),
      endTime: new Date('2024-01-20T11:30:00'),
      status: 'scheduled',
      priority: 'medium'
    }
  ];

  // Quick Actions
  quickActions: QuickAction[] = [
    {
      id: 'admit-patient',
      label: 'Admit Patient',
      icon: 'local_hospital',
      action: () => this.admitPatient(),
      color: 'primary',
      disabled: this.patientInfo.admissionStatus === 'IPD'
    },
    {
      id: 'add-note',
      label: 'Add Note',
      icon: 'note_add',
      action: () => this.addClinicalNote(),
      color: 'primary'
    },
    {
      id: 'schedule-appointment',
      label: 'Schedule Appointment',
      icon: 'event',
      action: () => this.scheduleAppointment(),
      color: 'accent'
    },
    {
      id: 'refer-patient',
      label: 'Refer Patient',
      icon: 'person_add',
      action: () => this.referPatient(),
      color: 'warn'
    },
    {
      id: 'order-lab',
      label: 'Order Lab Test',
      icon: 'add_shopping_cart',
      action: () => this.orderLabTest(),
      color: 'warn'
    },
    {
      id: 'prescribe-medication',
      label: 'Prescribe Medication',
      icon: 'local_pharmacy',
      action: () => this.prescribeMedication(),
      color: 'primary'
    }
  ];

  // Forms
  editForm: FormGroup;
  isEditing = false;
  isLoading = false;
  showDischargeDialog = false;
  showAdmissionDialog = false;

  // New Forms for Enhanced Features
  roundForm!: FormGroup;
  medicineRequestForm!: FormGroup;
  relativeForm!: FormGroup;
  prescriptionForm!: FormGroup;
  showRoundDialog = false;
  showMedicineRequestDialog = false;
  showRelativeDialog = false;
  showPrescriptionDialog = false;

  // Enhanced Data Properties
  patientRounds: PatientRound[] = [];
  roundSchedules: RoundSchedule[] = [];
  medicineRequests: MedicineRequest[] = [];
  patientRelatives: PatientRelative[] = [];

  // Chart Data
  vitalTrendsData = [
    { date: '2024-01-15', bp: 150, hr: 75, temp: 98.6, glucose: 200 },
    { date: '2024-01-16', bp: 145, hr: 72, temp: 98.4, glucose: 190 },
    { date: '2024-01-17', bp: 140, hr: 70, temp: 98.5, glucose: 185 },
    { date: '2024-01-18', bp: 138, hr: 71, temp: 98.3, glucose: 180 },
    { date: '2024-01-19', bp: 135, hr: 69, temp: 98.4, glucose: 175 },
    { date: '2024-01-20', bp: 140, hr: 72, temp: 98.6, glucose: 180 }
  ];

  medicineChartData = [
    { name: 'Metformin', y: 30, color: '#3b82f6' },
    { name: 'Lisinopril', y: 25, color: '#10b981' },
    { name: 'Atorvastatin', y: 20, color: '#f59e0b' },
    { name: 'Aspirin', y: 15, color: '#ef4444' },
    { name: 'Others', y: 10, color: '#8b5cf6' }
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly customEventsService: CustomEventsService,
    private readonly dialog: MatDialog
  ) {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0), Validators.max(150)]],
      gender: ['', Validators.required],
      bloodGroup: ['', Validators.required],
      contactNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      emergencyContact: ['', Validators.required],
      emergencyContactRelation: ['', Validators.required],
      primaryDoctor: ['', Validators.required],
      department: ['', Validators.required],
      diagnosis: [''],
      allergies: [''],
      insuranceProvider: [''],
      insuranceNumber: [''],
      occupation: [''],
      maritalStatus: [''],
      nextOfKin: ['']
    });

    this.customEventsService.breadcrumbEvent.emit(
      {
        isAppend:true,
        breadcrum: [
          {
            title: 'John Doe',
            url: '/patient-profile'
          }
        ]
      }
    );
  }

  ngOnInit(): void {
    // Get patient data from query parameters
    this.route.queryParams.subscribe(params => {
      const patientId = params['patientId'];
      const patientName = params['patientName'];
      
      if (patientId && patientName) {
        // Update patient info with the selected patient
        this.patientInfo.name = patientName;
        this.patientInfo.id = `P${patientId.toString().padStart(3, '0')}`;
        
        // You could also load patient data from a service here
        console.log('Loading patient:', patientId, patientName);
      }
    });

    this.initializeForm();
    this.initializeAdmissionForm();
    this.initializeEnhancedForms();
    this.loadEnhancedData();
    this.updateTabBadges();
    this.initializeSearchData();
    this.initializeNotifications();
    this.initializeCareTeam();
    this.initializeVitalTrends();
    this.startRealTimeUpdates();
  }

  initializeForm(): void {
    this.editForm.patchValue({
      name: this.patientInfo.name,
      age: this.patientInfo.age,
      gender: this.patientInfo.gender,
      bloodGroup: this.patientInfo.bloodGroup,
      contactNumber: this.patientInfo.contactNumber,
      email: this.patientInfo.email,
      address: this.patientInfo.address,
      emergencyContact: this.patientInfo.emergencyContact,
      emergencyContactRelation: this.patientInfo.emergencyContactRelation,
      primaryDoctor: this.patientInfo.primaryDoctor,
      department: this.patientInfo.department,
      diagnosis: this.patientInfo.diagnosis.join(', '),
      allergies: this.patientInfo.allergies.join(', '),
      insuranceProvider: this.patientInfo.insuranceProvider,
      insuranceNumber: this.patientInfo.insuranceNumber,
      occupation: this.patientInfo.occupation,
      maritalStatus: this.patientInfo.maritalStatus,
      nextOfKin: this.patientInfo.nextOfKin
    });
  }

  initializeAdmissionForm(): void {
    this.admissionForm = this.fb.group({
      ward: ['General Ward', Validators.required],
      room: ['301', Validators.required],
      bed: ['Bed A', Validators.required],
      attendingDoctor: ['Dr. Michael Chen', Validators.required]
    });
  }

  updateTabBadges(): void {
    // Update badges based on data
    this.tabs.find(t => t.id === 'vitals')!.badge = this.vitalSigns.filter(v => !v.isNormal).length;
    this.tabs.find(t => t.id === 'appointments')!.badge = this.appointments.filter(a => a.status === 'scheduled').length;
    this.tabs.find(t => t.id === 'lab-reports')!.badge = this.labReports.filter(l => l.status === 'abnormal').length;
  }

  onTabChange(tabId: string): void {
    this.selectedTab = tabId;
  }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.initializeForm();
    }
  }

  saveChanges(): void {
    if (this.editForm.valid) {
      this.isLoading = true;
      
      // Simulate API call
      setTimeout(() => {
        const formValue = this.editForm.value;
        this.patientInfo = {
          ...this.patientInfo,
          name: formValue.name,
          age: formValue.age,
          gender: formValue.gender,
          bloodGroup: formValue.bloodGroup,
          contactNumber: formValue.contactNumber,
          email: formValue.email,
          address: formValue.address,
          emergencyContact: formValue.emergencyContact,
          emergencyContactRelation: formValue.emergencyContactRelation,
          primaryDoctor: formValue.primaryDoctor,
          department: formValue.department,
          diagnosis: formValue.diagnosis.split(',').map((d: string) => d.trim()),
          allergies: formValue.allergies.split(',').map((a: string) => a.trim()),
          insuranceProvider: formValue.insuranceProvider,
          insuranceNumber: formValue.insuranceNumber,
          occupation: formValue.occupation,
          maritalStatus: formValue.maritalStatus,
          nextOfKin: formValue.nextOfKin
        };
        
        this.isEditing = false;
        this.isLoading = false;
      }, 1000);
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.initializeForm();
  }

  toggleAdmissionStatus(): void {
    if (this.patientInfo.admissionStatus === 'IPD') {
      this.patientInfo.admissionStatus = 'OPD';
    } else if (this.patientInfo.admissionStatus === 'OPD') {
      this.patientInfo.admissionStatus = 'IPD';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in-progress': return '#f59e0b';
      case 'scheduled': return '#3b82f6';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'completed': return 'check_circle';
      case 'in-progress': return 'pending';
      case 'scheduled': return 'schedule';
      case 'cancelled': return 'cancel';
      default: return 'help';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'urgent': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  }

  getCurrentTabLabel(): string {
    const currentTab = this.tabs.find(tab => tab.id === this.selectedTab);
    return currentTab ? currentTab.label : 'Unknown';
  }

  // Quick Action Methods
  addClinicalNote(): void {
    console.log('Add clinical note');
    // Implementation for adding clinical note
  }

  scheduleAppointment(): void {
    const appointmentDialogRef = this.dialog.open(AppointmentBookingComponent, {
      data: {
        patientId: this.patientInfo.id,
        patientName: this.patientInfo.name,
        doctorId: 'DOC001', // Current doctor ID
        doctorName: this.patientInfo.primaryDoctor,
        doctorSpecialization: 'General Medicine',
        doctorHospital: 'Shree Clinic',
        doctorLocation: 'Texas, United States',
        doctorImage: 'assets/avatars/default-avatar.jpg',
        isReferral: false
      },
      width: '90%',
      maxWidth: '800px',
      height: '90%',
      maxHeight: '90vh',
      autoFocus: false,
      disableClose: false
    });

    appointmentDialogRef.afterClosed().subscribe((result) => {
      if (result && result.action === 'book') {
        console.log('Appointment scheduled:', result.appointment);
        // You can add a success message or notification here
      }
    });
  }

  referPatient(): void {
    const dialogRef = this.dialog.open(DoctorSearchDialogComponent, {
      data: {
        patientId: this.patientInfo.id,
        patientName: this.patientInfo.name,
        currentDoctorId: this.patientInfo.primaryDoctor
      },
      width: '90%',
      maxWidth: '1200px',
      height: '90%',
      maxHeight: '90vh',
      autoFocus: false,
      disableClose: false
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.action === 'refer') {
        this.openAppointmentDialog(result.doctor, result.patientId, result.patientName);
      }
    });
  }

  private openAppointmentDialog(doctor: any, patientId: string, patientName: string): void {
    const appointmentDialogRef = this.dialog.open(AppointmentBookingComponent, {
      data: {
        patientId: patientId,
        patientName: patientName,
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorSpecialization: doctor.specialization,
        doctorHospital: doctor.hospital,
        doctorLocation: 'Texas, United States', // You can get this from doctor data
        doctorImage: doctor.profileImageUrl,
        isReferral: true,
        referringDoctor: this.patientInfo.primaryDoctor
      },
      width: '90%',
      maxWidth: '800px',
      height: '90%',
      maxHeight: '90vh',
      autoFocus: false,
      disableClose: false
    });

    appointmentDialogRef.afterClosed().subscribe((result) => {
      if (result && result.action === 'book') {
        console.log('Appointment booked for referral:', result.appointment);
        // You can add a success message or notification here
        // this.showSuccessMessage(`Patient ${patientName} has been referred to ${doctor.name}`);
      }
    });
  }

  orderLabTest(): void {
    console.log('Order lab test');
    // Implementation for ordering lab test
  }

  prescribeMedication(): void {
    console.log('Prescribe medication');
    this.showPrescriptionDialog = true;
  }

  cancelPrescription(): void {
    this.showPrescriptionDialog = false;
    this.prescriptionForm.reset();
  }

  submitPrescription(): void {
    if (this.prescriptionForm.valid) {
      const prescriptionData = {
        ...this.prescriptionForm.value,
        patientId: this.patientInfo.id,
        patientName: this.patientInfo.name,
        doctorId: 'current-doctor-id', // This should come from auth service
        doctorName: 'Dr. Current Doctor', // This should come from auth service
        prescriptionDate: new Date(),
        status: 'ACTIVE'
      };

      console.log('Prescription submitted:', prescriptionData);
      
      // Here you would typically send the prescription to your backend service
      // this.prescriptionService.createPrescription(prescriptionData).subscribe({
      //   next: (response) => {
      //     console.log('Prescription created successfully:', response);
      //     this.showPrescriptionDialog = false;
      //     this.prescriptionForm.reset();
      //     // Show success message
      //   },
      //   error: (error) => {
      //     console.error('Error creating prescription:', error);
      //     // Show error message
      //   }
      // });

      // For now, just close the dialog
      this.showPrescriptionDialog = false;
      this.prescriptionForm.reset();
      
      // Show success message (you can implement a toast service)
      alert('Prescription created successfully!');
    } else {
      console.log('Form is invalid');
      // Mark all fields as touched to show validation errors
      Object.keys(this.prescriptionForm.controls).forEach(key => {
        this.prescriptionForm.get(key)?.markAsTouched();
      });
    }
  }

  onBreadcrumbClick(): void {
    this.router.navigate(['/patients']);
  }

  // Utility Methods
  getDaysInHospital(): number {
    if (!this.patientInfo.admissionDate) return 0;
    const today = new Date();
    const admissionDate = new Date(this.patientInfo.admissionDate);
    const diffTime = Math.abs(today.getTime() - admissionDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getLatestVitalSign(type: string): VitalSign | null {
    const vital = this.vitalSigns
      .filter(v => v.type === type)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    return vital || null;
  }

  getAbnormalVitalSigns(): VitalSign[] {
    return this.vitalSigns.filter(v => !v.isNormal);
  }

  getUpcomingAppointments(): Appointment[] {
    return this.appointments
      .filter(a => a.status === 'scheduled' && new Date(a.date) > new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  getActiveMedications(): PatientMedication[] {
    return this.medications.filter(m => m.status === 'active');
  }

  getAbnormalLabReports(): LabReport[] {
    return this.labReports.filter(l => l.status === 'abnormal');
  }

  // IPD Management Methods
  performDailyRounds(): void {
    console.log('Performing daily rounds');
    // Implementation for daily rounds
  }

  orderMedication(): void {
    console.log('Ordering medication');
    // Implementation for ordering medication
  }

  recordVitals(): void {
    console.log('Recording vitals');
    // Implementation for recording vitals
  }

  updateCarePlan(): void {
    console.log('Updating care plan');
    // Implementation for updating care plan
  }

  orderDiet(): void {
    console.log('Ordering diet');
    // Implementation for ordering diet
  }

  generateDischargeSummary(): void {
    console.log('Generating discharge summary');
    // Implementation for generating discharge summary
  }

  // Admission and Discharge Methods
  admitPatient(): void {
    this.showAdmissionDialog = true;
    this.initializeAdmissionForm();
  }

  confirmAdmission(): void {
    if (this.admissionForm.valid) {
      const formValue = this.admissionForm.value;
      
      this.patientInfo.admissionStatus = 'IPD';
      this.patientInfo.admissionDate = new Date();
      this.patientInfo.roomNumber = formValue.room;
      this.patientInfo.bedNumber = formValue.bed;
      this.viewMode = 'ipd';
      this.showAdmissionDialog = false;
      
      // Update IPD admission details with form data
      this.ipdAdmissionDetails = {
        admissionDate: new Date(),
        ward: formValue.ward,
        room: formValue.room,
        bed: formValue.bed,
        attendingDoctor: formValue.attendingDoctor,
        expectedDischarge: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        lengthOfStay: 0,
        daysLeft: 7
      };
    }
  }

  cancelAdmission(): void {
    this.showAdmissionDialog = false;
  }

  dischargePatient(): void {
    this.showDischargeDialog = true;
  }

  confirmDischarge(): void {
    this.patientInfo.admissionStatus = 'OPD';
    this.patientInfo.dischargeDate = new Date();
    this.viewMode = 'profile';
    this.showDischargeDialog = false;
    
    // Reset IPD admission details
    this.ipdAdmissionDetails = {
      ward: '',
      room: '',
      bed: '',
      admissionDate: new Date(),
      attendingDoctor: '',
      expectedDischarge: new Date(),
      lengthOfStay: 0,
      daysLeft: 0
    };
  }

  cancelDischarge(): void {
    this.showDischargeDialog = false;
  }

  // View Mode Management
  switchToIPDView(): void {
    this.viewMode = 'ipd';
  }

  switchToProfileView(): void {
    this.viewMode = 'profile';
  }

  // IPD Utility Methods
  getTypeIcon(type: string): string {
    switch (type) {
      case 'nursing': return 'medical_services';
      case 'medication': return 'medication';
      case 'doctor-visit': return 'person';
      case 'lab': return 'science';
      case 'diet': return 'restaurant';
      default: return 'schedule';
    }
  }

  getTypeColor(type: string): string {
    switch (type) {
      case 'nursing': return '#3b82f6';
      case 'medication': return '#10b981';
      case 'doctor-visit': return '#8b5cf6';
      case 'lab': return '#f59e0b';
      case 'diet': return '#ef4444';
      default: return '#6b7280';
    }
  }

  // IPD Schedule Methods
  addSchedule(): void {
    console.log('Adding new schedule item');
    // Implementation for adding schedule
  }

  viewFullSchedule(): void {
    console.log('Viewing full schedule');
    // Implementation for viewing full schedule
  }

  // Utility Methods
  getCurrentDate(): Date {
    return new Date();
  }

  // Search Methods
  initializeSearchData(): void {
    // Initialize search data
  }

  onSearchInput(): void {
    if (this.searchQuery.trim()) {
      this.performSearch();
    } else {
      this.searchResults = [];
    }
  }

  performSearch(): void {
    const query = this.searchQuery.toLowerCase();
    this.searchResults = [];
    
    // Search in medications
    this.medications.forEach(med => {
      if (med.name.toLowerCase().includes(query)) {
        this.searchResults.push({
          id: med.id,
          text: med.name,
          category: 'Medication',
          icon: 'medication',
          action: () => this.navigateToTab('medications')
        });
      }
    });

    // Search in vital signs
    this.vitalSigns.forEach(vital => {
      if (vital.type.toLowerCase().includes(query)) {
        this.searchResults.push({
          id: vital.id,
          text: vital.type,
          category: 'Vital Signs',
          icon: 'favorite',
          action: () => this.navigateToTab('vitals')
        });
      }
    });

    // Search in clinical notes
    this.clinicalNotes.forEach(note => {
      if (note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query)) {
        this.searchResults.push({
          id: note.id,
          text: note.title,
          category: 'Clinical Notes',
          icon: 'note',
          action: () => this.navigateToTab('clinical-notes')
        });
      }
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
  }

  navigateToSearchResult(result: SearchResult): void {
    result.action();
    this.clearSearch();
  }

  navigateToTab(tabId: string): void {
    this.selectedTab = tabId;
  }

  // Notification Methods
  initializeNotifications(): void {
    this.notifications = [
      {
        id: '1',
        title: 'Abnormal Vital Signs',
        message: 'Blood pressure reading is elevated',
        type: 'warning',
        icon: 'warning',
        color: '#f59e0b',
        time: new Date(),
        read: false,
        action: () => this.navigateToTab('vitals')
      },
      {
        id: '2',
        title: 'Medication Due',
        message: 'Metformin 500mg is due in 30 minutes',
        type: 'info',
        icon: 'medication',
        color: '#3b82f6',
        time: new Date(Date.now() - 300000),
        read: false,
        action: () => this.navigateToTab('medications')
      },
      {
        id: '3',
        title: 'Lab Results Ready',
        message: 'New lab results available for review',
        type: 'success',
        icon: 'science',
        color: '#10b981',
        time: new Date(Date.now() - 600000),
        read: true,
        action: () => this.navigateToTab('lab-reports')
      }
    ];
    this.updateUnreadNotifications();
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  markNotificationRead(notification: Notification): void {
    notification.read = true;
    this.updateUnreadNotifications();
  }

  handleNotificationAction(notification: Notification): void {
    if (notification.action) {
      notification.action();
    }
    this.markNotificationRead(notification);
  }

  updateUnreadNotifications(): void {
    this.unreadNotifications = this.notifications.filter(n => !n.read).length;
  }

  // Care Team Methods
  initializeCareTeam(): void {
    this.careTeam = [
      {
        id: '1',
        name: 'Dr. Sarah Johnson',
        role: 'Attending Physician',
        department: 'Cardiology',
        color: '#3b82f6',
        phone: '+1-555-0123',
        email: 'sarah.johnson@hospital.com',
        availability: 'available'
      },
      {
        id: '2',
        name: 'Nurse Williams',
        role: 'Primary Nurse',
        department: 'Cardiology',
        color: '#10b981',
        phone: '+1-555-0124',
        email: 'nurse.williams@hospital.com',
        availability: 'available'
      },
      {
        id: '3',
        name: 'Dr. Michael Chen',
        role: 'Consultant',
        department: 'Endocrinology',
        color: '#f59e0b',
        phone: '+1-555-0125',
        email: 'michael.chen@hospital.com',
        availability: 'busy'
      },
      {
        id: '4',
        name: 'Nurse Johnson',
        role: 'Charge Nurse',
        department: 'Cardiology',
        color: '#ef4444',
        phone: '+1-555-0126',
        email: 'nurse.johnson@hospital.com',
        availability: 'available'
      }
    ];
  }

  viewFullCareTeam(): void {
    this.showCareTeamDialog = true;
  }

  closeCareTeamDialog(): void {
    this.showCareTeamDialog = false;
  }

  contactTeamMember(member: CareTeamMember): void {
    console.log('Contacting:', member.name);
    // Implementation for contacting team member
  }

  messageTeamMember(member: CareTeamMember): void {
    console.log('Messaging:', member.name);
    // Implementation for messaging team member
  }

  // Vital Signs Methods
  initializeVitalTrends(): void {
    this.vitalTrends = [
      { type: 'pulse', current: 98, previous: 95, trend: 'up', change: 3 },
      { type: 'temperature', current: 37.2, previous: 37.0, trend: 'up', change: 0.2 },
      { type: 'bp', current: 120, previous: 118, trend: 'up', change: 2 },
      { type: 'spO2', current: 97, previous: 98, trend: 'down', change: -1 }
    ];
  }

  isVitalAbnormal(type: string, value: number | string): boolean {
    if (type === 'bp' && typeof value === 'string') {
      // Handle blood pressure as string (e.g., "120/80")
      const bpParts = value.split('/');
      if (bpParts.length === 2) {
        const systolic = parseInt(bpParts[0]);
        const diastolic = parseInt(bpParts[1]);
        return systolic > 140 || systolic < 90 || diastolic > 90 || diastolic < 60;
      }
      return false;
    }

    // Handle numeric values
    const numericValue = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(numericValue)) return false;

    const ranges = {
      pulse: { min: 60, max: 100 },
      temperature: { min: 36.5, max: 37.5 },
      spO2: { min: 95, max: 100 }
    };
    
    const range = ranges[type as keyof typeof ranges];
    return range ? numericValue < range.min || numericValue > range.max : false;
  }

  getVitalTrend(type: string): string | null {
    const trend = this.vitalTrends.find(t => t.type === type);
    if (!trend) return null;
    
    const changePrefix = trend.change > 0 ? '+' : '';
    return `${changePrefix}${trend.change}`;
  }

  getVitalTrendIcon(type: string): string {
    const trend = this.vitalTrends.find(t => t.type === type);
    if (!trend) return 'trending_flat';
    
    switch (trend.trend) {
      case 'up': return 'trending_up';
      case 'down': return 'trending_down';
      default: return 'trending_flat';
    }
  }

  refreshVitals(): void {
    // Simulate real-time vital signs update
    this.ipdVitalSigns = {
      pulse: Math.floor(Math.random() * 20) + 70,
      temperature: 36.5 + Math.random() * 1.5,
      bloodPressure: `${Math.floor(Math.random() * 40) + 100}/${Math.floor(Math.random() * 20) + 60}`,
      spO2: Math.floor(Math.random() * 5) + 95,
      lastUpdated: new Date()
    };
    this.initializeVitalTrends();
  }

  setChartPeriod(period: '24h' | '7d'): void {
    this.chartPeriod = period;
    // Implementation for updating chart data
  }



  startRealTimeUpdates(): void {
    // Simulate real-time updates every 30 seconds
    setInterval(() => {
      if (this.viewMode === 'ipd') {
        this.refreshVitals();
      }
    }, 30000);
  }

  // Enhanced Features Methods
  initializeEnhancedForms(): void {
    this.roundForm = this.fb.group({
      roundType: ['DOCTOR_ROUND', Validators.required],
      performedBy: ['', Validators.required],
      performedByRole: ['DOCTOR', Validators.required],
      roundDate: [new Date(), Validators.required],
      roundTime: [new Date(), Validators.required],
      status: ['COMPLETED', Validators.required],
      priority: ['MEDIUM', Validators.required],
      notes: [''],
      observations: [''],
      vitalSigns: this.fb.group({
        bloodPressure: [''],
        heartRate: [''],
        temperature: [''],
        respiratoryRate: [''],
        oxygenSaturation: [''],
        painLevel: ['']
      }),
      medications: [''],
      careInstructions: [''],
      nextRoundScheduled: [''],
      isCritical: [false],
      requiresFollowUp: [false],
      followUpNotes: ['']
    });

    this.medicineRequestForm = this.fb.group({
      requestedBy: ['Patient', Validators.required],
      requestedByRole: ['PATIENT', Validators.required],
      medicineName: ['', Validators.required],
      dosage: ['', Validators.required],
      frequency: ['', Validators.required],
      route: ['', Validators.required],
      quantity: ['', Validators.required],
      urgency: ['MEDIUM', Validators.required],
      reason: ['', Validators.required],
      currentSymptoms: [''],
      notes: [''],
      isPrescriptionRequired: [true]
    });

    this.relativeForm = this.fb.group({
      relativeName: ['', Validators.required],
      relationship: ['', Validators.required],
      contactNumber: ['', Validators.required],
      alternateContactNumber: [''],
      email: [''],
      address: [''],
      emergencyContact: [false],
      canMakeDecisions: [false],
      canReceiveUpdates: [true],
      canVisit: [true],
      visitingHours: this.fb.group({
        startTime: [''],
        endTime: [''],
        days: [[]]
      }),
      notes: ['']
    });

    this.prescriptionForm = this.fb.group({
      medicineName: ['', Validators.required],
      dosage: ['', Validators.required],
      frequency: ['', Validators.required],
      route: ['', Validators.required],
      duration: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      instructions: [''],
      isSubstitutable: [false],
      diagnosis: ['', Validators.required],
      notes: [''],
      followUpDate: ['']
    });
  }

  loadEnhancedData(): void {
    // Load patient rounds
    this.patientRounds = [
      {
        id: 'R001',
        patientId: this.patientInfo.id,
        roundType: 'DOCTOR_ROUND',
        performedBy: 'Dr. Sarah Johnson',
        performedById: 'DOC001',
        performedByRole: 'DOCTOR',
        roundDate: new Date(),
        roundTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'COMPLETED',
        priority: 'HIGH',
        notes: 'Patient showing improvement. Vital signs stable. Continue current treatment.',
        observations: ['Patient alert and responsive', 'No signs of respiratory distress', 'Pain level decreased'],
        vitalSigns: {
          bloodPressure: '120/80',
          heartRate: 75,
          temperature: 36.8,
          respiratoryRate: 18,
          oxygenSaturation: 98,
          painLevel: 3
        },
        medications: [
          {
            medicationName: 'Metformin',
            dosage: '500mg',
            route: 'Oral',
            time: new Date(),
            status: 'GIVEN',
            notes: 'Taken with breakfast'
          }
        ],
        careInstructions: ['Continue current medication', 'Monitor vital signs every 4 hours', 'Encourage mobility'],
        nextRoundScheduled: new Date(Date.now() + 4 * 60 * 60 * 1000),
        isCritical: false,
        requiresFollowUp: true,
        followUpNotes: 'Schedule follow-up appointment in 1 week'
      },
      {
        id: 'R002',
        patientId: this.patientInfo.id,
        roundType: 'NURSE_ROUND',
        performedBy: 'Nurse Williams',
        performedById: 'NURSE001',
        performedByRole: 'NURSE',
        roundDate: new Date(),
        roundTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
        status: 'COMPLETED',
        priority: 'MEDIUM',
        notes: 'Patient comfortable. No complaints. Medications administered on time.',
        observations: ['Patient resting comfortably', 'No pain complaints', 'Appetite good'],
        vitalSigns: {
          bloodPressure: '118/78',
          heartRate: 72,
          temperature: 36.6,
          respiratoryRate: 16,
          oxygenSaturation: 99,
          painLevel: 2
        },
        medications: [
          {
            medicationName: 'Lisinopril',
            dosage: '10mg',
            route: 'Oral',
            time: new Date(),
            status: 'GIVEN',
            notes: 'Taken as prescribed'
          }
        ],
        careInstructions: ['Continue monitoring', 'Encourage fluid intake', 'Assist with mobility'],
        nextRoundScheduled: new Date(Date.now() + 2 * 60 * 60 * 1000),
        isCritical: false,
        requiresFollowUp: false
      }
    ];

    // Load medicine requests
    this.medicineRequests = [
      {
        id: 'MR001',
        patientId: this.patientInfo.id,
        patientName: this.patientInfo.name,
        requestedBy: 'Patient',
        requestedById: this.patientInfo.id,
        requestedByRole: 'PATIENT',
        requestDate: new Date(),
        requestTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
        medicineName: 'Pain Relief',
        dosage: '500mg',
        frequency: 'As needed',
        route: 'Oral',
        quantity: 10,
        urgency: 'MEDIUM',
        reason: 'Headache and body pain',
        currentSymptoms: ['Headache', 'Body aches'],
        status: 'APPROVED',
        approvedBy: 'Dr. Sarah Johnson',
        approvedById: 'DOC001',
        approvedDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
        notes: 'Approved for pain management',
        isPrescriptionRequired: true,
        prescriptionId: 'RX001',
        pharmacyNotes: 'Dispensed successfully',
        cost: 25.50,
        insuranceCovered: true
      }
    ];

    // Load patient relatives
    this.patientRelatives = [
      {
        id: 'REL001',
        patientId: this.patientInfo.id,
        patientName: this.patientInfo.name,
        relativeName: 'John Johnson',
        relationship: 'SPOUSE',
        contactNumber: '+1-555-0123',
        alternateContactNumber: '+1-555-0124',
        email: 'john.johnson@email.com',
        address: '123 Main Street, New York, NY 10001',
        emergencyContact: true,
        canMakeDecisions: true,
        canReceiveUpdates: true,
        canVisit: true,
        visitingHours: {
          startTime: '09:00',
          endTime: '21:00',
          days: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
        },
        addedBy: 'Dr. Sarah Johnson',
        addedDate: new Date(),
        lastContactDate: new Date(Date.now() - 1 * 60 * 60 * 1000),
        notes: 'Primary emergency contact',
        isActive: true,
        verificationStatus: 'VERIFIED',
        verificationNotes: 'Contact verified via phone call'
      },
      {
        id: 'REL002',
        patientId: this.patientInfo.id,
        patientName: this.patientInfo.name,
        relativeName: 'Mary Johnson',
        relationship: 'CHILD',
        contactNumber: '+1-555-0125',
        email: 'mary.johnson@email.com',
        address: '456 Oak Avenue, New York, NY 10002',
        emergencyContact: false,
        canMakeDecisions: false,
        canReceiveUpdates: true,
        canVisit: true,
        visitingHours: {
          startTime: '10:00',
          endTime: '20:00',
          days: ['SATURDAY', 'SUNDAY']
        },
        addedBy: 'Dr. Sarah Johnson',
        addedDate: new Date(),
        notes: 'Daughter - weekend visits only',
        isActive: true,
        verificationStatus: 'VERIFIED',
        verificationNotes: 'Contact verified via email'
      }
    ];

    // Load round schedules
    this.roundSchedules = [
      {
        id: 'RS001',
        patientId: this.patientInfo.id,
        roundType: 'DOCTOR_ROUND',
        scheduledTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
        frequency: 'DAILY',
        assignedTo: 'Dr. Sarah Johnson',
        assignedToId: 'DOC001',
        assignedToRole: 'DOCTOR',
        priority: 'HIGH',
        isActive: true,
        createdBy: 'Dr. Sarah Johnson',
        createdDate: new Date(),
        lastPerformed: new Date(Date.now() - 2 * 60 * 60 * 1000),
        nextScheduled: new Date(Date.now() + 4 * 60 * 60 * 1000)
      },
      {
        id: 'RS002',
        patientId: this.patientInfo.id,
        roundType: 'NURSE_ROUND',
        scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        frequency: 'EVERY_4_HOURS',
        assignedTo: 'Nurse Williams',
        assignedToId: 'NURSE001',
        assignedToRole: 'NURSE',
        priority: 'MEDIUM',
        isActive: true,
        createdBy: 'Dr. Sarah Johnson',
        createdDate: new Date(),
        lastPerformed: new Date(Date.now() - 1 * 60 * 60 * 1000),
        nextScheduled: new Date(Date.now() + 2 * 60 * 60 * 1000)
      }
    ];
  }

  // Round Management Methods
  addNewRound(): void {
    this.roundForm.patchValue({
      performedBy: 'Dr. Sarah Johnson',
      performedByRole: 'DOCTOR',
      roundDate: new Date(),
      roundTime: new Date()
    });
    this.showRoundDialog = true;
  }

  completeRound(): void {
    if (this.roundForm.valid) {
      const roundData = this.roundForm.value;
      const newRound: PatientRound = {
        id: `R${Date.now()}`,
        patientId: this.patientInfo.id,
        ...roundData,
        performedById: 'DOC001',
        observations: roundData.observations ? roundData.observations.split(',').map((o: string) => o.trim()) : [],
        medications: [],
        careInstructions: roundData.careInstructions ? roundData.careInstructions.split(',').map((c: string) => c.trim()) : [],
        isCritical: roundData.isCritical || false,
        requiresFollowUp: roundData.requiresFollowUp || false
      };

      this.patientRounds.unshift(newRound);
      this.showRoundDialog = false;
      this.roundForm.reset();
      this.updateTabBadges();
    }
  }

  cancelRound(): void {
    this.showRoundDialog = false;
    this.roundForm.reset();
  }

  // Medicine Request Methods
  addMedicineRequest(): void {
    this.medicineRequestForm.patchValue({
      requestedBy: 'Patient',
      requestedByRole: 'PATIENT',
      requestDate: new Date(),
      requestTime: new Date()
    });
    this.showMedicineRequestDialog = true;
  }

  submitMedicineRequest(): void {
    if (this.medicineRequestForm.valid) {
      const requestData = this.medicineRequestForm.value;
      const newRequest: MedicineRequest = {
        id: `MR${Date.now()}`,
        patientId: this.patientInfo.id,
        patientName: this.patientInfo.name,
        ...requestData,
        requestedById: this.patientInfo.id,
        requestDate: new Date(),
        requestTime: new Date(),
        currentSymptoms: requestData.currentSymptoms ? requestData.currentSymptoms.split(',').map((s: string) => s.trim()) : [],
        status: 'PENDING',
        isPrescriptionRequired: requestData.isPrescriptionRequired || true
      };

      this.medicineRequests.unshift(newRequest);
      this.showMedicineRequestDialog = false;
      this.medicineRequestForm.reset();
      this.updateTabBadges();
    }
  }

  cancelMedicineRequest(): void {
    this.showMedicineRequestDialog = false;
    this.medicineRequestForm.reset();
  }

  approveMedicineRequest(request: MedicineRequest): void {
    request.status = 'APPROVED';
    request.approvedBy = 'Dr. Sarah Johnson';
    request.approvedById = 'DOC001';
    request.approvedDate = new Date();
  }

  rejectMedicineRequest(request: MedicineRequest): void {
    request.status = 'REJECTED';
    request.rejectionReason = 'Not medically necessary at this time';
  }

  // Relative Management Methods
  addRelative(): void {
    this.relativeForm.patchValue({
      addedBy: 'Dr. Sarah Johnson',
      addedDate: new Date(),
      isActive: true,
      verificationStatus: 'PENDING'
    });
    this.showRelativeDialog = true;
  }

  addRelativeSubmit(): void {
    if (this.relativeForm.valid) {
      const relativeData = this.relativeForm.value;
      const newRelative: PatientRelative = {
        id: `REL${Date.now()}`,
        patientId: this.patientInfo.id,
        patientName: this.patientInfo.name,
        ...relativeData,
        addedBy: 'Dr. Sarah Johnson',
        addedDate: new Date(),
        isActive: true,
        verificationStatus: 'PENDING',
        verificationNotes: 'Pending verification'
      };

      this.patientRelatives.push(newRelative);
      this.showRelativeDialog = false;
      this.relativeForm.reset();
      this.updateTabBadges();
    }
  }

  cancelRelative(): void {
    this.showRelativeDialog = false;
    this.relativeForm.reset();
  }

  contactRelative(relative: PatientRelative): void {
    console.log('Contacting relative:', relative.relativeName, 'at', relative.contactNumber);
    // Implementation for contacting relative
  }

  verifyRelative(relative: PatientRelative): void {
    relative.verificationStatus = 'VERIFIED';
    relative.verificationNotes = 'Verified via phone call';
    relative.lastContactDate = new Date();
  }

  // Utility Methods for Enhanced Features
  getRoundTypeIcon(roundType: string): string {
    switch (roundType) {
      case 'DOCTOR_ROUND': return 'person';
      case 'NURSE_ROUND': return 'medical_services';
      case 'CLEANING_ROUND': return 'cleaning_services';
      case 'DIET_ROUND': return 'restaurant';
      case 'PHYSIOTHERAPY_ROUND': return 'fitness_center';
      default: return 'assessment';
    }
  }

  getRoundTypeColor(roundType: string): string {
    switch (roundType) {
      case 'DOCTOR_ROUND': return '#3b82f6';
      case 'NURSE_ROUND': return '#10b981';
      case 'CLEANING_ROUND': return '#6b7280';
      case 'DIET_ROUND': return '#f59e0b';
      case 'PHYSIOTHERAPY_ROUND': return '#8b5cf6';
      default: return '#6b7280';
    }
  }

  getMedicineRequestStatusColor(status: string): string {
    switch (status) {
      case 'PENDING': return '#f59e0b';
      case 'APPROVED': return '#10b981';
      case 'REJECTED': return '#ef4444';
      case 'DISPENSED': return '#3b82f6';
      case 'CANCELLED': return '#6b7280';
      default: return '#6b7280';
    }
  }

  getRelativeRelationshipIcon(relationship: string): string {
    switch (relationship) {
      case 'SPOUSE': return 'favorite';
      case 'PARENT': return 'family_restroom';
      case 'CHILD': return 'child_care';
      case 'SIBLING': return 'group';
      case 'GRANDPARENT': return 'elderly';
      case 'GRANDCHILD': return 'child_friendly';
      case 'FRIEND': return 'person';
      case 'GUARDIAN': return 'security';
      default: return 'person';
    }
  }

  getRelativeRelationshipColor(relationship: string): string {
    switch (relationship) {
      case 'SPOUSE': return '#e91e63';
      case 'PARENT': return '#3f51b5';
      case 'CHILD': return '#4caf50';
      case 'SIBLING': return '#ff9800';
      case 'GRANDPARENT': return '#9c27b0';
      case 'GRANDCHILD': return '#00bcd4';
      case 'FRIEND': return '#607d8b';
      case 'GUARDIAN': return '#795548';
      default: return '#6b7280';
    }
  }

  formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }
}
