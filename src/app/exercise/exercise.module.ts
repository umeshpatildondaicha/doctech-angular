import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseRoutingModule } from './exercise-routing.module';
import { ExerciseDashboardComponent } from './exercise-dashboard/exercise-dashboard.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ExerciseRoutingModule,
    ExerciseDashboardComponent
  ]
})
export class ExerciseModule { }
