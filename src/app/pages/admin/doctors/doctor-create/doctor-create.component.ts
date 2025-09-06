import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';

import { Doctor } from '../../../../interfaces/doctor.interface';
import { HttpService } from '../../../../services/http.service';

@Component({
  selector: 'app-admin-doctor-create',
  templateUrl: './doctor-create.component.html',
  styleUrl: './doctor-create.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTabsModule
  ]
})
export class AdminDoctorCreateComponent implements OnInit {
  doctorForm!: FormGroup;
  isLoading = false;
  customCertification: string = '';
  backendConnected: boolean = false;
  
  // Tab management
  selectedTabIndex: number = 0;
  
  // Invite existing doctor properties
  inviteMobileNumber: string = '';
  inviteRole: string = 'DOCTOR';
  inviteMessage: string = '';
  inviteMobileNumberError: string = '';
  isInviting: boolean = false;
  specializations: string[] = [
    'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology',
    'Oncology', 'Psychiatry', 'General Surgery', 'Internal Medicine',
    'Emergency Medicine', 'Radiology', 'Pathology', 'Anesthesiology',
    'Obstetrics & Gynecology', 'Ophthalmology', 'ENT', 'Urology',
    'Gastroenterology', 'Endocrinology', 'Rheumatology'
  ];

  doctorStatusOptions = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'SUSPENDED', label: 'Suspended' }
  ];

  certificationOptions = [
    'BLS', 'ACLS', 'PALS', 'ATLS', 'FCCS', 'NALS', 'PHTLS',
    'ACLS-EP', 'BLS Instructor', 'ACLS Instructor'
  ];

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private dialogRef: MatDialogRef<AdminDoctorCreateComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { doctor?: Doctor }
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    if (this.data?.doctor) {
      this.populateForm(this.data.doctor);
    }
    
    // Test backend connection
    this.testBackendConnection();
  }

  private initializeForm() {
    this.doctorForm = this.fb.group({
      // Mandatory fields
      registrationNumber: ['', [Validators.required, Validators.pattern(/^DOC-\d{5}$/)]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      specialization: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)]],
      doctorStatus: ['PENDING', Validators.required],

      // Optional fields
      contactNumber: ['', [Validators.pattern(/^\+?[\d\s\-\(\)]+$/)]],
      email: ['', [Validators.email]],
      qualifications: [''],
      certifications: [[]],
      workingDays: [[]],
      appointmentTimings: [[]]
    });
  }

  private populateForm(doctor: Doctor) {
    this.doctorForm.patchValue({
      registrationNumber: doctor.registrationNumber,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      specialization: doctor.specialization,
      password: doctor.password,
      doctorStatus: doctor.doctorStatus,
      contactNumber: doctor.contactNumber,
      email: doctor.email,
      qualifications: doctor.qualifications,
      certifications: doctor.certifications || [],
      workingDays: doctor.workingDays || [],
      appointmentTimings: doctor.appointmentTimings || []
    });
  }

  onSubmit() {
    if (this.doctorForm.valid) {
      this.isLoading = true;
      const formData = this.doctorForm.value;
      
      // Add timestamps
      const now = new Date().toISOString();
      const payload = {
        ...formData,
        createdAt: now,
        updatedAt: now
      };

      console.log('🚀 Sending doctor creation request to:', 'http://localhost:8080/api/doctors');
      console.log('📦 Payload:', payload);
      console.log('🌐 CORS Origin:', window.location.origin);

      this.httpService.sendPOSTRequest('http://localhost:8080/api/doctors', payload)
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            console.log('✅ Doctor created successfully:', response);
            console.log('🎯 Response status:', response);
            this.snackBar.open('Doctor created successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            });
            this.dialogRef.close(response);
          },
          error: (error) => {
            this.isLoading = false;
            console.error('❌ Error creating doctor:', error);
            console.error('🔍 Error details:', {
              status: error.status,
              statusText: error.statusText,
              message: error.message,
              url: error.url
            });
            
            let errorMessage = 'Error creating doctor. Please try again.';
            
            if (error.status === 400) {
              errorMessage = 'Invalid data provided. Please check all fields.';
            } else if (error.status === 409) {
              errorMessage = 'Doctor with this registration number already exists.';
            } else if (error.status === 500) {
              errorMessage = 'Server error. Please try again later.';
            } else if (error.status === 0) {
              errorMessage = 'Cannot connect to server. Please check if Spring backend is running on localhost:8080.';
            } else if (error.status === 403) {
              errorMessage = 'Access forbidden. CORS issue detected.';
            }
            
            this.snackBar.open(errorMessage, 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            });
          }
        });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  toggleCertification(certification: string) {
    const currentCerts = this.doctorForm.get('certifications')?.value || [];
    if (currentCerts.includes(certification)) {
      // Remove certification
      const updatedCerts = currentCerts.filter((cert: string) => cert !== certification);
      this.doctorForm.patchValue({ certifications: updatedCerts });
    } else {
      // Add certification
      this.doctorForm.patchValue({
        certifications: [...currentCerts, certification]
      });
    }
  }

  addCustomCertification() {
    if (this.customCertification?.trim()) {
      const certName = this.customCertification.trim();
      const currentCerts = this.doctorForm.get('certifications')?.value || [];
      
      // Check if certification already exists
      if (!currentCerts.includes(certName)) {
        this.doctorForm.patchValue({
          certifications: [...currentCerts, certName]
        });
        
        // Add to available certifications if not already there
        if (!this.certificationOptions.includes(certName)) {
          this.certificationOptions.push(certName);
        }
        
        // Show success message
        this.snackBar.open(`Certification "${certName}" added successfully!`, 'Close', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      } else {
        // Show warning if certification already exists
        this.snackBar.open(`Certification "${certName}" already exists!`, 'Close', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      }
      
      // Clear the input
      this.customCertification = '';
    }
  }

  removeCertification(certification: string) {
    const currentCerts = this.doctorForm.get('certifications')?.value || [];
    const updatedCerts = currentCerts.filter((cert: string) => cert !== certification);
    this.doctorForm.patchValue({ certifications: updatedCerts });
    
    // Show removal message
    this.snackBar.open(`Certification "${certification}" removed!`, 'Close', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  // Invite existing doctor methods
  inviteExistingDoctor() {
    if (!this.inviteMobileNumber?.trim()) {
      this.inviteMobileNumberError = 'Mobile number is required';
      return;
    }

    // Validate mobile number format
    const mobileRegex = /^\+?[\d\s\-\(\)]{10,15}$/;
    if (!mobileRegex.test(this.inviteMobileNumber.trim())) {
      this.inviteMobileNumberError = 'Please enter a valid mobile number';
      return;
    }

    this.isInviting = true;
    this.inviteMobileNumberError = '';

    const invitePayload = {
      mobileNumber: this.inviteMobileNumber.trim(),
      role: this.inviteRole,
      message: this.inviteMessage?.trim() || '',
      hospitalId: 1, // You can make this dynamic based on current hospital
      invitedBy: 'ADMIN', // You can make this dynamic based on current user
      invitedAt: new Date().toISOString()
    };

    console.log('📱 Sending doctor invitation:', invitePayload);

    this.httpService.sendPOSTRequest('http://localhost:8080/api/doctors/invite', JSON.stringify(invitePayload))
      .subscribe({
        next: (response) => {
          this.isInviting = false;
          console.log('✅ Doctor invitation sent successfully:', response);
          
          this.snackBar.open('Invitation sent successfully! Doctor will be notified.', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });

          // Reset form
          this.inviteMobileNumber = '';
          this.inviteMessage = '';
          this.inviteRole = 'DOCTOR';
        },
        error: (error) => {
          this.isInviting = false;
          console.error('❌ Error sending invitation:', error);
          
          let errorMessage = 'Failed to send invitation. Please try again.';
          
          if (error.status === 404) {
            errorMessage = 'Doctor not found with this mobile number.';
          } else if (error.status === 409) {
            errorMessage = 'Doctor is already associated with this hospital.';
          } else if (error.status === 400) {
            errorMessage = 'Invalid invitation data. Please check the details.';
          } else if (error.status === 0) {
            errorMessage = 'Cannot connect to server. Please check backend connection.';
          }
          
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
        }
      });
  }

  clearInviteError() {
    this.inviteMobileNumberError = '';
  }

  // Tab management methods
  onTabChange(index: number) {
    this.selectedTabIndex = index;
    console.log('📑 Tab changed to:', index === 0 ? 'Invite Existing' : 'Add New');
    
    // Clear any errors when switching tabs
    this.inviteMobileNumberError = '';
    
    // Reset form validation when switching to create tab
    if (index === 1) {
      this.doctorForm.markAsUntouched();
    }
  }

  testBackendConnection() {
    console.log('🔍 Testing backend connection...');
    this.httpService.sendGETRequest('http://localhost:8080/api/ping')
      .subscribe({
        next: (response) => {
          console.log('✅ Backend connection successful:', response);
          this.backendConnected = true;
        },
        error: (error) => {
          console.warn('⚠️ Backend connection test failed:', error);
          console.warn('💡 This is normal if your Spring app doesn\'t have a /ping endpoint');
          this.backendConnected = false;
        }
      });
  }

  private markFormGroupTouched() {
    Object.keys(this.doctorForm.controls).forEach(key => {
      const control = this.doctorForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.doctorForm.get(controlName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${this.getFieldLabel(controlName)} is required`;
      }
      if (control.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (control.errors['minlength']) {
        return `${this.getFieldLabel(controlName)} must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
      if (control.errors['pattern']) {
        if (controlName === 'registrationNumber') {
          return 'Registration number must be in format DOC-12345';
        }
        if (controlName === 'password') {
          return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
        }
        if (controlName === 'contactNumber') {
          return 'Please enter a valid contact number';
        }
      }
    }
    return '';
  }

  private getFieldLabel(controlName: string): string {
    const labels: { [key: string]: string } = {
      registrationNumber: 'Registration Number',
      firstName: 'First Name',
      lastName: 'Last Name',
      specialization: 'Specialization',
      password: 'Password',
      doctorStatus: 'Doctor Status',
      contactNumber: 'Contact Number',
      email: 'Email',
      qualifications: 'Qualifications'
    };
    return labels[controlName] || controlName;
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.doctorForm.get(controlName);
    return !!(control?.invalid && control?.touched);
  }
}
