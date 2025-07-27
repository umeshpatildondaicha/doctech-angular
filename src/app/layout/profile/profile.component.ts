import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppButtonComponent } from '../../tools/app-button/app-button.component';
import { AppInputComponent } from '../../tools/app-input/app-input.component';
import { IconComponent } from '../../tools/app-icon/icon.component';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppButtonComponent,
    AppInputComponent,
    IconComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  profileForm: FormGroup;
  isEditing = false;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      firstName: ['Dr. John', [Validators.required, Validators.minLength(2)]],
      lastName: ['Doe', [Validators.required, Validators.minLength(2)]],
      email: ['john.doe@shreeclinic.com', [Validators.required, Validators.email]],
      phone: ['+1 (555) 123-4567', [Validators.required]],
      specialization: ['General Medicine', [Validators.required]],
      licenseNumber: ['MD123456', [Validators.required]],
      experience: ['15', [Validators.required, Validators.min(0)]],
      bio: ['Experienced physician with over 15 years of practice in general medicine. Specialized in preventive care and chronic disease management.', [Validators.required, Validators.minLength(50)]]
    });
  }

  onEdit() {
    this.isEditing = true;
  }

  onSave() {
    if (this.profileForm.valid) {
      console.log('Profile updated:', this.profileForm.value);
      this.isEditing = false;
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
      bio: 'Experienced physician with over 15 years of practice in general medicine. Specialized in preventive care and chronic disease management.'
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
        default:
          return 'This field is required';
      }
    }
    return '';
  }
}
