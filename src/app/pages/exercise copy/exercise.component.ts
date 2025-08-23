import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GridComponent } from '../../tools/grid/grid.component';
import { ExerciseSet, Exercise } from '../../interfaces/exercise.interface';
import { IconComponent } from '../../tools/app-icon/icon.component';
import { ExerciseCreateComponent } from '../exercise-create/exercise-create.component';
import { ExerciseSetCreateComponent } from '../exercise-set-create/exercise-set-create.component';

@Component({
  selector: 'app-exercise',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatDialogModule, GridComponent, IconComponent],
  templateUrl: './exercise.component.html',
  styleUrl: './exercise.component.scss'
})
export class ExerciseComponent implements OnInit {
  selectedTabIndex = 0;

  constructor(private dialog: MatDialog) {}

  // Sample data for Exercise Sets
  exerciseSets: ExerciseSet[] = [
    {
      setId: 'SET001',
      exerciseId: 'EX001',
      setNumber: 1,
      reps: 10,
      holdTime: 5,
      restTime: 60
    },
    {
      setId: 'SET002',
      exerciseId: 'EX001',
      setNumber: 2,
      reps: 12,
      holdTime: 3,
      restTime: 90
    },
    {
      setId: 'SET003',
      exerciseId: 'EX002',
      setNumber: 1,
      reps: 8,
      holdTime: 10,
      restTime: 120
    },
    {
      setId: 'SET004',
      exerciseId: 'EX003',
      setNumber: 1,
      reps: 15,
      holdTime: 2,
      restTime: 45
    },
    {
      setId: 'SET005',
      exerciseId: 'EX003',
      setNumber: 2,
      reps: 15,
      holdTime: 2,
      restTime: 45
    }
  ];

  // Sample data for Exercises
  exercises: Exercise[] = [
    {
      exerciseId: 'EX001',
      name: 'Push-ups',
      description: 'Standard push-ups to strengthen chest and arms',
      createdByDoctorId: 'DOC001',
      exerciseType: 'Strength'
    },
    {
      exerciseId: 'EX001',
      name: 'Push-ups',
      description: 'Standard push-ups to strengthen chest and arms',
      createdByDoctorId: 'DOC001',
      exerciseType: 'Strength'
    },
    {
      exerciseId: 'EX001',
      name: 'Push-ups',
      description: 'Standard push-ups to strengthen chest and arms',
      createdByDoctorId: 'DOC001',
      exerciseType: 'Strength'
    },
    {
      exerciseId: 'EX002',
      name: 'Plank Hold',
      description: 'Core strengthening exercise with static hold',
      createdByDoctorId: 'DOC002',
      exerciseType: 'Core'
    },
    {
      exerciseId: 'EX003',
      name: 'Squats',
      description: 'Lower body strength exercise',
      createdByDoctorId: 'DOC001',
      exerciseType: 'Strength'
    },
    {
      exerciseId: 'EX004',
      name: 'Stretching Routine',
      description: 'Flexibility and mobility exercises',
      createdByDoctorId: 'DOC003',
      exerciseType: 'Flexibility'
    },
    {
      exerciseId: 'EX005',
      name: 'Cardio Walking',
      description: 'Low-impact cardiovascular exercise',
      createdByDoctorId: 'DOC002',
      exerciseType: 'Cardio'
    }
  ];

  exerciseSetGridOptions: any = {};
  exerciseGridOptions: any = {};

  // Column definitions for Exercise Sets grid
  exerciseSetColumns = [
    { field: 'setNumber', headerName: 'Set Number', sortable: true, filter: true },
    { field: 'reps', headerName: 'Reps', sortable: true, filter: true },
    { field: 'holdTime', headerName: 'Hold Time (sec)', sortable: true, filter: true },
    { field: 'restTime', headerName: 'Rest Time (sec)', sortable: true, filter: true }
  ];

  // Column definitions for Exercises grid
  exerciseColumns = [
    { field: 'exerciseId', headerName: 'Exercise ID', sortable: true, filter: true },
    { field: 'name', headerName: 'Name', sortable: true, filter: true },
    { field: 'description', headerName: 'Description', sortable: true, filter: true },
    { field: 'createdByDoctorId', headerName: 'Created By', sortable: true, filter: true },
    { field: 'exerciseType', headerName: 'Exercise Type', sortable: true, filter: true }
  ];

  ngOnInit(): void {
    this.initializeGridOptions();
  }

  initializeGridOptions(){
    this.exerciseSetGridOptions.menuActions = [
      {
        "title":"View",
        "icon":"remove_red_eye",
        "click": (param:any)=> {this.onViewExerciseSet(param)}
      },
      {
        "title":"Edit",
        "icon":"edit",
        "click": (param:any)=> {this.onEditExerciseSet(param)}
      },
      {
        "title":"Delete",
        "icon":"delete",
        "click": (param:any)=> {this.onDeleteExerciseSet(param)}
      },
    ];

    

    this.exerciseGridOptions.menuActions = [
      {
        "title":"View",
        "icon":"remove_red_eye",
        "click": (param:any)=> {this.onViewExercise(param)}
      },
      {
        "title":"Edit",
        "icon":"edit",
        "click": (param:any)=> {this.onEditExercise(param)}
      },
      {
        "title":"Delete",
        "icon":"delete",
        "click": (param:any)=> {this.onDeleteExercise(param)}
      },
    ]
  }

  onViewExercise(param: any) {
    console.log('View exercise:', param);
    this.onAddExercise('view',param?.data);
  }
  onEditExercise(param: any) {
    console.log('Edit exercise:', param);
    this.onAddExercise('edit',param?.data);
  }
  onDeleteExercise(param: any) {
    console.log('Delete exercise:', param);
  }

  onViewExerciseSet(param: any) {
    console.log('View exercise set:', param);
    this.onAddExerciseSet('view',param?.data);
  }

  onEditExerciseSet(param: any) {
    console.log('Edit exercise set:', param);
    this.onAddExerciseSet('edit',param?.data);
  }

  onDeleteExerciseSet(param: any) {
    console.log('Delete exercise set:', param);
  }
  onTabChange(event: any) {
    this.selectedTabIndex = event.index;
  }

  onExerciseSetRowClick(event: any) {
    console.log('Exercise Set clicked:', event.data);
  }

  onExerciseRowClick(event: any) {
    console.log('Exercise clicked:', event.data);
  }

  onAddExerciseSet(mode: string = 'create',param?: any) {
    const dialogRef = this.dialog.open(ExerciseSetCreateComponent, {
      width: '50%',
      maxWidth: '90vw',
      data: {
        availableExercises: this.exercises,
        mode:mode,
        exerciseSet:param
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('New exercise set created:', result);
        // Add the new exercise set to the array
        this.exerciseSets.push(result as ExerciseSet);
        // Refresh the grid data
        this.exerciseSets = [...this.exerciseSets];
      }
    });
  }

  onAddExercise(mode: string = 'create', param?:Exercise) {
    const dialogRef = this.dialog.open(ExerciseCreateComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: {
        mode:mode,
        exercise:param
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('New exercise created:', result);
        // Add the new exercise to the array
        this.exercises.push(result as Exercise);
        // Refresh the grid data
        this.exercises = [...this.exercises];
      }
    });
  }
}
