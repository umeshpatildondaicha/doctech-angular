import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppButtonComponent } from '../../tools/app-button/app-button.component';
import { AppInputComponent } from '../../tools/app-input/app-input.component';
import { AppSelectboxComponent } from '../../tools/app-selectbox/app-selectbox.component';
import { IconComponent } from '../../tools/app-icon/icon.component';
import { Diet } from '../../interfaces/diet.interface';
import { Mode } from '../../types/mode.type';
import { UploadboxComponent } from '../../tools';
import { UploadedFile } from '../../interfaces/uploaded-file.interface';


export interface DialogData {
  diet?: Diet;
  mode: Mode;
}

@Component({
  selector: 'app-diet-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    AppButtonComponent,
    AppInputComponent,
    AppSelectboxComponent,
    IconComponent,
    UploadboxComponent
  ],
  templateUrl: './diet-create.component.html',
  styleUrl: './diet-create.component.scss'
})
export class DietCreateComponent {
  dietForm: FormGroup;
  mode: Mode = 'create';
  submitButtonText:string='Create Diet';
  dietTypes = [
    { value: 'Weight Loss', label: 'Weight Loss' },
    { value: 'Weight Gain', label: 'Weight Gain' },
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Diabetic', label: 'Diabetic' },
    { value: 'Low Carb', label: 'Low Carb' },
    { value: 'High Protein', label: 'High Protein' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DietCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.mode = data?.mode || 'create';
    this.submitButtonText = this.getsubmitButtonText();
    
    this.dietForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      dietType: ['', Validators.required],
      calories: ['', [Validators.required, Validators.min(500), Validators.max(5000)]],
      protein: ['', [Validators.required, Validators.min(0), Validators.max(500)]],
      carbs: ['', [Validators.required, Validators.min(0), Validators.max(1000)]],
      fat: ['', [Validators.required, Validators.min(0), Validators.max(200)]],
      fiber: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
    });

    // If editing or viewing existing diet, populate form
    if (data?.diet) {
      this.dietForm.patchValue({
        name: data.diet.name,
        description: data.diet.description,
        dietType: data.diet.dietType,
        calories: data.diet.calories,
        protein: data.diet.protein,
        carbs: data.diet.carbs,
        fat: data.diet.fat,
        fiber: data.diet.fiber
      });

      // Disable form in view mode
      if (this.mode === 'view') {
        this.dietForm.disable();
      }
    }
  }

  onSubmit() {
    if (this.dietForm.valid && this.mode !== 'view') {
      const dietData: Partial<Diet> = {
        ...this.dietForm.value,
        dietId: this.data?.diet?.dietId || this.generateDietId(),
        createdByDoctorId: this.data?.diet?.createdByDoctorId || 'DOC001', // In real app, get from auth service
        createdAt: this.data?.diet?.createdAt || new Date(),
        isActive: true
      };

      this.dialogRef.close(dietData);
    } else if (this.mode === 'view') {
      this.dialogRef.close();
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onEdit() {
    // Enable form for editing
    this.mode = 'edit';
    this.dietForm.enable();
  }

  private generateDietId(): string {
    return 'D' + Date.now().toString().slice(-6);
  }

  private markFormGroupTouched() {
    Object.keys(this.dietForm.controls).forEach(key => {
      const control = this.dietForm.get(key);
      control?.markAsTouched();
    });
  }

  get isEditMode(): boolean {
    return this.mode === 'edit';
  }

  get isViewMode(): boolean {
    return this.mode === 'view';
  }

  get isCreateMode(): boolean {
    return this.mode === 'create';
  }

  get dialogTitle(): string {
    switch (this.mode) {
      case 'create':
        return 'Create New Diet';
      case 'edit':
        return 'Edit Diet';
      case 'view':
        return 'View Diet';
      default:
        return 'Diet';
    }
  }

  getsubmitButtonText(): string {
    switch (this.mode) {
      case 'create':
        return 'Create Diet';
      case 'edit':
        return 'Update Diet';
      case 'view':
        return 'Close';
      default:
        return 'Save';
    }
  }

  get showEditButton(): boolean {
    return this.mode === 'edit';
  }

  getErrorMessage(fieldName: string): string {
    const control = this.dietForm.get(fieldName);
    if (control?.invalid && control?.touched) {
      switch (fieldName) {
        case 'name':
          return 'Diet name is required and must be at least 3 characters';
        case 'description':
          return 'Description is required and must be at least 10 characters';
        case 'dietType':
          return 'Please select a diet type';
        case 'calories':
          return 'Calories must be between 500 and 5000';
        case 'protein':
          return 'Protein must be between 0 and 500 grams';
        case 'carbs':
          return 'Carbs must be between 0 and 1000 grams';
        case 'fat':
          return 'Fat must be between 0 and 200 grams';
        case 'fiber':
          return 'Fiber must be between 0 and 100 grams';
        default:
          return 'This field is required';
      }
    }
    return '';
  }

  onFilesSelected(files: File[]): void {
    console.log('Selected files:', files);
  }

  onFileUploaded(file: UploadedFile): void {
    console.log('Uploaded file:', file);
  }
}
