import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppButtonComponent } from '../../tools/app-button/app-button.component';
import { AppInputComponent } from '../../tools/app-input/app-input.component';
import { AppSelectboxComponent } from '../../tools/app-selectbox/app-selectbox.component';
import { IconComponent } from '../../tools/app-icon/icon.component';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatTabsModule,
    MatChipsModule,
    MatCheckboxModule,
    MatExpansionModule,
    AppButtonComponent,
    AppInputComponent,
    AppSelectboxComponent,
    IconComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  profileForm: FormGroup;
  isEditing = false;
  selectedTab = 0;

  // Available options for dropdowns
  specializations = [
    'Cardiology', 'Orthopedics', 'Pediatrics', 'Neurology', 'Oncology', 
    'Dermatology', 'Psychiatry', 'General Medicine', 'Surgery', 'Gynecology',
    'Ophthalmology', 'ENT', 'Urology', 'Radiology', 'Anesthesiology'
  ];

  departments = [
    'Cardiology', 'Pediatrics', 'Orthopedics', 'Neurology', 'Oncology',
    'Emergency Medicine', 'Intensive Care', 'Surgery', 'Gynecology', 'Radiology'
  ];

  languages = [
    'English', 'Hindi', 'Spanish', 'French', 'German', 'Chinese', 'Arabic', 'Portuguese'
  ];

  availabilityOptions = [
    'Monday-Friday', 'Weekends', 'Evenings', '24/7 Emergency', 'By Appointment Only'
  ];

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.profileForm = this.fb.group({
      // Personal Information
      firstName: ['Dr. John', [Validators.required, Validators.minLength(2)]],
      lastName: ['Doe', [Validators.required, Validators.minLength(2)]],
      email: ['john.doe@shreeclinic.com', [Validators.required, Validators.email]],
      phone: ['+1 (555) 123-4567', [Validators.required]],
      dateOfBirth: ['1980-05-15'],
      gender: ['Male'],
      
      // Professional Information
      specialization: ['General Medicine', [Validators.required]],
      qualifications: ['MBBS, MD - Internal Medicine', [Validators.required]],
      experience: ['15', [Validators.required, Validators.min(0)]],
      licenseNumber: ['MD123456', [Validators.required]],
      affiliatedHospitals: ['Shree Clinic, City General Hospital'],
      workingHours: ['Monday-Friday'],
      languagesSpoken: [['English', 'Hindi', 'Spanish']],
      
      // Medical Practice Information
      treatmentsOffered: ['General Consultation, Preventive Care, Chronic Disease Management'],
      proceduresPerformed: ['Physical Examinations, Vaccinations, Health Screenings'],
      patientAgeGroups: [['Adults', 'Elderly']],
      
      // Departments & Affiliations
      associatedDepartments: [['General Medicine', 'Preventive Care']],
      hospitalAffiliations: ['Shree Clinic, City General Hospital'],
      clinicAffiliations: ['Downtown Medical Center'],
      
      // Fees & Consultation
      consultationFee: ['150'],
      followUpFee: ['100'],
      emergencyFee: ['200'],
      onlineConsultationFee: ['120'],
      insuranceAccepted: [true],
      paymentMethods: [['Cash', 'Credit Card', 'Insurance']],
      
      // Availability & Telemedicine
      availabilitySchedule: ['Monday-Friday'],
      onlineConsultation: [true],
      telemedicineAvailable: [true],
      emergencyAvailability: [true],
      appointmentSlots: ['30 minutes'],
      
      // Research & Publications
      researchInterests: ['Preventive Medicine, Chronic Disease Management'],
      publications: [''],
      caseStudies: [''],
      awards: ['Best Doctor Award 2023, Excellence in Patient Care 2022'],
      memberships: ['American Medical Association, State Medical Board'],
      
      // Security & Settings
      twoFactorAuth: [false],
      smsNotifications: [true],
      emailNotifications: [true],
      appNotifications: [true],
      profileVisibility: ['Public'],
      
      // Bio & About
      bio: ['Experienced physician with over 15 years of practice in general medicine. Specialized in preventive care and chronic disease management. Committed to providing personalized healthcare with a focus on patient education and preventive medicine.', [Validators.required, Validators.minLength(50)]],
      aboutMe: ['Dedicated to providing compassionate and comprehensive healthcare. I believe in building long-term relationships with patients and their families.'],
      
      // Calendar Integration
      googleCalendarSync: [false],
      outlookCalendarSync: [false],
      autoScheduleAppointments: [true]
    });
  }

  onEdit() {
    this.isEditing = true;
  }

  onSave() {
    if (this.profileForm.valid) {
      console.log('Profile updated:', this.profileForm.value);
      this.isEditing = false;
      
      // Show success notification
      this.snackBar.open('Profile updated successfully!', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['success-snackbar']
      });
      
      // TODO: Send to backend API
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel() {
    this.isEditing = false;
    // Reset form to original values
    this.profileForm.patchValue({
      firstName: 'Dr. John',
      lastName: 'Doe',
      email: 'john.doe@shreeclinic.com',
      phone: '+1 (555) 123-4567',
      specialization: 'General Medicine',
      licenseNumber: 'MD123456',
      experience: '15',
      qualifications: 'MBBS, MD - Internal Medicine',
      bio: 'Experienced physician with over 15 years of practice in general medicine. Specialized in preventive care and chronic disease management. Committed to providing personalized healthcare with a focus on patient education and preventive medicine.',
      languagesSpoken: ['English', 'Hindi', 'Spanish'],
      consultationFee: '150'
    });
  }

  onTabChange(event: any) {
    this.selectedTab = event.index;
  }

  addLanguage(language: string) {
    const currentLanguages = this.profileForm.get('languagesSpoken')?.value || [];
    if (!currentLanguages.includes(language)) {
      this.profileForm.patchValue({
        languagesSpoken: [...currentLanguages, language]
      });
    }
  }

  removeLanguage(language: string) {
    const currentLanguages = this.profileForm.get('languagesSpoken')?.value || [];
    this.profileForm.patchValue({
      languagesSpoken: currentLanguages.filter((lang: string) => lang !== language)
    });
  }

  addDepartment(department: string) {
    const currentDepartments = this.profileForm.get('associatedDepartments')?.value || [];
    if (!currentDepartments.includes(department)) {
      this.profileForm.patchValue({
        associatedDepartments: [...currentDepartments, department]
      });
    }
  }

  removeDepartment(department: string) {
    const currentDepartments = this.profileForm.get('associatedDepartments')?.value || [];
    this.profileForm.patchValue({
      associatedDepartments: currentDepartments.filter((dept: string) => dept !== department)
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.profileForm.get(fieldName);
    if (control?.invalid && control?.touched) {
      switch (fieldName) {
        case 'firstName':
        case 'lastName':
          return 'Name must be at least 2 characters';
        case 'email':
          return 'Please enter a valid email address';
        case 'phone':
          return 'Phone number is required';
        case 'specialization':
          return 'Specialization is required';
        case 'licenseNumber':
          return 'License number is required';
        case 'experience':
          return 'Experience must be a positive number';
        case 'bio':
          return 'Bio must be at least 50 characters';
        case 'qualifications':
          return 'Qualifications are required';
        default:
          return 'This field is required';
      }
    }
    return '';
  }
}
