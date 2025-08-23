import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppButtonComponent } from '../../tools/app-button/app-button.component';
import { AppInputComponent } from '../../tools/app-input/app-input.component';
import { AppSelectboxComponent } from '../../tools/app-selectbox/app-selectbox.component';
import { IconComponent } from '../../tools/app-icon/icon.component';
import { ExerciseSet, Exercise } from '../../interfaces/exercise.interface';

interface ExerciseGroup {
  groupId: string;
  groupName: string;
  description?: string;
  category?: string;
  difficulty?: string;
  exercises: Exercise[];
  createdAt: Date;
  updatedAt: Date;
}

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
    MatChipsModule,
    MatTooltipModule,
    AppButtonComponent,
    AppInputComponent,
    AppSelectboxComponent,
    IconComponent
  ],
  templateUrl: './exercise-set-create.component.html',
  styleUrl: './exercise-set-create.component.scss'
})
export class ExerciseSetCreateComponent {
  exerciseGroupForm: FormGroup;
  exercises: Exercise[] = [];
  selectedExercises: Exercise[] = [];
  searchQuery: string = '';
  selectedCategory: string = '';
  selectedDifficulty: string = '';
  mode: string = 'create';
  submitButtonText: string = 'Create Exercise Group';

  // Options for dropdowns
  groupCategories = [
    { label: 'Strength Training', value: 'strength' },
    { label: 'Cardio', value: 'cardio' },
    { label: 'Flexibility', value: 'flexibility' },
    { label: 'Balance', value: 'balance' },
    { label: 'Functional', value: 'functional' },
    { label: 'Sports Specific', value: 'sports' },
    { label: 'Rehabilitation', value: 'rehabilitation' }
  ];

  difficultyLevels = [
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' },
    { label: 'Expert', value: 'expert' }
  ];

  categories = [
    { label: 'Strength', value: 'strength' },
    { label: 'Cardio', value: 'cardio' },
    { label: 'Flexibility', value: 'flexibility' },
    { label: 'Balance', value: 'balance' },
    { label: 'Functional', value: 'functional' },
    { label: 'Sports', value: 'sports' },
    { label: 'Rehabilitation', value: 'rehabilitation' }
  ];

  difficulties = [
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' },
    { label: 'Expert', value: 'expert' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ExerciseSetCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      exerciseGroup?: ExerciseGroup;
      availableExercises?: Exercise[];
      mode?: string;
    }
  ) {
    this.exercises = data?.availableExercises || this.getDefaultExercises();
    this.mode = data?.mode || 'create';
    this.submitButtonText = this.getsubmitButtonText();
    
    this.exerciseGroupForm = this.fb.group({
      groupName: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      category: [''],
      difficulty: ['']
    });

    // If editing existing exercise group, populate form
    if (data?.exerciseGroup) {
      this.exerciseGroupForm.patchValue({
        groupName: data.exerciseGroup.groupName,
        description: data.exerciseGroup.description,
        category: data.exerciseGroup.category,
        difficulty: data.exerciseGroup.difficulty
      });
      this.selectedExercises = [...data.exerciseGroup.exercises];
    }

    if(this.mode === 'view'){
      this.exerciseGroupForm.disable();
    }
  }

  getsubmitButtonText(){
    return this.mode === 'edit' ? 'Update Exercise Group' : 'Create Exercise Group';
  }

  getErrorMessage(fieldName: string): string {
    const field = this.exerciseGroupForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field?.hasError('minlength')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors?.['minlength'].requiredLength} characters`;
    }
    if (field?.hasError('min')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors?.['min'].min}`;
    }
    return '';
  }

  getFilteredExercises(): Exercise[] {
    return this.exercises.filter(exercise => {
      const matchesSearch = !this.searchQuery || 
        exercise.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        exercise.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        exercise.category.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        exercise.targetMuscles.some(muscle => muscle.toLowerCase().includes(this.searchQuery.toLowerCase()));

      const matchesCategory = !this.selectedCategory || exercise.category === this.selectedCategory;
      const matchesDifficulty = !this.selectedDifficulty || exercise.difficulty === this.selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }

  isExerciseSelected(exercise: Exercise): boolean {
    return this.selectedExercises.some(selected => selected.exerciseId === exercise.exerciseId);
  }

    toggleExerciseSelection(exercise: Exercise): void {
    if (this.isExerciseSelected(exercise)) {
      this.removeExerciseFromGroup(this.selectedExercises.findIndex(e => e.exerciseId === exercise.exerciseId));
    } else {
      this.addExerciseToGroup(exercise);
    }
  }

  addExerciseToGroup(exercise?: Exercise): void {
    if (exercise && !this.isExerciseSelected(exercise)) {
      this.selectedExercises.push(exercise);
    }
  }

  removeExerciseFromGroup(index: number): void {
    if (index >= 0 && index < this.selectedExercises.length) {
      this.selectedExercises.splice(index, 1);
    }
  }

  onCategoryFilterChange(): void {
    // Filter will be applied automatically in getFilteredExercises()
  }

  onDifficultyFilterChange(): void {
    // Filter will be applied automatically in getFilteredExercises()
  }

  onSubmit() {
    if (this.exerciseGroupForm.valid && this.selectedExercises.length > 0) {
      const exerciseGroupData: Partial<ExerciseGroup> = {
        ...this.exerciseGroupForm.value,
        groupId: this.data?.exerciseGroup?.groupId || this.generateGroupId(),
        exercises: this.selectedExercises,
        createdAt: this.data?.exerciseGroup?.createdAt || new Date(),
        updatedAt: new Date()
      };

      this.dialogRef.close(exerciseGroupData);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onDuplicate() {
    // Implement duplicate functionality
    console.log('Duplicate exercise group');
  }

  private generateGroupId(): string {
    return 'GROUP_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private markFormGroupTouched() {
    Object.keys(this.exerciseGroupForm.controls).forEach(key => {
      const control = this.exerciseGroupForm.get(key);
      control?.markAsTouched();
    });
  }

  private getDefaultExercises(): Exercise[] {
    return [
      {
        exerciseId: 'EX001',
        name: 'Push-ups',
        description: 'Classic bodyweight exercise for chest, shoulders, and triceps',
        createdByDoctorId: 'DOC001',
        exerciseType: 'Strength',
        category: 'strength',
        difficulty: 'beginner',
        targetMuscles: ['Chest', 'Shoulders', 'Triceps'],
        equipment: ['Bodyweight'],
        tags: ['bodyweight', 'chest', 'upper body'],
        coachingCues: 'Keep your body in a straight line, lower your chest to the ground',
        contraindications: 'Avoid if you have shoulder or wrist injuries',
        sets: [],
        media: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        exerciseId: 'EX002',
        name: 'Squats',
        description: 'Fundamental lower body exercise for legs and glutes',
        createdByDoctorId: 'DOC001',
        exerciseType: 'Strength',
        category: 'strength',
        difficulty: 'beginner',
        targetMuscles: ['Quads', 'Glutes', 'Hamstrings'],
        equipment: ['Bodyweight'],
        tags: ['bodyweight', 'legs', 'lower body'],
        coachingCues: 'Keep your chest up, knees behind toes, weight in heels',
        contraindications: 'Avoid if you have knee or back injuries',
        sets: [],
        media: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        exerciseId: 'EX003',
        name: 'Plank',
        description: 'Core stability exercise for abdominal and back muscles',
        createdByDoctorId: 'DOC001',
        exerciseType: 'Core',
        category: 'strength',
        difficulty: 'beginner',
        targetMuscles: ['Core', 'Shoulders', 'Back'],
        equipment: ['Bodyweight'],
        tags: ['bodyweight', 'core', 'stability'],
        coachingCues: 'Keep your body straight, engage your core, breathe steadily',
        contraindications: 'Avoid if you have shoulder or back injuries',
        sets: [],
        media: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }
} 