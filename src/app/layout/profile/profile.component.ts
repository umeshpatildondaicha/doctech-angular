import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GridComponent } from '../../tools/grid/grid.component';
import { ColDef, GridOptions } from 'ag-grid-community';
import { PricingDialogComponent, PricingDialogData } from './pricing-dialog/pricing-dialog.component';
import { PricingItemDialogComponent, PricingItemData } from './pricing-item-dialog/pricing-item-dialog.component';
import { CustomEventsService } from '../../services/custom-events.service';
import { DoctorService, DoctorProfileUpdateRequest, DoctorProfileResponse } from '../../services/doctor.service';
import { AuthService } from '../../services/auth.service';

// Doctor Profile Interface - Updated to match service interfaces
interface DoctorProfile {
  // Basic Information
  firstName: string;
  lastName: string;
  registrationNumber: string;
  dateOfBirth: Date;
  gender: string;
  email: string;
  contactNumber: string;
  profileImageUrl?: string;
  doctorStatus: string;
  primaryHospital: string;

  // Professional Bio
  professionalBio?: string;

  // Medical Credentials
  specialization: string;
  additionalSpecializations: string[];
  qualifications: string[];
  workStartDate: Date;
  experienceYears: number;
  certifications: string[];

  // Hospital Addresses
  hospitalAddresses: HospitalAddress[];

  // Affiliations
  affiliations: Affiliation[];
}

interface HospitalAddress {
  hospitalName: string;
  type: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
}

interface Affiliation {
  institutionName: string;
  type: string;
  role: string;
  startDate: Date;
  endDate?: Date;
  description: string;
}

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
    MatProgressBarModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    GridComponent,
    AppButtonComponent,
    AppInputComponent,
    AppSelectboxComponent,
    IconComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isEditing = false;
  isSaving = false;
  selectedTab = 0;
  profileCompletion = 0;

  // Doctor Profile Data - Initialize with authenticated user data
  doctorProfile: DoctorProfile = this.initializeDoctorProfile();

  // Grid Configuration for Pricing (keeping existing)
  pricingItems: PricingItemData[] = [
    { name: 'General Consultation', category: 'Consultation', unit: 'Flat', price: 150, followUpNeeded: true, followUps: [{ day: 7, price: 100 }] },
    { name: 'Emergency Visit', category: 'Emergency', unit: 'Flat', price: 200, followUpNeeded: false, followUps: [] },
    { name: 'Dressing', category: 'Dressing', unit: 'Per cm', price: 15, followUpNeeded: false, followUps: [] }
  ];

  pricingColumnDefs: ColDef[] = [
    {
      headerName: 'Service Name',
      field: 'name',
      flex: 2,
      minWidth: 200,
      cellRenderer: (params: any) => {
        return `<div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 18px;">💰</span>
          <div>
            <div style="font-weight: 700; color: #1e293b;">${params.value}</div>
            <div style="font-size: 12px; color: #64748b;">${params.data.category}</div>
          </div>
        </div>`;
      }
    },
    {
      headerName: 'Category',
      field: 'category',
      flex: 1,
      minWidth: 120,
      cellRenderer: (params: any) => {
        return `<span style="display: inline-flex; align-items: center; padding: 6px 12px; border-radius: 20px; background: #f59e0b; color: white; font-size: 12px; font-weight: 600;">${params.value}</span>`;
      }
    },
    {
      headerName: 'Unit',
      field: 'unit',
      flex: 1,
      minWidth: 100,
      cellRenderer: (params: any) => {
        return `<span style="display: inline-flex; align-items: center; padding: 6px 12px; border-radius: 20px; background: #06b6d4; color: white; font-size: 12px; font-weight: 600;">${params.value}</span>`;
      }
    },
    {
      headerName: 'Base Price',
      field: 'price',
      flex: 1,
      minWidth: 120,
      cellRenderer: (params: any) => {
        return `<span style="display: inline-flex; align-items: center; padding: 8px 16px; border-radius: 20px; background: #10b981; color: white; font-size: 14px; font-weight: 700;">₹ ${params.value}</span>`;
      }
    }
  ];

  pricingGridOptions: GridOptions = {
    rowHeight: 60,
    headerHeight: 50,
    suppressMovableColumns: true,
    suppressMenuHide: true,
    suppressRowClickSelection: true,
    suppressCellFocus: true,
    suppressRowHoverHighlight: true,
    suppressColumnVirtualisation: true,
    suppressRowVirtualisation: true,
    suppressAnimationFrame: true,
    suppressBrowserResizeObserver: true,
    suppressScrollOnNewData: true,
    suppressPropertyNamesCheck: true,
    suppressFieldDotNotation: true,
    suppressLoadingOverlay: true,
    suppressNoRowsOverlay: true,
    suppressRowTransform: true,
    suppressColumnMoveAnimation: true
  };

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private customEventsService: CustomEventsService,
    private doctorService: DoctorService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.profileForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      contactNumber: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      professionalBio: ['', [Validators.maxLength(1000)]],
      // Medical Credentials form controls
      specialization: ['', [Validators.required]],
      additionalSpecializations: [[]],
      qualifications: [[]],
      workStartDate: ['', [Validators.required]],
      experienceYears: [0, [Validators.required, Validators.min(0), Validators.max(50)]],
      certifications: [[]]
    });
  }

  ngOnInit(): void {
    this.loadDoctorProfile();
    this.calculateProfileCompletion();
  }

  /**
   * Initialize doctor profile with authenticated user data
   */
  private initializeDoctorProfile(): DoctorProfile {
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser && currentUser.userType === 'DOCTOR') {
      // Extract name from fullName
      const nameParts = currentUser.fullName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      return {
        // Basic Information from authenticated user
        firstName: firstName,
        lastName: lastName,
        registrationNumber: currentUser.id || 'DOC-12332', // Use user ID (which should now be registration number)
        dateOfBirth: new Date('1985-03-15'), // Default, will be loaded from API
        gender: 'Male', // Default, will be loaded from API
        email: currentUser.email,
        contactNumber: currentUser.phoneNumber || '',
        profileImageUrl: currentUser.profilePicture || 'assets/avatars/default-avatar.jpg',
        doctorStatus: currentUser.status === 'ACTIVE' ? 'APPROVED' : 'PENDING',
        primaryHospital: 'Shree Clinic', // Default, will be loaded from API

        // Professional Bio - will be loaded from API
        professionalBio: '',

        // Medical Credentials - will be loaded from API
        specialization: '',
        additionalSpecializations: [],
        qualifications: [],
        workStartDate: new Date(),
        experienceYears: 0,
        certifications: [],

        // Hospital Addresses - will be loaded from API
        hospitalAddresses: [],

        // Affiliations - will be loaded from API
        affiliations: []
      };
    } else {
      // Fallback to default data if not authenticated as doctor
      return {
        // Basic Information
        firstName: 'Umesh',
        lastName: 'Patil',
        registrationNumber: 'DOC-12332',
        dateOfBirth: new Date('1985-03-15'),
        gender: 'Male',
        email: 'u513107@gmail.com',
        contactNumber: '8788802334',
        profileImageUrl: 'assets/avatars/default-avatar.jpg',
        doctorStatus: 'APPROVED',
        primaryHospital: 'Shree Clinic',

        // Professional Bio
        professionalBio: '',

        // Medical Credentials
        specialization: 'Orthopedics',
        additionalSpecializations: ['Sports Medicine', 'Joint Replacement', 'Arthroscopy'],
        qualifications: ['MBBS', 'MS - Orthopedics', 'Fellowship in Sports Medicine'],
        workStartDate: new Date('2015-06-01'),
        experienceYears: 8,
        certifications: ['BLS', 'ACLS', 'Fellowship in Joint Replacement'],

        // Hospital Addresses
        hospitalAddresses: [
          {
            hospitalName: 'Shree Clinic',
            type: 'Primary Hospital',
            streetAddress: '123 Medical Center Drive',
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400001',
            country: 'India',
            phone: '+91-22-12345678',
            email: 'info@shreeclinic.com'
          }
        ],

        // Affiliations
        affiliations: [
          {
            institutionName: 'Indian Medical Association',
            type: 'Professional Association',
            role: 'Active Member',
            startDate: new Date('2015-06-01'),
            description: 'Active member of the Indian Medical Association, participating in continuing medical education programs and professional development activities.'
          }
        ]
      };
    }
  }

  /**
   * Load doctor profile data
   */
  private loadDoctorProfile(): void {
    // Get the authenticated user's registration number
    const currentUser = this.authService.getCurrentUser();
    const registrationNumber = currentUser?.userType === 'DOCTOR' ? currentUser.id : this.doctorProfile.registrationNumber;
    
    console.log('Loading profile for registration number:', registrationNumber);
    
    // Load from API
    this.doctorService.getProfile(registrationNumber).subscribe({
      next: (response: DoctorProfileResponse) => {
        // Debug logging
        console.log('API Response received:', response);
        console.log('Professional Bio from API:', response.professionalBio);
        
        // Update the profile with API data
        this.doctorProfile = {
          ...this.doctorProfile,
          firstName: response.firstName,
          lastName: response.lastName,
          email: response.email,
          contactNumber: response.contactNumber,
          specialization: response.specialization,
          professionalBio: response.professionalBio || '',
          qualifications: response.qualifications || [],
          certifications: response.certifications || [],
          experienceYears: response.experienceYears || 0,
          hospitalAddresses: response.hospitalAddresses || [],
          affiliations: (response.affiliations || []).map((aff: any) => ({
            ...aff,
            startDate: new Date(aff.startDate),
            endDate: aff.endDate ? new Date(aff.endDate) : undefined
          }))
        };
        
        console.log('Updated doctorProfile:', this.doctorProfile);
        
        // Update form values
        this.profileForm.patchValue({
          email: this.doctorProfile.email,
          contactNumber: this.doctorProfile.contactNumber,
          professionalBio: this.doctorProfile.professionalBio,
          // Medical Credentials
          specialization: this.doctorProfile.specialization,
          additionalSpecializations: this.doctorProfile.additionalSpecializations,
          qualifications: this.doctorProfile.qualifications,
          workStartDate: this.doctorProfile.workStartDate,
          experienceYears: this.doctorProfile.experienceYears,
          certifications: this.doctorProfile.certifications
        });
        
        console.log('Form updated with professionalBio:', this.profileForm.get('professionalBio')?.value);
      },
      error: (error: any) => {
        console.error('Error loading doctor profile:', error);
        // Fallback to hardcoded data if API fails
        this.profileForm.patchValue({
          email: this.doctorProfile.email,
          contactNumber: this.doctorProfile.contactNumber,
          professionalBio: this.doctorProfile.professionalBio,
          // Medical Credentials
          specialization: this.doctorProfile.specialization,
          additionalSpecializations: this.doctorProfile.additionalSpecializations,
          qualifications: this.doctorProfile.qualifications,
          workStartDate: this.doctorProfile.workStartDate,
          experienceYears: this.doctorProfile.experienceYears,
          certifications: this.doctorProfile.certifications
        });
      }
    });
  }

  /**
   * Calculate profile completion percentage
   */
  private calculateProfileCompletion(): void {
    const totalFields = 10; // Total number of profile fields
    let completedFields = 0;

    // Check basic information
    if (this.doctorProfile.firstName) completedFields++;
    if (this.doctorProfile.lastName) completedFields++;
    if (this.doctorProfile.email) completedFields++;
    if (this.doctorProfile.contactNumber) completedFields++;
    if (this.doctorProfile.specialization) completedFields++;
    if (this.doctorProfile.qualifications?.length > 0) completedFields++;
    if (this.doctorProfile.professionalBio) completedFields++;
    if (this.doctorProfile.hospitalAddresses?.length > 0) completedFields++;
    if (this.doctorProfile.affiliations?.length > 0) completedFields++;
    if (this.doctorProfile.certifications?.length > 0) completedFields++;

    this.profileCompletion = Math.round((completedFields / totalFields) * 100);
  }

  /**
   * Start editing profile
   */
  startEditing(): void {
    this.isEditing = true;
    this.loadDoctorProfile();
  }

  /**
   * Cancel editing
   */
  cancelEditing(): void {
    this.isEditing = false;
    this.loadDoctorProfile(); // Reset to original values
  }

  /**
   * Save profile changes
   */
  saveProfile(): void {
    if (this.profileForm.valid) {
      this.isSaving = true;
      
      // Get the authenticated user's registration number
      const currentUser = this.authService.getCurrentUser();
      const registrationNumber = currentUser?.userType === 'DOCTOR' ? currentUser.id : this.doctorProfile.registrationNumber;
      
      // Prepare profile data for API
      const profileData: DoctorProfileUpdateRequest = {
        firstName: this.doctorProfile.firstName,
        lastName: this.doctorProfile.lastName,
        registrationNumber: registrationNumber,
          dateOfBirth: this.doctorProfile.dateOfBirth.toISOString().split('T')[0],
          gender: this.doctorProfile.gender,
          email: this.profileForm.get('email')?.value,
          contactNumber: this.profileForm.get('contactNumber')?.value,
          profileImageUrl: this.doctorProfile.profileImageUrl,
          doctorStatus: this.doctorProfile.doctorStatus,
          primaryHospital: this.doctorProfile.primaryHospital,
          professionalBio: this.profileForm.get('professionalBio')?.value || '',
          specialization: this.profileForm.get('specialization')?.value,
          additionalSpecializations: this.profileForm.get('additionalSpecializations')?.value,
          qualifications: this.profileForm.get('qualifications')?.value,
          workStartDate: this.profileForm.get('workStartDate')?.value.toISOString().split('T')[0],
          experienceYears: this.profileForm.get('experienceYears')?.value,
          certifications: this.profileForm.get('certifications')?.value,
          hospitalAddresses: this.doctorProfile.hospitalAddresses,
          affiliations: this.doctorProfile.affiliations.map(aff => ({
            ...aff,
            startDate: aff.startDate.toISOString().split('T')[0],
            endDate: aff.endDate ? aff.endDate.toISOString().split('T')[0] : undefined
          }))
        };
        
        console.log('Sending profile data:', profileData);
        console.log('Professional Bio being sent:', profileData.professionalBio);
        
        // Call API to update profile
        this.doctorService.updateProfile(registrationNumber, profileData).subscribe({
        next: (response: DoctorProfileResponse) => {
          console.log('Save response received:', response);
          console.log('Professional Bio in response:', response.professionalBio);
          
          // Update the profile with response data
          this.doctorProfile = {
            ...this.doctorProfile,
            firstName: response.firstName,
            lastName: response.lastName,
            email: response.email,
            contactNumber: response.contactNumber,
            specialization: response.specialization,
            professionalBio: response.professionalBio || '',
            qualifications: response.qualifications || [],
            certifications: response.certifications || [],
            experienceYears: response.experienceYears || 0,
            hospitalAddresses: response.hospitalAddresses || [],
            affiliations: (response.affiliations || []).map((aff: any) => ({
              ...aff,
              startDate: new Date(aff.startDate),
              endDate: aff.endDate ? new Date(aff.endDate) : undefined
            }))
          };
          
          console.log('Profile updated successfully. New bio:', this.doctorProfile.professionalBio);
          
          // Small delay to ensure data is properly updated
          setTimeout(() => {
            // Trigger change detection to update the view
            this.cdr.detectChanges();
          }, 100);
          
          // Update form values after save
          this.profileForm.patchValue({
            email: this.doctorProfile.email,
            contactNumber: this.doctorProfile.contactNumber,
            professionalBio: this.doctorProfile.professionalBio,
            specialization: this.doctorProfile.specialization,
            additionalSpecializations: this.doctorProfile.additionalSpecializations,
            qualifications: this.doctorProfile.qualifications,
            workStartDate: this.doctorProfile.workStartDate,
            experienceYears: this.doctorProfile.experienceYears,
            certifications: this.doctorProfile.certifications
          });
          
          this.isEditing = false;
          this.isSaving = false;
          this.calculateProfileCompletion();
          
          this.snackBar.open('Profile updated successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['success-snackbar']
          });
        },
        error: (error: any) => {
          console.error('Error updating doctor profile:', error);
          this.isSaving = false;
          
          this.snackBar.open('Failed to update profile. Please try again.', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  /**
   * Open pricing dialog
   */
  openPricingDialog(): void {
    const dialogRef = this.dialog.open(PricingDialogComponent, {
      width: '800px',
      data: { pricingItems: this.pricingItems }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.pricingItems = result;
        this.snackBar.open('Pricing updated successfully!', 'Close', {
          duration: 3000
        });
      }
    });
  }



  /**
   * Add or edit pricing item
   */
  addOrEditPricingItem(): void {
    const dialogRef = this.dialog.open(PricingItemDialogComponent, {
      width: '600px',
      data: {} as PricingItemData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.pricingItems.push(result);
        this.snackBar.open('Pricing item added successfully!', 'Close', {
          duration: 3000
        });
      }
    });
  }

  /**
   * Get error message for form field
   */
  getErrorMessage(fieldName: string): string {
    const control = this.profileForm.get(fieldName);
    if (control?.errors) {
      if (control.errors['required']) {
        return 'This field is required';
      }
      if (control.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (control.errors['pattern']) {
        return 'Please enter a valid phone number';
      }
      if (control.errors['maxlength']) {
        return `Maximum length is ${control.errors['maxlength'].requiredLength} characters`;
      }
      if (control.errors['min']) {
        return `Minimum value is ${control.errors['min'].min}`;
      }
      if (control.errors['max']) {
        return `Maximum value is ${control.errors['max'].max}`;
      }
    }
    return '';
  }

  /**
   * Add item to array field
   */
  addArrayItem(fieldName: string, value: string): void {
    const currentValue = this.profileForm.get(fieldName)?.value || [];
    if (value.trim() && !currentValue.includes(value.trim())) {
      this.profileForm.patchValue({
        [fieldName]: [...currentValue, value.trim()]
      });
    }
  }

  /**
   * Remove item from array field
   */
  removeArrayItem(fieldName: string, index: number): void {
    const currentValue = this.profileForm.get(fieldName)?.value || [];
    const newValue = currentValue.filter((_: any, i: number) => i !== index);
    this.profileForm.patchValue({
      [fieldName]: newValue
    });
  }

  /**
   * Add new specialization
   */
  addSpecialization(): void {
    const input = document.getElementById('newSpecialization') as HTMLInputElement;
    if (input && input.value.trim()) {
      this.addArrayItem('additionalSpecializations', input.value);
      input.value = '';
    }
  }

  /**
   * Add new qualification
   */
  addQualification(): void {
    const input = document.getElementById('newQualification') as HTMLInputElement;
    if (input && input.value.trim()) {
      this.addArrayItem('qualifications', input.value);
      input.value = '';
    }
  }

  /**
   * Add new certification
   */
  addCertification(): void {
    const input = document.getElementById('newCertification') as HTMLInputElement;
    if (input && input.value.trim()) {
      this.addArrayItem('certifications', input.value);
      input.value = '';
    }
  }
}
