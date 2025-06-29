import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';

interface ExerciseSet {
  sets: number;
  reps: number;
  hold?: number;
  rest: number;
}

interface Exercise {
  id: string;
  name: string;
  timeSlots: string[];
  mediaType: string;
  mediaUrl?: string;
  sets: ExerciseSet[];
  notifications: boolean;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description?: string;
}

@Component({
  selector: 'app-exercise-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatChipsModule,
    MatCheckboxModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit Exercise' : 'Add Exercise' }}</h2>
    <mat-dialog-content>
      <form #exerciseForm="ngForm" class="exercise-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Name</mat-label>
          <input matInput [(ngModel)]="exercise.name" name="name" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput [(ngModel)]="exercise.description" name="description" rows="3"></textarea>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Time Slots</mat-label>
            <mat-select [(ngModel)]="exercise.timeSlots" name="timeSlots" multiple required>
              <mat-option *ngFor="let slot of timeSlots" [value]="slot">
                {{slot}}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Difficulty</mat-label>
            <mat-select [(ngModel)]="exercise.difficulty" name="difficulty" required>
              <mat-option *ngFor="let diff of difficulties" [value]="diff">
                {{diff}}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Category</mat-label>
            <mat-select [(ngModel)]="exercise.category" name="category" required>
              <mat-option *ngFor="let cat of categories" [value]="cat">
                {{cat}}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="media-section">
          <h3>Media</h3>
          <div class="media-upload">
            <input
              type="file"
              #fileInput
              (change)="onFileSelected($event)"
              accept="image/*,video/*,.gif"
              style="display: none"
            >
            <button mat-stroked-button type="button" (click)="fileInput.click()">
              <mat-icon>upload</mat-icon>
              Upload Media
            </button>
            <span class="file-info" *ngIf="exercise.mediaUrl">
              {{getMediaTypeName(exercise.mediaType)}} uploaded
            </span>
          </div>
        </div>

        <div class="sets-section">
          <h3>Exercise Sets</h3>
          <div class="sets-list">
            <div *ngFor="let set of exercise.sets; let i = index" class="set-item">
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Sets</mat-label>
                  <input matInput type="number" [(ngModel)]="set.sets" [name]="'sets' + i" required min="1">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Reps</mat-label>
                  <input matInput type="number" [(ngModel)]="set.reps" [name]="'reps' + i" required min="1">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Hold (seconds)</mat-label>
                  <input matInput type="number" [(ngModel)]="set.hold" [name]="'hold' + i" min="0">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Rest (seconds)</mat-label>
                  <input matInput type="number" [(ngModel)]="set.rest" [name]="'rest' + i" required min="0">
                </mat-form-field>

                <button mat-icon-button color="warn" (click)="removeSet(i)" *ngIf="exercise.sets.length > 1">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
          </div>
          <button mat-stroked-button type="button" (click)="addSet()">
            <mat-icon>add</mat-icon>
            Add Set
          </button>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!exerciseForm.form.valid">
        {{ data ? 'Save' : 'Add' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .exercise-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px 0;
    }

    .full-width {
      width: 100%;
    }

    .form-row {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }

    .form-row mat-form-field {
      flex: 1;
    }

    .media-section,
    .sets-section {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 16px;
    }

    .media-section h3,
    .sets-section h3 {
      margin: 0 0 16px 0;
      color: #333;
    }

    .media-upload {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .file-info {
      color: #666;
      font-size: 14px;
    }

    .sets-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 16px;
    }

    .set-item {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 4px;
    }

    mat-dialog-actions {
      padding: 16px 0;
    }
  `]
})
export class ExerciseDialogComponent {
  exercise: Exercise;
  timeSlots = ['Morning', 'Afternoon', 'Evening', 'Night'];
  difficulties = ['Easy', 'Medium', 'Hard'];
  categories = ['Strength', 'Cardio', 'Flexibility', 'Balance', 'Recovery'];

  constructor(
    public dialogRef: MatDialogRef<ExerciseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Exercise | null
  ) {
    this.exercise = data ? { ...data } : {
      id: crypto.randomUUID(),
      name: '',
      timeSlots: ['Morning'],
      mediaType: 'Image',
      sets: [{ sets: 3, reps: 10, rest: 60 }],
      notifications: true,
      difficulty: 'Medium',
      category: 'Strength',
      description: ''
    };
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // Detect media type based on file type
    if (file.type.startsWith('image/')) {
      if (file.type === 'image/gif') {
        this.exercise.mediaType = 'GIF';
      } else {
        this.exercise.mediaType = 'Image';
      }
    } else if (file.type.startsWith('video/')) {
      this.exercise.mediaType = 'Video';
    }

    // In a real application, you would upload the file to a server here
    // For now, we'll just store the file name
    this.exercise.mediaUrl = file.name;
  }

  getMediaTypeName(type: string): string {
    switch (type) {
      case 'Image':
        return 'Image';
      case 'Video':
        return 'Video';
      case 'GIF':
        return 'GIF';
      default:
        return 'Media';
    }
  }

  addSet(): void {
    this.exercise.sets.push({ sets: 3, reps: 10, rest: 60 });
  }

  removeSet(index: number): void {
    this.exercise.sets.splice(index, 1);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.exercise);
  }
} 