import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { TableViewComponent } from '../../shared/components/table-view/table-view.component';
import { TableModifierComponent } from '../../shared/components/table-modifier/table-modifier.component';
import { ExerciseDialogComponent } from '../exercise-dialog/exercise-dialog.component';
import { GroupDialogComponent } from '../group-dialog/group-dialog.component';

interface ExerciseSet {
  reps: number;
  sets: number;
  weight?: number;
  duration?: number;
  hold?: number;
}

interface Exercise {
  id: string;
  name: string;
  timeSlot: string;
  mediaType: string;
  sets: ExerciseSet[];
  notifications: boolean;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description?: string;
  lastPerformed?: Date;
  nextScheduled?: Date;
}

interface ExerciseGroup {
  id: string;
  name: string;
  timeSlot: string;
  mediaType: string;
  exercises: Exercise[];
  notifications: boolean;
  schedule?: string[];
  description?: string;
}

@Component({
  selector: 'app-exercise-dashboard',
  templateUrl: './exercise-dashboard.component.html',
  styleUrls: ['./exercise-dashboard.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTooltipModule,
    TableViewComponent,
    TableModifierComponent
  ]
})
export class ExerciseDashboardComponent implements OnInit {
  exercises: Exercise[] = [];
  exerciseGroups: ExerciseGroup[] = [];
  selectedTab: number = 0;
  searchQuery: string = '';
  selectedTimeSlot: string = '';
  selectedMediaType: string = '';
  selectedDifficulty: string = '';
  selectedCategory: string = '';

  exerciseColumns = [
    { field: 'name', headerName: 'Name', sortable: true, filter: true },
    { field: 'timeSlot', headerName: 'Time Slot', sortable: true, filter: true },
    { field: 'mediaType', headerName: 'Media Type', sortable: true, filter: true },
    { field: 'difficulty', headerName: 'Difficulty', sortable: true, filter: true },
    { field: 'category', headerName: 'Category', sortable: true, filter: true },
    { field: 'lastPerformed', headerName: 'Last Performed', sortable: true, filter: true },
    { field: 'nextScheduled', headerName: 'Next Scheduled', sortable: true, filter: true }
  ];

  groupColumns = [
    { field: 'name', headerName: 'Name', sortable: true, filter: true },
    { field: 'timeSlot', headerName: 'Time Slot', sortable: true, filter: true },
    { field: 'mediaType', headerName: 'Media Type', sortable: true, filter: true },
    { field: 'schedule', headerName: 'Schedule', sortable: true, filter: true },
    { field: 'exercises', headerName: 'Exercises', sortable: true, filter: true }
  ];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadExercises();
    this.loadExerciseGroups();
  }

  loadExercises(): void {
    // Sample data for demonstration
    this.exercises = [
      {
        id: '1',
        name: 'Morning Stretch',
        timeSlot: 'Morning',
        mediaType: 'Video',
        sets: [{ reps: 10, sets: 3 }],
        notifications: true,
        difficulty: 'Easy',
        category: 'Stretching',
        lastPerformed: new Date('2024-03-15'),
        nextScheduled: new Date('2024-03-16')
      },
      // Add more sample exercises as needed
    ];
  }

  loadExerciseGroups(): void {
    // Sample data for demonstration
    this.exerciseGroups = [
      {
        id: '1',
        name: 'Morning Routine',
        timeSlot: 'Morning',
        mediaType: 'Video',
        exercises: [],
        notifications: true,
        schedule: ['Monday', 'Wednesday', 'Friday']
      },
      // Add more sample groups as needed
    ];
  }

  onTabChange(event: any): void {
    this.selectedTab = event.index;
  }

  onRowClick(event: any): void {
    const item = event.data;
    if (this.selectedTab === 0) {
      this.editExercise(item);
    } else {
      this.editGroup(item);
    }
  }

  onSelectionChange(event: any): void {
    console.log('Selected items:', event);
  }

  addExercise(): void {
    const dialogRef = this.dialog.open(ExerciseDialogComponent, {
      width: '600px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.exercises.push(result);
      }
    });
  }

  editExercise(exercise: Exercise): void {
    const dialogRef = this.dialog.open(ExerciseDialogComponent, {
      width: '600px',
      data: { mode: 'edit', exercise }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.exercises.findIndex(e => e.id === result.id);
        if (index !== -1) {
          this.exercises[index] = result;
        }
      }
    });
  }

  addGroup(): void {
    const dialogRef = this.dialog.open(GroupDialogComponent, {
      width: '600px',
      data: { mode: 'add', exercises: this.exercises }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.exerciseGroups.push(result);
      }
    });
  }

  editGroup(group: ExerciseGroup): void {
    const dialogRef = this.dialog.open(GroupDialogComponent, {
      width: '600px',
      data: { mode: 'edit', group, exercises: this.exercises }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.exerciseGroups.findIndex(g => g.id === result.id);
        if (index !== -1) {
          this.exerciseGroups[index] = result;
        }
      }
    });
  }

  openTableModifier(): void {
    const dialogRef = this.dialog.open(TableModifierComponent, {
      width: '800px',
      data: {
        columns: this.selectedTab === 0 ? this.exerciseColumns : this.groupColumns
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.selectedTab === 0) {
          this.exerciseColumns = result;
        } else {
          this.groupColumns = result;
        }
      }
    });
  }

  getActiveNotifications(): number {
    return this.exercises.filter(e => e.notifications).length +
           this.exerciseGroups.filter(g => g.notifications).length;
  }

  getTodayExercises(): number {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return this.exerciseGroups.filter(g => g.schedule?.includes(today)).length;
  }
}
