import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppInputComponent, AppSelectboxComponent, AppButtonComponent, IconComponent } from '../../../../tools';

interface ServiceFormModel {
  id?: number;
  name: string;
  description: string;
  department: string;
  category: 'consultation' | 'therapy' | 'diagnostic' | 'surgical' | '';
  price: number | null;
  duration: number | null; // minutes
  consultationType: 'Consultation' | 'Therapy' | 'Diagnostic' | '';
  availability: 'Available' | 'Limited' | 'Unavailable' | '';
  tags?: string[];
  dependencies?: string[];
  maxBookings?: number | null;
  currentBookings?: number | null;
  timeSlots?: string;
  insuranceCoverage?: number | null;
  insuranceCodes?: string[];
  seasonalPricing?: boolean;
  discounts?: Array<{
    type: string;
    percentage: number;
    validUntil: string;
  }>;
  paymentPlans?: Array<{
    name: string;
    installments: number;
    interest: number;
  }>;
}

interface UploadedImage {
  file: File;
  previewUrl: string;
  name: string;
}

interface UploadedDocument {
  file: File;
  name: string;
  type: string;
}

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, AppInputComponent, AppSelectboxComponent, AppButtonComponent, IconComponent],
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.scss']
})
export class ServiceFormComponent implements OnDestroy {
  form: FormGroup;
  isEditMode = false;
  title = 'Add New Service';
  
  // Drag state
  isImagesDragOver = false;
  isDocsDragOver = false;
  
  // Uploaded media collections
  images: UploadedImage[] = [];
  documents: UploadedDocument[] = [];

  // New fields for enhanced features
  tags: string[] = [];
  dependencies: string[] = [];
  insuranceCodes: string[] = [];
  discounts: Array<{type: string; percentage: number; validUntil: string}> = [];
  paymentPlans: Array<{name: string; installments: number; interest: number}> = [];

  // Input values for new items
  newTag = '';
  newDependency = '';
  newInsuranceCode = '';

  departmentOptions = [
    { label: 'Select department', value: '' },
    { label: 'Internal Medicine', value: 'Internal Medicine' },
    { label: 'Cardiology', value: 'Cardiology' },
    { label: 'Dermatology', value: 'Dermatology' },
    { label: 'Neurology', value: 'Neurology' },
    { label: 'Orthopedics', value: 'Orthopedics' },
    { label: 'Pediatrics', value: 'Pediatrics' },
    { label: 'Radiology', value: 'Radiology' },
    { label: 'Urology', value: 'Urology' },
    { label: 'Rehabilitation', value: 'Rehabilitation' }
  ];

  categoryOptions = [
    { label: 'Select category', value: '' },
    { label: 'Consultation', value: 'consultation' },
    { label: 'Therapy', value: 'therapy' },
    { label: 'Diagnostic', value: 'diagnostic' },
    { label: 'Surgical', value: 'surgical' }
  ];

  typeOptions = [
    { label: 'Select service type', value: '' },
    { label: 'Consultation', value: 'Consultation' },
    { label: 'Therapy', value: 'Therapy' },
    { label: 'Diagnostic', value: 'Diagnostic' }
  ];

  availabilityOptions = [
    { label: 'Select availability', value: '' },
    { label: 'Available', value: 'Available' },
    { label: 'Limited', value: 'Limited' },
    { label: 'Unavailable', value: 'Unavailable' }
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    const state = this.router.getCurrentNavigation()?.extras.state as any;
    this.isEditMode = !!state && !!state.id;
    this.title = this.isEditMode ? 'Edit Service' : 'Add New Service';

    this.form = this.fb.group({
      id: this.fb.control<number | undefined>(state?.id),
      name: this.fb.control<string>(state?.name || '', { nonNullable: true, validators: [Validators.required, Validators.maxLength(120)] }),
      description: this.fb.control<string>(state?.description || '', { nonNullable: true, validators: [Validators.maxLength(1000)] }),
      department: this.fb.control<string>(state?.department || '', { nonNullable: true, validators: [Validators.required] }),
      category: this.fb.control<string>(state?.category || '', { nonNullable: true, validators: [Validators.required] }),
      price: this.fb.control<number | null>(state?.price ?? null, { validators: [Validators.required, Validators.min(0)] }),
      duration: this.fb.control<number | null>(state?.duration ?? null, { validators: [Validators.required, Validators.min(1)] }),
      consultationType: this.fb.control<string>(state?.consultationType || '', { nonNullable: true, validators: [Validators.required] }),
      availability: this.fb.control<string>(state?.availability || '', { nonNullable: true, validators: [Validators.required] }),
      maxBookings: this.fb.control<number | null>(state?.maxBookings ?? null, { validators: [Validators.min(0)] }),
      currentBookings: this.fb.control<number | null>(state?.currentBookings ?? null, { validators: [Validators.min(0)] }),
      timeSlots: this.fb.control<string>(state?.timeSlots || ''),
      insuranceCoverage: this.fb.control<number | null>(state?.insuranceCoverage ?? null, { validators: [Validators.min(0), Validators.max(100)] }),
      seasonalPricing: this.fb.control<boolean>(state?.seasonalPricing || false)
    });

    // Initialize arrays from state if editing
    if (state) {
      this.tags = state.tags || [];
      this.dependencies = state.dependencies || [];
      this.insuranceCodes = state.insuranceCodes || [];
      this.discounts = state.discounts || [];
      this.paymentPlans = state.paymentPlans || [];
    }
  }

  // Tag management methods
  addTag() {
    if (this.newTag.trim() && !this.tags.includes(this.newTag.trim())) {
      this.tags.push(this.newTag.trim());
      this.newTag = '';
    }
  }

  removeTag(index: number) {
    this.tags.splice(index, 1);
  }

  // Dependency management methods
  addDependency() {
    if (this.newDependency.trim() && !this.dependencies.includes(this.newDependency.trim())) {
      this.dependencies.push(this.newDependency.trim());
      this.newDependency = '';
    }
  }

  removeDependency(index: number) {
    this.dependencies.splice(index, 1);
  }

  // Insurance code management methods
  addInsuranceCode() {
    if (this.newInsuranceCode.trim() && !this.insuranceCodes.includes(this.newInsuranceCode.trim())) {
      this.insuranceCodes.push(this.newInsuranceCode.trim());
      this.newInsuranceCode = '';
    }
  }

  removeInsuranceCode(index: number) {
    this.insuranceCodes.splice(index, 1);
  }

  // Discount management methods
  addDiscount() {
    this.discounts.push({
      type: '',
      percentage: 0,
      validUntil: ''
    });
  }

  removeDiscount(index: number) {
    this.discounts.splice(index, 1);
  }

  updateDiscount(index: number, field: 'type' | 'percentage' | 'validUntil', value: string | number) {
    if (this.discounts[index]) {
      (this.discounts[index] as any)[field] = value;
    }
  }

  // Payment plan management methods
  addPaymentPlan() {
    this.paymentPlans.push({
      name: '',
      installments: 1,
      interest: 0
    });
  }

  removePaymentPlan(index: number) {
    this.paymentPlans.splice(index, 1);
  }

  updatePaymentPlan(index: number, field: 'name' | 'installments' | 'interest', value: string | number) {
    if (this.paymentPlans[index]) {
      (this.paymentPlans[index] as any)[field] = value;
    }
  }

  // Image upload methods
  onImagesDragOver(event: DragEvent) {
    event.preventDefault();
    this.isImagesDragOver = true;
  }

  onImagesDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isImagesDragOver = false;
  }

  onImagesDrop(event: DragEvent) {
    event.preventDefault();
    this.isImagesDragOver = false;
    const files = event.dataTransfer?.files;
    if (files) {
      this.processImageFiles(Array.from(files));
    }
  }

  onImagesSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files) {
      this.processImageFiles(Array.from(files));
    }
  }

  processImageFiles(files: File[]) {
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.images.push({
            file,
            previewUrl: e.target?.result as string,
            name: file.name
          });
        };
        reader.readAsDataURL(file);
      }
    });
  }

  removeImage(index: number) {
    this.images.splice(index, 1);
  }

  // Document upload methods
  onDocumentsDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDocsDragOver = true;
  }

  onDocumentsDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDocsDragOver = false;
  }

  onDocumentsDrop(event: DragEvent) {
    event.preventDefault();
    this.isDocsDragOver = false;
    const files = event.dataTransfer?.files;
    if (files) {
      this.processDocumentFiles(Array.from(files));
    }
  }

  onDocumentsSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files) {
      this.processDocumentFiles(Array.from(files));
    }
  }

  processDocumentFiles(files: File[]) {
    files.forEach(file => {
      this.documents.push({
        file,
        name: file.name,
        type: file.type
      });
    });
  }

  removeDocument(index: number) {
    this.documents.splice(index, 1);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = this.form.value;
    const serviceData = {
      ...formData,
      tags: this.tags,
      dependencies: this.dependencies,
      insuranceCodes: this.insuranceCodes,
      discounts: this.discounts,
      paymentPlans: this.paymentPlans,
      images: this.images.map(img => img.name),
      documents: this.documents.map(doc => doc.name)
    };

    console.log('Service data to save:', serviceData);
    
    // Here you would typically save to a service
    // For now, just navigate back
    this.router.navigate(['/admin/services']);
  }

  onCancel(): void {
    this.router.navigate(['/admin/services']);
  }

  onBack(): void {
    this.router.navigate(['/admin/services']);
  }

  ngOnDestroy(): void {
    // Cleanup any subscriptions or resources
  }
}


