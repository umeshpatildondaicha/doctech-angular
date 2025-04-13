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
    id: '#P7085',
    name: 'Umesh Patil',
    gender: 'Male',
    age: '41 years 0 months 3 days',
    mobile: '+811 847-4958',
    dob: new Date(1980, 7, 10),
    bed: '104 - VIP Ward - 1st Floor',
    email: 'info@softnio.com',
    consultant: 'Ernesto Vargas',
    patientType: 'In Patient',
    country: 'United State',
    nationality: 'United State',
    photo: './assets/default-avatar.jpg',
    phone: '+811 847-4958',
    doctorsNote:
      'Aproin at metus et dolor tincidunt feugiat eu id quam. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aenean sollicitudin non nunc vel pharetra.',
    noteAddedOn: new Date(2019, 10, 18, 17, 34),
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

  parseNumber(value: any): number {
    return parseFloat(value);
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

