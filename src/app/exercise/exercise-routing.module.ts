import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExerciseDashboardComponent } from './exercise-dashboard/exercise-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: ExerciseDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExerciseRoutingModule { }
