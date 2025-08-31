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
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { GridComponent } from '../../tools/grid/grid.component';
import { ColDef, GridOptions } from 'ag-grid-community';
import { PricingDialogComponent, PricingDialogData } from './pricing-dialog/pricing-dialog.component';
import { PricingItemDialogComponent, PricingItemData } from './pricing-item-dialog/pricing-item-dialog.component';
import { CustomEventsService } from '../../services/custom-events.service';

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
    GridComponent,
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
  profileCompletion = 0;
  pricingItems: PricingItemData[] = [
    { name: 'General Consultation', category: 'Consultation', unit: 'Flat', price: 150, followUpNeeded: true, followUps: [{ day: 7, price: 100 }] },
    { name: 'Emergency Visit', category: 'Emergency', unit: 'Flat', price: 200, followUpNeeded: false, followUps: [] },
    { name: 'Dressing', category: 'Dressing', unit: 'Per cm', price: 15, followUpNeeded: false, followUps: [] }
  ];

  // Grid Configuration
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
    },
    {
      headerName: 'Follow-ups',
      field: 'followUps',
      flex: 1.5,
      minWidth: 150,
      cellRenderer: (params: any) => {
        if (!params.data.followUpNeeded || !params.value?.length) {
          return '<span style="font-size: 11px; color: #64748b; font-style: italic;">No follow-ups</span>';
        }
        const followups = params.value.map((f: any) => 
          `<div style="display: flex; align-items: center; gap: 6px; font-size: 12px; color: #64748b; font-weight: 500;">
            <span style="background: #10b3b3; color: white; padding: 2px 6px; border-radius: 8px; font-size: 10px; font-weight: 600;">Day ${f.day}</span>
            <span style="color: #10b981; font-weight: 600;">₹ ${f.price}</span>
          </div>`
        ).join('');
        return followups;
      }
    },
    {
      headerName: 'Actions',
      flex: 0.5,
      minWidth: 80,
      sortable: false,
      filter: false,
      cellRenderer: 'gridMenu'
    }
  ];

  pricingGridOptions: any = {
    suppressMenuHide: true,
    suppressRowClickSelection: true,
    rowHeight: 60,
    headerHeight: 50,
    suppressColumnVirtualisation: false,
    suppressRowVirtualisation: false,
    suppressSizeToFit: false,
    suppressAutoSize: false,
    domLayout: 'autoHeight',
    suppressHorizontalScroll: true,
    menuActions: [
      {
        title: 'Edit',
        icon: 'edit',
        click: (param: any) => this.addOrEditPricingItem(param.data, param.rowIndex)
      },
      {
        title: 'Delete',
        icon: 'delete',
        click: (param: any) => this.deletePricingItem(param.rowIndex)
      }
    ]
  };

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

  // Tab configuration
  tabs = [
    { label: 'Personal Info', icon: 'person_outline', description: 'Basic information and about me' },
    { label: 'Professional', icon: 'medical_services', description: 'Medical credentials and practice' },
    { label: 'Work & Availability', icon: 'business', description: 'Affiliations and schedule' },
    { label: 'Financial', icon: 'attach_money', description: 'Fees and payment methods' },
    { label: 'Settings', icon: 'settings', description: 'Security and preferences' }
  ];

  // Quick stats
  quickStats = [
    { label: 'Patients Seen', value: '1,247', icon: 'people', color: 'primary' },
    { label: 'Years Experience', value: '15', icon: 'schedule', color: 'accent' },
    { label: 'Languages', value: '3', icon: 'language', color: 'warn' },
    { label: 'Rating', value: '4.8/5', icon: 'star', color: 'primary' }
  ];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private customEventsService: CustomEventsService,
    private dialog: MatDialog
  ) {
    this.customEventsService.breadcrumbEvent.emit(
      {
        isAppend:true,
        breadcrum: [{
          title: 'Dr. John Doe',
          url: '/profile'
        }]
      }
    );
    this.profileForm = this.fb.group({
      // Personal Information
      firstName: ['Dr. John', [Validators.required, Validators.minLength(2)]],
      lastName: ['Doe', [Validators.required, Validators.minLength(2)]],
      email: ['john.doe@shreeclinic.com', [Validators.required, Validators.email]],
      phone: ['+1 (555) 123-4567', [Validators.required]],
      personalPhone: ['+1 (555) 987-6543'],
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

    this.calculateProfileCompletion();
  }

  ngOnInit() {
    // Listen to form changes to update completion percentage
    this.profileForm.valueChanges.subscribe(() => {
      this.calculateProfileCompletion();
    });
  }

  calculateProfileCompletion() {
    const totalFields = Object.keys(this.profileForm.controls).length;
    let completedFields = 0;

    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      if (control?.value && control?.value !== '' && control?.value !== null) {
        if (Array.isArray(control.value)) {
          if (control.value.length > 0) {
            completedFields++;
          }
        } else {
          completedFields++;
        }
      }
    });

    this.profileCompletion = Math.round((completedFields / totalFields) * 100);
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
      personalPhone: '+1 (555) 987-6543',
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

  getTabIcon(tabIndex: number): string {
    return this.tabs[tabIndex]?.icon || 'info';
  }

  getTabDescription(tabIndex: number): string {
    return this.tabs[tabIndex]?.description || '';
  }

  getProfileCompletionColor(): string {
    if (this.profileCompletion >= 80) return 'primary';
    if (this.profileCompletion >= 60) return 'accent';
    if (this.profileCompletion >= 40) return 'warn';
    return 'warn';
  }

  openPricingDialog() {
    const data: PricingDialogData = {
      consultationFee: this.profileForm.get('consultationFee')?.value,
      followUpFee: this.profileForm.get('followUpFee')?.value,
      emergencyFee: this.profileForm.get('emergencyFee')?.value,
      onlineConsultationFee: this.profileForm.get('onlineConsultationFee')?.value,
      insuranceAccepted: this.profileForm.get('insuranceAccepted')?.value,
      paymentMethods: this.profileForm.get('paymentMethods')?.value || []
    };

    const ref = this.dialog.open(PricingDialogComponent, {
      width: '640px',
      data
    });

    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      this.profileForm.patchValue({
        consultationFee: result.consultationFee,
        followUpFee: result.followUpFee,
        emergencyFee: result.emergencyFee,
        onlineConsultationFee: result.onlineConsultationFee,
        insuranceAccepted: result.insuranceAccepted,
        paymentMethods: result.paymentMethods
      });
      this.snackBar.open('Pricing updated', 'Close', { duration: 2500 });
    });
  }

  addOrEditPricingItem(item?: PricingItemData, index?: number) {
    const ref = this.dialog.open(PricingItemDialogComponent, {
      width: '640px',
      data: item ? { ...item } : undefined
    });
    ref.afterClosed().subscribe((result: PricingItemData | undefined) => {
      if (!result) return;
      if (typeof index === 'number') {
        this.pricingItems[index] = result;
        this.pricingItems = [...this.pricingItems];
      } else {
        this.pricingItems = [result, ...this.pricingItems];
      }
      this.snackBar.open('Pricing item saved', 'Close', { duration: 2000 });
    });
  }

  deletePricingItem(index: number) {
    this.pricingItems.splice(index, 1);
    this.pricingItems = [...this.pricingItems];
    this.snackBar.open('Pricing item deleted', 'Close', { duration: 1500 });
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

  addDiscount() {
    const currentDiscounts = this.profileForm.get('discounts')?.value || [];
    const newDiscount = {
      type: '',
      percentage: 0,
      validUntil: '',
      minAge: 0,
      validDays: []
    };
    this.profileForm.patchValue({
      discounts: [...currentDiscounts, newDiscount]
    });
  }

  removeDiscount(index: number) {
    const currentDiscounts = this.profileForm.get('discounts')?.value || [];
    currentDiscounts.splice(index, 1);
    this.profileForm.patchValue({
      discounts: currentDiscounts
    });
  }

  addPaymentPlan() {
    const currentPlans = this.profileForm.get('paymentPlans')?.value || [];
    const newPlan = {
      name: '',
      installments: 1,
      interest: 0,
      description: ''
    };
    this.profileForm.patchValue({
      paymentPlans: [...currentPlans, newPlan]
    });
  }

  removePaymentPlan(index: number) {
    const currentPlans = this.profileForm.get('paymentPlans')?.value || [];
    currentPlans.splice(index, 1);
    this.profileForm.patchValue({
      paymentPlans: currentPlans
    });
  }

  updateDiscount(index: number, field: string, value: any) {
    const currentDiscounts = this.profileForm.get('discounts')?.value || [];
    if (currentDiscounts[index]) {
      currentDiscounts[index][field] = value;
      this.profileForm.patchValue({
        discounts: currentDiscounts
      });
    }
  }

  updatePaymentPlan(index: number, field: string, value: any) {
    const currentPlans = this.profileForm.get('paymentPlans')?.value || [];
    if (currentPlans[index]) {
      currentPlans[index][field] = value;
      this.profileForm.patchValue({
        paymentPlans: currentPlans
      });
    }
  }

  // Insurance Methods
  addInsuranceCode(code: string) {
    if (!code.trim()) return;
    const currentCodes = this.profileForm.get('insuranceCodes')?.value || [];
    if (!currentCodes.includes(code)) {
      this.profileForm.patchValue({
        insuranceCodes: [...currentCodes, code]
      });
    }
  }

  removeInsuranceCode(code: string) {
    const currentCodes = this.profileForm.get('insuranceCodes')?.value || [];
    this.profileForm.patchValue({
      insuranceCodes: currentCodes.filter((c: string) => c !== code)
    });
  }

  // Helper methods for input events
  onDiscountTypeChange(index: number, event: any) {
    this.updateDiscount(index, 'type', event.target.value);
  }

  onDiscountPercentageChange(index: number, event: any) {
    this.updateDiscount(index, 'percentage', +event.target.value);
  }

  onDiscountValidUntilChange(index: number, event: any) {
    this.updateDiscount(index, 'validUntil', event.target.value);
  }

  onDiscountMinAgeChange(index: number, event: any) {
    this.updateDiscount(index, 'minAge', +event.target.value);
  }

  onPaymentPlanNameChange(index: number, event: any) {
    this.updatePaymentPlan(index, 'name', event.target.value);
  }

  onPaymentPlanInstallmentsChange(index: number, event: any) {
    this.updatePaymentPlan(index, 'installments', +event.target.value);
  }

  onPaymentPlanInterestChange(index: number, event: any) {
    this.updatePaymentPlan(index, 'interest', +event.target.value);
  }

  onPaymentPlanDescriptionChange(index: number, event: any) {
    this.updatePaymentPlan(index, 'description', event.target.value);
  }
}
