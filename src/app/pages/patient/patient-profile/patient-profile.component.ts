import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatExpansionModule } from '@angular/material/expansion';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Custom Components
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { IconComponent } from '../../../tools/app-icon/icon.component';
import { AppButtonComponent } from '../../../tools/app-button/app-button.component';
import { AppInputComponent } from '../../../tools/app-input/app-input.component';
import { AppSelectboxComponent } from '../../../tools/app-selectbox/app-selectbox.component';
import { GridComponent } from '../../../tools/grid/grid.component';

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
    BreadcrumbComponent,
    IconComponent,
    AppButtonComponent,
    AppInputComponent,
    AppSelectboxComponent,
    GridComponent
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
    { id: 'profile', label: 'Profile', icon: 'person', badge: 0 },
    { id: 'vitals', label: 'Vitals', icon: 'favorite', badge: 3 },
    { id: 'medications', label: 'Medications', icon: 'local_pharmacy', badge: 0 },
    { id: 'appointments', label: 'Appointments', icon: 'event', badge: 2 },
    { id: 'lab-reports', label: 'Lab Reports', icon: 'science', badge: 1 },
    { id: 'clinical-notes', label: 'Clinical Notes', icon: 'note', badge: 0 },
    { id: 'care-plan', label: 'Care Plan', icon: 'medical_services', badge: 0 }
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
      id: 'order-lab',
      label: 'Order Lab Test',
      icon: 'science',
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
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
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
    console.log('Schedule appointment');
    // Implementation for scheduling appointment
  }

  orderLabTest(): void {
    console.log('Order lab test');
    // Implementation for ordering lab test
  }

  prescribeMedication(): void {
    console.log('Prescribe medication');
    // Implementation for prescribing medication
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
    const numericValue = typeof value === 'number' ? value : parseFloat(value as string);
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
    return trend ? `${trend.change > 0 ? '+' : ''}${trend.change}` : null;
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

  // UI Methods
  exportPatientData(): void {
    console.log('Exporting patient data');
    // Implementation for exporting patient data
  }

  toggleFullscreen(): void {
    this.isFullscreen = !this.isFullscreen;
    // Implementation for fullscreen toggle
  }

  startRealTimeUpdates(): void {
    // Simulate real-time updates every 30 seconds
    setInterval(() => {
      if (this.viewMode === 'ipd') {
        this.refreshVitals();
      }
    }, 30000);
  }
}
