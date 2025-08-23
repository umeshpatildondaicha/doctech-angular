import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppButtonComponent } from '../../tools/app-button/app-button.component';
import { AppInputComponent } from '../../tools/app-input/app-input.component';
import { AppSelectboxComponent } from '../../tools/app-selectbox/app-selectbox.component';
import { IconComponent } from '../../tools/app-icon/icon.component';
import { Exercise, ExerciseSet } from '../../interfaces/exercise.interface';
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
    MatChipsModule,
    MatCardModule,
    MatDividerModule,
    MatTooltipModule,
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

  categories = [
    { value: 'Strength', label: 'Strength' },
    { value: 'Cardio', label: 'Cardio' },
    { value: 'Flexibility', label: 'Flexibility' },
    { value: 'Balance', label: 'Balance' },
    { value: 'Core', label: 'Core' },
    { value: 'Stretching', label: 'Stretching' }
  ];

  difficulties = [
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' }
  ];

  mode: Mode = 'create';
  submitButtonText: string = 'Create Exercise';
  selectedFiles: File[] = [];

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
      exerciseType: ['', Validators.required],
      category: ['', Validators.required],
      difficulty: ['', Validators.required],
      targetMuscles: ['', Validators.required],
      equipment: [''],
      tags: [''],
      coachingCues: [''],
      contraindications: [''],
      sets: this.fb.array([])
    });

    if(this.mode === 'view'){
      this.exerciseForm.disable();
    }

    // If editing existing exercise, populate form
    if (data?.exercise) {
      this.exerciseForm.patchValue({
        name: data.exercise.name,
        description: data.exercise.description,
        exerciseType: data.exercise.exerciseType,
        category: data.exercise.category,
        difficulty: data.exercise.difficulty,
        targetMuscles: data.exercise.targetMuscles.join(', '),
        equipment: data.exercise.equipment.join(', '),
        tags: data.exercise.tags.join(', '),
        coachingCues: data.exercise.coachingCues,
        contraindications: data.exercise.contraindications
      });

      // Add existing sets
      if (data.exercise.sets && data.exercise.sets.length > 0) {
        data.exercise.sets.forEach(set => {
          this.addSet(set);
        });
      }
    }

    // Add at least one default set
    if (this.setsArray.length === 0) {
      this.addSet();
    }
  }

  get setsArray(): FormArray {
    return this.exerciseForm.get('sets') as FormArray;
  }

  getsubmitButtonText(): string {
    return this.mode === 'edit' ? 'Update Exercise' : this.mode === 'view' ? 'Close' : 'Create Exercise';
  }

  getErrorMessage(fieldName: string): string {
    const field = this.exerciseForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field?.hasError('minlength')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.getError('minlength').requiredLength} characters`;
    }
    return '';
  }

  addSet(existingSet?: ExerciseSet): void {
    const setForm = this.fb.group({
      setNumber: [existingSet?.setNumber || this.setsArray.length + 1, [Validators.required, Validators.min(1)]],
      reps: [existingSet?.reps || 10, [Validators.required, Validators.min(1)]],
      holdTime: [existingSet?.holdTime || 0, [Validators.required, Validators.min(0)]],
      restTime: [existingSet?.restTime || 60, [Validators.required, Validators.min(0)]],
      tempo: [existingSet?.tempo || 'tempo']
    });
    this.setsArray.push(setForm);
  }

  removeSet(index: number): void {
    if (this.setsArray.length > 1) {
      this.setsArray.removeAt(index);
      // Update set numbers
      this.setsArray.controls.forEach((control, i) => {
        control.patchValue({ setNumber: i + 1 });
      });
    }
  }

  applySetToAll(index: number): void {
    const sourceSet = this.setsArray.at(index).value;
    this.setsArray.controls.forEach((control, i) => {
      if (i !== index) {
        control.patchValue({
          reps: sourceSet.reps,
          holdTime: sourceSet.holdTime,
          restTime: sourceSet.restTime,
          tempo: sourceSet.tempo
        });
      }
    });
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      this.selectedFiles = Array.from(files);
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  onSubmit() {
    if (this.exerciseForm.valid) {
      const formValue = this.exerciseForm.value;
      
      // Convert comma-separated strings to arrays
      const exercise: Exercise = {
        exerciseId: this.data?.exercise?.exerciseId || 'EX' + Date.now(),
        name: formValue.name,
        description: formValue.description,
        createdByDoctorId: this.data?.exercise?.createdByDoctorId || 'DOC001',
        exerciseType: formValue.exerciseType,
        category: formValue.category,
        difficulty: formValue.difficulty,
        targetMuscles: formValue.targetMuscles.split(',').map((m: string) => m.trim()).filter((m: string) => m),
        equipment: formValue.equipment ? formValue.equipment.split(',').map((e: string) => e.trim()).filter((e: string) => e) : [],
        tags: formValue.tags ? formValue.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t) : [],
        coachingCues: formValue.coachingCues || '',
        contraindications: formValue.contraindications || '',
        sets: formValue.sets.map((set: any, index: number) => ({
          setId: `SET${Date.now()}${index}`,
          exerciseId: this.data?.exercise?.exerciseId || 'EX' + Date.now(),
          setNumber: set.setNumber,
          reps: set.reps,
          holdTime: set.holdTime,
          restTime: set.restTime,
          tempo: set.tempo
        })),
        media: this.selectedFiles.map(file => URL.createObjectURL(file)),
        createdAt: this.data?.exercise?.createdAt || new Date(),
        updatedAt: new Date()
      };

      this.dialogRef.close(exercise);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onDuplicate() {
    // Create a copy of the current exercise with a new ID
    if (this.data?.exercise) {
      const duplicatedExercise = {
        ...this.data.exercise,
        exerciseId: 'EX' + Date.now(),
        name: this.data.exercise.name + ' (Copy)',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.dialogRef.close(duplicatedExercise);
    }
  }
} 