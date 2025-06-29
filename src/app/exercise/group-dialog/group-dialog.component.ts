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

interface Exercise {
  id: string;
  name: string;
  timeSlot: string;
  mediaType: string;
  sets: any[];
  notifications: boolean;
  difficulty: string;
  category: string;
}

interface ExerciseGroup {
  id: string;
  name: string;
  exercises: Exercise[];
  description?: string;
  schedule: {
    days: string[];
    timeSlot: string;
  };
}

@Component({
  selector: 'app-group-dialog',
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
    <h2 mat-dialog-title>{{ data.group ? 'Edit Group' : 'Add Group' }}</h2>
    <mat-dialog-content>
      <form #groupForm="ngForm" class="group-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Name</mat-label>
          <input matInput [(ngModel)]="group.name" name="name" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput [(ngModel)]="group.description" name="description" rows="3"></textarea>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Time Slot</mat-label>
            <mat-select [(ngModel)]="group.schedule.timeSlot" name="timeSlot" required>
              <mat-option *ngFor="let slot of timeSlots" [value]="slot">
                {{slot}}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="schedule-section">
          <h3>Schedule</h3>
          <div class="days-selection">
            <mat-checkbox
              *ngFor="let day of weekDays"
              [(ngModel)]="selectedDays[day]"
              (change)="updateScheduleDays()"
              [name]="day">
              {{day}}
            </mat-checkbox>
          </div>
        </div>

        <div class="exercises-section">
          <h3>Exercises</h3>
          <div class="exercises-list">
            <div *ngFor="let exercise of availableExercises" class="exercise-item">
              <mat-checkbox
                [(ngModel)]="selectedExercises[exercise.id]"
                [name]="'exercise' + exercise.id"
                (change)="updateGroupExercises()">
                {{exercise.name}} ({{exercise.category}})
              </mat-checkbox>
            </div>
          </div>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!groupForm.form.valid">
        {{ data.group ? 'Save' : 'Add' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .group-form {
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

    .schedule-section,
    .exercises-section {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 16px;
    }

    .schedule-section h3,
    .exercises-section h3 {
      margin: 0 0 16px 0;
      color: #333;
    }

    .days-selection {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }

    .exercises-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: 300px;
      overflow-y: auto;
    }

    .exercise-item {
      padding: 8px;
      border-radius: 4px;
      background: #f5f5f5;
    }

    mat-dialog-actions {
      padding: 16px 0;
    }
  `]
})
export class GroupDialogComponent {
  group: ExerciseGroup;
  availableExercises: Exercise[] = [];
  weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  timeSlots = ['Morning', 'Afternoon', 'Evening', 'Night'];
  selectedDays: { [key: string]: boolean } = {};
  selectedExercises: { [key: string]: boolean } = {};

  constructor(
    public dialogRef: MatDialogRef<GroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { group: ExerciseGroup | null, exercises: Exercise[] }
  ) {
    this.availableExercises = data.exercises;
    this.group = data.group ? { ...data.group } : {
      id: crypto.randomUUID(),
      name: '',
      exercises: [],
      description: '',
      schedule: {
        days: [],
        timeSlot: 'Morning'
      }
    };

    // Initialize selected days
    this.weekDays.forEach(day => {
      this.selectedDays[day] = this.group.schedule.days.includes(day);
    });

    // Initialize selected exercises
    this.availableExercises.forEach(exercise => {
      this.selectedExercises[exercise.id] = this.group.exercises.some(e => e.id === exercise.id);
    });
  }

  updateScheduleDays(): void {
    this.group.schedule.days = this.weekDays.filter(day => this.selectedDays[day]);
  }

  updateGroupExercises(): void {
    this.group.exercises = this.availableExercises.filter(exercise => this.selectedExercises[exercise.id]);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.updateScheduleDays();
    this.updateGroupExercises();
    this.dialogRef.close(this.group);
  }
} 