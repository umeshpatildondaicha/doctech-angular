import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
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
import { ExerciseSet, Exercise } from '../../interfaces/exercise.interface';

@Component({
  selector: 'app-exercise-set-create',
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
  templateUrl: './exercise-set-create.component.html',
  styleUrl: './exercise-set-create.component.scss'
})
export class ExerciseSetCreateComponent {
  exerciseSetForm: FormGroup;
  exercises: Exercise[] = [];
  selectedCountry: string = '';
  selectedCountryControl = new FormControl(this.selectedCountry);
  mode: string = 'create';
  submitButtonText: string = 'Create Exercise Set';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ExerciseSetCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      exerciseSet?: ExerciseSet;
      availableExercises?: Exercise[];
      mode?: string;
    }
  ) {
    this.exercises = data?.availableExercises || this.getDefaultExercises();
    this.mode = data?.mode || 'create';
    this.submitButtonText = this.getsubmitButtonText();
    this.exerciseSetForm = this.fb.group({
      setNumber: ['', [Validators.required, Validators.min(1)]],
      exerciseId: ['', Validators.required],
      reps: ['', [Validators.required, Validators.min(1)]],
      holdTime: ['', [Validators.required, Validators.min(0)]],
      restTime: ['', [Validators.required, Validators.min(0)]]
    });

    // If editing existing exercise set, populate form
    if (data?.exerciseSet) {
      this.exerciseSetForm.patchValue({
        setNumber: data.exerciseSet.setNumber,
        exerciseId: data.exerciseSet.exerciseId,
        reps: data.exerciseSet.reps,
        holdTime: data.exerciseSet.holdTime,
        restTime: data.exerciseSet.restTime
      });
    }

    if(this.mode === 'view'){
      this.exerciseSetForm.disable();
    }
  }

  getsubmitButtonText(){
    return this.mode === 'edit' ? 'Update Exercise Set' : 'Create Exercise Set';
  }


  onSubmit() {
    if (this.exerciseSetForm.valid) {
      const exerciseSetData: Partial<ExerciseSet> = {
        ...this.exerciseSetForm.value,
        setId: this.data?.exerciseSet?.setId || this.generateSetId()
      };

      this.dialogRef.close(exerciseSetData);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  private generateSetId(): string {
    return 'SET' + Date.now().toString().slice(-6);
  }

  private markFormGroupTouched() {
    Object.keys(this.exerciseSetForm.controls).forEach(key => {
      const control = this.exerciseSetForm.get(key);
      control?.markAsTouched();
    });
  }

  private getDefaultExercises(): Exercise[] {
    return [
      {
        exerciseId: 'EX001',
        name: 'Push-ups',
        description: 'Standard push-ups to strengthen chest and arms',
        createdByDoctorId: 'DOC001',
        exerciseType: 'Strength'
      },
      {
        exerciseId: 'EX002',
        name: 'Squats',
        description: 'Basic squats for leg strength',
        createdByDoctorId: 'DOC001',
        exerciseType: 'Strength'
      },
      {
        exerciseId: 'EX003',
        name: 'Plank',
        description: 'Core strengthening exercise',
        createdByDoctorId: 'DOC001',
        exerciseType: 'Core'
      },
      {
        exerciseId: 'EX004',
        name: 'Stretching',
        description: 'Basic stretching exercises',
        createdByDoctorId: 'DOC001',
        exerciseType: 'Flexibility'
      }
    ];
  }

  get exerciseOptions() {
    return this.exercises.map(exercise => ({
      value: exercise.exerciseId,
      label: exercise.name
    }));
  }


  get selectedExercise(): Exercise | undefined {
    const exerciseId = this.exerciseSetForm.get('exerciseId')?.value;
    return this.exercises.find(ex => ex.exerciseId === exerciseId);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.exerciseSetForm.get(fieldName);
    if (control?.invalid && control?.touched) {
      switch (fieldName) {
        case 'setNumber':
          return 'Set number is required and must be at least 1';
        case 'exerciseId':
          return 'Please select an exercise';
        case 'reps':
          return 'Repetitions is required and must be at least 1';
        case 'holdTime':
          return 'Hold time is required and must be at least 0';
        case 'restTime':
          return 'Rest time is required and must be at least 0';
        default:
          return 'This field is required';
      }
    }
    return '';
  }

  onExerciseSelectionChange(event: any) {
    console.log(event);
  }
} 