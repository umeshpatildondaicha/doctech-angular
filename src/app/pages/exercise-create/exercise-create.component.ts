import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppButtonComponent } from '../../tools/app-button/app-button.component';
import { AppInputComponent } from '../../tools/app-input/app-input.component';
import { AppSelectboxComponent } from '../../tools/app-selectbox/app-selectbox.component';
import { IconComponent } from '../../tools/app-icon/icon.component';
import { Exercise } from '../../interfaces/exercise.interface';
import { Mode } from '../../types/mode.type';

@Component({
  selector: 'app-exercise-create',
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
    MatDialogModule,
    AppButtonComponent,
    AppInputComponent,
    AppSelectboxComponent,
    IconComponent
  ],
  templateUrl: './exercise-create.component.html',
  styleUrl: './exercise-create.component.scss'
})
export class ExerciseCreateComponent {
  exerciseForm: FormGroup;
  exerciseTypes = [
    { value: 'Strength', label: 'Strength' },
    { value: 'Core', label: 'Core' },
    { value: 'Flexibility', label: 'Flexibility' },
    { value: 'Cardio', label: 'Cardio' },
    { value: 'Balance', label: 'Balance' },
    { value: 'Stretching', label: 'Stretching' }
  ];
  mode: Mode = 'create';
  submitButtonText: string = 'Create Exercise';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ExerciseCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { exercise?: Exercise, mode?: Mode }
  ) {
    this.mode = data?.mode || 'create';
    this.submitButtonText = this.getsubmitButtonText();

    this.exerciseForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      exerciseType: ['', Validators.required]
    });

    if(this.mode === 'view'){
      this.exerciseForm.disable();
    }

    // If editing existing exercise, populate form
    if (data?.exercise) {
      this.exerciseForm.patchValue({
        name: data.exercise.name,
        description: data.exercise.description,
        exerciseType: data.exercise.exerciseType
      });
    }
  }

  onSubmit() {
    if (this.exerciseForm.valid) {
      const exerciseData: Partial<Exercise> = {
        ...this.exerciseForm.value,
        exerciseId: this.data?.exercise?.exerciseId || this.generateExerciseId(),
        createdByDoctorId: this.data?.exercise?.createdByDoctorId || 'DOC001' // In real app, get from auth service
      };

      this.dialogRef.close(exerciseData);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  private generateExerciseId(): string {
    return 'EX' + Date.now().toString().slice(-6);
  }

  private markFormGroupTouched() {
    Object.keys(this.exerciseForm.controls).forEach(key => {
      const control = this.exerciseForm.get(key);
      control?.markAsTouched();
    });
  }

  getsubmitButtonText(): string {
    return this.mode === 'edit' ? 'Update Exercise' : 'Create Exercise';
  }

  getErrorMessage(fieldName: string): string {
    const control = this.exerciseForm.get(fieldName);
    if (control?.invalid && control?.touched) {
      switch (fieldName) {
        case 'name':
          return 'Exercise name is required and must be at least 2 characters';
        case 'description':
          return 'Description is required and must be at least 10 characters';
        case 'exerciseType':
          return 'Please select an exercise type';
        default:
          return 'This field is required';
      }
    }
    return '';
  }
} 